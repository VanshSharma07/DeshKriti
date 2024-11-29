const mongoose = require('mongoose');
const CommunityConnection = require('../../models/community/CommunityConnection');
const CommunityMessage = require('../../models/community/CommunityChat');
const { responseReturn } = require('../../utiles/response');

class CommunityConnectionController {
    constructor() {
        console.log('CommunityConnection model:', {
            modelName: CommunityConnection.modelName,
            collectionName: CommunityConnection.collection.name
        });
    }

    // Send connection request
    sendConnectionRequest = async (req, res) => {
        const { receiverId } = req.body;
        const senderId = req.id;
        
        console.log('🔵 Starting Connection Request Process:', { senderId, receiverId });

        try {
            // Check if connection already exists
            const existingConnection = await CommunityConnection.findOne({
                $or: [
                    { senderId, receiverId },
                    { senderId: receiverId, receiverId: senderId }
                ]
            });

            if (existingConnection) {
                console.log('⚠️ Connection already exists:', existingConnection);
                return responseReturn(res, 400, {
                    success: false,
                    message: `Connection already ${existingConnection.status}`
                });
            }

            // Create new connection request
            const connection = await CommunityConnection.create({
                senderId,
                receiverId,
                status: 'pending'
            });

            console.log('✅ Connection request created:', connection);

            // Notify receiver about new connection request
            req.io?.to(`user_${receiverId}`).emit('new_connection_request', {
                connection,
                sender: await mongoose.model('customer').findById(senderId)
                    .select('firstName lastName image')
            });

            return responseReturn(res, 200, {
                success: true,
                message: 'Connection request sent successfully',
                connection
            });
        } catch (error) {
            console.error('❌ Error in sendConnectionRequest:', error);
            return responseReturn(res, 500, {
                success: false,
                message: 'Internal server error'
            });
        }
    };

    // Get pending connection requests
    getPendingRequests = async (req, res) => {
        const userId = req.id;
        console.log('Fetching pending requests for user:', userId);

        try {
            const userObjectId = new mongoose.Types.ObjectId(userId);

            const pendingRequests = await CommunityConnection.find({
                $or: [
                    { receiverId: userObjectId, status: 'pending' },
                    { senderId: userObjectId, status: 'pending' }
                ]
            })
            .populate('senderId', 'firstName lastName email image')
            .populate('receiverId', 'firstName lastName email image')
            .lean();

            console.log('Raw pending requests:', JSON.stringify(pendingRequests, null, 2));

            const formattedRequests = pendingRequests.map(request => {
                const isSender = request.senderId._id.toString() === userId;
                const otherUser = isSender ? request.receiverId : request.senderId;
                
                return {
                    _id: request._id.toString(),
                    otherUser: {
                        _id: otherUser._id.toString(),
                        firstName: otherUser.firstName || '',
                        lastName: otherUser.lastName || '',
                        image: otherUser.image || '/images/user.png'
                    },
                    isSender,
                    status: request.status,
                    createdAt: request.createdAt
                };
            });

            console.log('Formatted requests:', JSON.stringify(formattedRequests, null, 2));

            responseReturn(res, 200, { 
                success: true, 
                requests: formattedRequests 
            });
        } catch (error) {
            console.error('Error in getPendingRequests:', error);
            responseReturn(res, 500, {
                success: false,
                message: error.message || 'Internal server error'
            });
        }
    };

    // Handle connection request (accept/reject)
    handleConnectionRequest = async (req, res) => {
        const { connectionId, status } = req.body;
        const userId = req.id;

        try {
            const connection = await CommunityConnection.findById(connectionId);
            
            if (!connection) {
                return responseReturn(res, 404, { 
                    success: false, 
                    message: 'Connection request not found' 
                });
            }

            if (connection.receiverId.toString() !== userId) {
                return responseReturn(res, 403, { 
                    success: false, 
                    message: 'Not authorized' 
                });
            }

            connection.status = status;
            await connection.save();

            // Notify sender about the status change
            req.io.to(`user_${connection.senderId}`).emit('connection_request_update', {
                connectionId: connection._id,
                status
            });

            responseReturn(res, 200, { 
                success: true, 
                message: `Connection request ${status}`,
                connection 
            });
        } catch (error) {
            console.error('Error in handleConnectionRequest:', error);
            responseReturn(res, 500, { 
                success: false, 
                message: 'Internal server error' 
            });
        }
    };

    checkConnectionStatus = async (req, res) => {
        const { userId } = req.params;
        const currentUserId = req.id;

        try {
            console.log('🔵 Checking connection status:', { userId, currentUserId });

            // Don't check connection with self
            if (userId === currentUserId) {
                return responseReturn(res, 200, { status: 'self' });
            }

            const connection = await CommunityConnection.findOne({
                $or: [
                    { senderId: currentUserId, receiverId: userId },
                    { senderId: userId, receiverId: currentUserId }
                ]
            });

            console.log('✅ Found connection:', connection);

            if (!connection) {
                return responseReturn(res, 200, { status: 'none' });
            }

            // If current user is receiver and status is pending, show 'pending_received'
            if (connection.receiverId.toString() === currentUserId && connection.status === 'pending') {
                return responseReturn(res, 200, { status: 'pending_received' });
            }

            return responseReturn(res, 200, { 
                status: connection.status,
                connection: connection 
            });
        } catch (error) {
            console.error('❌ Error in checkConnectionStatus:', error);
            return responseReturn(res, 500, { 
                success: false, 
                message: 'Internal server error' 
            });
        }
    };
}

module.exports = new CommunityConnectionController();