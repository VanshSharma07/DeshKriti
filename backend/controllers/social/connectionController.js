const Connection = require('../../models/social/Connection');
const customer = require('../../models/customerModel');
const { responseReturn } = require('../../utiles/response');
const mongoose = require('mongoose');

class ConnectionController {
    // Send friend request
    followUser = async (req, res) => {
        try {
            const followerId = req.id; // Current user
            const { followingId } = req.body; // User to follow

            console.log('Follow request received:', {
                followerId,
                followingId,
                body: req.body
            });

            // Enhanced validation
            if (!followerId || !followingId) {
                return responseReturn(res, 400, {
                    error: 'Invalid request parameters',
                    details: {
                        followerId: followerId || 'missing',
                        followingId: followingId || 'missing'
                    }
                });
            }

            // Prevent self-following
            if (followerId === followingId) {
                return responseReturn(res, 400, {
                    error: 'Users cannot follow themselves'
                });
            }

            // Check if users exist
            const [followerUser, followingUser] = await Promise.all([
                customer.findById(followerId),
                customer.findById(followingId)
            ]);

            if (!followerUser || !followingUser) {
                return responseReturn(res, 404, {
                    error: 'One or both users not found',
                    details: {
                        followerExists: !!followerUser,
                        followingExists: !!followingUser
                    }
                });
            }

            // Check for existing connection
            const existingConnection = await Connection.findOne({
                $or: [
                    { follower: followerId, following: followingId },
                    { follower: followingId, following: followerId }
                ]
            });

            if (existingConnection) {
                return responseReturn(res, 400, {
                    error: 'Connection already exists',
                    status: existingConnection.status
                });
            }

            // Create new connection with explicit field names
            const newConnection = await Connection.create({
                follower: followerId,
                following: followingId,
                status: 'pending'
            });

            // Log the created connection
            console.log('New connection created:', newConnection);

            // Return success response
            responseReturn(res, 200, {
                message: 'Follow request sent successfully',
                connection: {
                    id: newConnection._id,
                    follower: followerId,
                    following: followingId,
                    status: newConnection.status
                }
            });

        } catch (error) {
            console.error('Follow user error:', error);
            responseReturn(res, 500, {
                error: 'Failed to process follow request',
                details: error.message
            });
        }
    };

    // Accept friend request
    acceptRequest = async (req, res) => {
        try {
            const userId = req.id;
            const { requestId } = req.params;

            const connection = await Connection.findOne({
                _id: requestId,
                following: userId,
                status: 'pending'
            });

            if (!connection) {
                return responseReturn(res, 404, { error: 'Request not found or already processed' });
            }

            connection.status = 'accepted';
            await connection.save();

            // Update connection counts for both users
            await Promise.all([
                this.updateConnectionCounts(connection.follower),
                this.updateConnectionCounts(connection.following)
            ]);

            responseReturn(res, 200, { 
                message: 'Friend request accepted',
                connection 
            });
        } catch (error) {
            console.error('Accept request error:', error);
            responseReturn(res, 500, { error: error.message });
        }
    };

    // Get friends list
    getFriends = async (req, res) => {
        try {
            const userId = req.id;

            // Find all accepted connections where user is either follower or following
            const connections = await Connection.find({
                $or: [
                    { follower: userId, status: 'accepted' },
                    { following: userId, status: 'accepted' }
                ]
            }).populate('follower following', 'firstName lastName email image');

            // Format the friends list
            const friends = connections.map(conn => {
                // If current user is the follower, return the following user, else return the follower
                const friend = conn.follower._id.toString() === userId ? conn.following : conn.follower;
                return {
                    _id: friend._id,
                    firstName: friend.firstName,
                    lastName: friend.lastName,
                    email: friend.email,
                    image: friend.image
                };
            });

            return res.status(200).json({ friends });
        } catch (error) {
            console.error('Get friends error:', error);
            return res.status(500).json({ 
                message: "Error fetching friends list",
                error: error.message 
            });
        }
    };

    // Get pending friend requests
    getPendingRequests = async (req, res) => {
        try {
            const userId = req.id;
            
            // Find all pending connections where the current user is the following (receiver)
            const pendingRequests = await Connection.find({
                following: userId,
                status: 'pending'
            }).populate('follower', 'firstName lastName image email');

            console.log('Pending requests found:', pendingRequests);

            const formattedRequests = pendingRequests.map(request => ({
                _id: request._id,
                sender: {
                    _id: request.follower._id,
                    firstName: request.follower.firstName,
                    lastName: request.follower.lastName,
                    image: request.follower.image,
                    email: request.follower.email
                },
                status: request.status,
                createdAt: request.createdAt
            }));

            responseReturn(res, 200, { 
                pendingRequests: formattedRequests,
                total: formattedRequests.length 
            });
        } catch (error) {
            console.error('Get pending requests error:', error);
            responseReturn(res, 500, { error: error.message });
        }
    };

    // Reject friend request
    rejectRequest = async (req, res) => {
        const userId = req.id;
        const { requestId } = req.params;

        try {
            const connection = await Connection.findOneAndUpdate(
                {
                    _id: requestId,
                    followingId: userId,
                    status: 'pending'
                },
                { status: 'rejected' },
                { new: true }
            );

            if (!connection) {
                return responseReturn(res, 404, { error: 'Request not found' });
            }

            responseReturn(res, 200, {
                message: 'Friend request rejected',
                connection
            });
        } catch (error) {
            console.error('Reject request error:', error);
            responseReturn(res, 500, { error: error.message });
        }
    };

    // Get connection status
    getConnectionStatus = async (req, res) => {
        const userId = req.id;
        const { targetId } = req.params;

        try {
            const connection = await Connection.findOne({
                $or: [
                    { follower: userId, following: targetId },
                    { follower: targetId, following: userId }
                ]
            });

            responseReturn(res, 200, {
                status: connection ? connection.status : 'none',
                connection
            });
        } catch (error) {
            console.error('Get connection status error:', error);
            responseReturn(res, 500, { error: error.message });
        }
    };

    // Unfollow a user
    unfollowUser = async (req, res) => {
        try {
            const followerId = req.id;
            const followingId = req.params.followingId;

            console.log('Unfollow request:', { followerId, followingId });

            // Delete the connection
            const result = await Connection.findOneAndDelete({
                $or: [
                    { follower: followerId, following: followingId },
                    { follower: followingId, following: followerId }
                ]
            });

            if (!result) {
                return responseReturn(res, 404, { error: 'Connection not found' });
            }

            responseReturn(res, 200, {
                message: 'Unfollowed successfully'
            });

        } catch (error) {
            console.error('Unfollow user error:', error);
            responseReturn(res, 500, { error: error.message });
        }
    };

    // Get user's followers
    getFollowers = async (req, res) => {
        const userId = req.params.userId || req.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        try {
            const [followers, total] = await Promise.all([
                Connection.find({
                    following: userId,
                    status: 'accepted'
                })
                .populate('follower', 'firstName lastName image location')
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),

                Connection.countDocuments({
                    following: userId,
                    status: 'accepted'
                })
            ]);

            responseReturn(res, 200, {
                followers: followers.map(f => f.follower),
                total,
                page,
                totalPages: Math.ceil(total / limit)
            });

        } catch (error) {
            console.error('Get followers error:', error);
            responseReturn(res, 500, { error: error.message });
        }
    };

    // Get users being followed by current user
    getFollowing = async (req, res) => {
        const userId = req.params.userId || req.id;
        
        try {
            console.log('Fetching following list for userId:', userId);

            const connections = await Connection.find({
                follower: userId,
                status: 'accepted'
            })
            .populate('following', 'firstName lastName image location')
            .sort('-createdAt')
            .lean();

            console.log('Connections found:', connections);

            const following = connections.map(conn => ({
                _id: conn.following._id,
                firstName: conn.following.firstName,
                lastName: conn.following.lastName,
                image: conn.following.image,
                location: conn.following.location
            }));

            console.log('Mapped following data:', following);

            responseReturn(res, 200, { 
                following,
                total: following.length 
            });

        } catch (error) {
            console.error('Get following error:', error);
            responseReturn(res, 500, { error: error.message });
        }
    };

    // Get suggested users to follow
    getSuggestions = async (req, res) => {
        const userId = req.id;
        const limit = parseInt(req.query.limit) || 5;

        try {
            // Get all connections where user is involved
            const connections = await Connection.find({
                $or: [
                    { follower: userId },
                    { following: userId }
                ]
            });
            
            // Get all user IDs that are connected (regardless of status)
            const connectedUserIds = connections.map(conn => 
                conn.follower.toString() === userId ? conn.following : conn.follower
            );
            
            // Add current user to excluded list
            connectedUserIds.push(userId);

            // Find users not in the connected list
            const suggestions = await customer.find({
                _id: { $nin: connectedUserIds }
            })
            .select('firstName lastName image email')
            .limit(limit);

            responseReturn(res, 200, { suggestions });

        } catch (error) {
            console.error('Get suggestions error:', error);
            responseReturn(res, 500, { error: error.message });
        }
    };

    // Add a new method to fix/reset counts for all users
    fixUserCounts = async (req, res) => {
        try {
            console.log('Starting to fix user counts');

            // Get all users
            const users = await customer.find({});

            for (const user of users) {
                // Count actual connections
                const [followerCount, followingCount] = await Promise.all([
                    Connection.countDocuments({
                        followingId: user._id,
                        status: 'accepted'
                    }),
                    Connection.countDocuments({
                        followerId: user._id,
                        status: 'accepted'
                    })
                ]);

                // Update user with correct counts
                await customer.findByIdAndUpdate(user._id, {
                    followersCount: followerCount,
                    followingCount: followingCount
                });

                console.log(`Updated counts for user ${user._id}:`, {
                    followerCount,
                    followingCount
                });
            }

            responseReturn(res, 200, {
                message: 'All user counts have been updated'
            });

        } catch (error) {
            console.error('Fix user counts error:', error);
            responseReturn(res, 500, { error: error.message });
        }
    };

    // Add this new method to get connection counts
    getConnectionCounts = async (req, res) => {
        const userId = req.params.userId || req.id;
        
        try {
            console.log('Getting connection counts for userId:', userId);
            
            if (!userId) {
                return responseReturn(res, 400, { error: 'User ID is required' });
            }

            // Get all connections for this user
            const [followers, following] = await Promise.all([
                Connection.find({
                    followingId: userId,
                    status: 'accepted'
                }).lean(),
                Connection.find({
                    followerId: userId,
                    status: 'accepted'
                }).lean()
            ]);

            console.log('Found connections:', {
                followers: followers.length,
                following: following.length
            });

            // Get current user's stored counts
            const user = await customer.findById(userId).select('followersCount followingCount');
            
            if (!user) {
                return responseReturn(res, 404, { error: 'User not found' });
            }

            console.log('Current stored counts:', {
                followersCount: user.followersCount,
                followingCount: user.followingCount
            });

            // Update the counts if they don't match
            if (user.followersCount !== followers.length || user.followingCount !== following.length) {
                console.log('Counts mismatch detected, updating...');
                await customer.findByIdAndUpdate(userId, {
                    followersCount: followers.length,
                    followingCount: following.length
                });
            }

            responseReturn(res, 200, {
                actualCounts: {
                    followers: followers.length,
                    following: following.length
                },
                storedCounts: {
                    followers: user.followersCount,
                    following: user.followingCount
                }
            });

        } catch (error) {
            console.error('Get connection counts error:', error);
            responseReturn(res, 500, { error: error.message });
        }
    };

    // Add this method to get both followers and following counts
    getUserCounts = async (req, res) => {
        const userId = req.params.userId || req.id;

        try {
            const [followers, following] = await Promise.all([
                Connection.countDocuments({
                    followingId: userId,
                    status: 'accepted'
                }),
                Connection.countDocuments({
                    followerId: userId,
                    status: 'accepted'
                })
            ]);

            // Update the user's stored counts
            await customer.findByIdAndUpdate(userId, {
                followersCount: followers,
                followingCount: following
            });

            responseReturn(res, 200, {
                followers,
                following
            });

        } catch (error) {
            console.error('Get user counts error:', error);
            responseReturn(res, 500, { error: error.message });
        }
    };

    updateConnectionCounts = async (userId) => {
        try {
            const [followers, following] = await Promise.all([
                Connection.countDocuments({ following: userId, status: 'accepted' }),
                Connection.countDocuments({ follower: userId, status: 'accepted' })
            ]);

            // Update the user's connection counts in the database or cache
            // Example: await User.updateOne({ _id: userId }, { followers, following });

            console.log(`Updated connection counts for user ${userId}:`, { followers, following });
        } catch (error) {
            console.error('Error updating connection counts:', error);
        }
    };
}

module.exports = new ConnectionController(); 