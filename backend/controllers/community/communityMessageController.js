const CommunityMessage = require('../../models/community/CommunityChat');
const CommunityConnection = require('../../models/community/CommunityConnection');
const { responseReturn } = require('../../utiles/response');
const mongoose = require('mongoose');

class CommunityMessageController {
    // Add message between connected users
    add_message = async (req, res) => {
        const { receiverId, message } = req.body;
        const senderId = req.id;

        try {
            // Check connection status first
            const connection = await CommunityConnection.findOne({
                $or: [
                    {
                        $and: [
                            { senderId: senderId },
                            { receiverId: receiverId },
                            { status: 'accepted' }
                        ]
                    },
                    {
                        $and: [
                            { senderId: receiverId },
                            { receiverId: senderId },
                            { status: 'accepted' }
                        ]
                    }
                ]
            });

            if (!connection) {
                return responseReturn(res, 403, { error: 'Users must be connected to chat' });
            }

            // Create new message
            const newMessage = await CommunityMessage.create({
                senderId,
                receiverId,
                message,
                status: 'sent'
            });

            // Update connection's lastMessage timestamp
            await CommunityConnection.findByIdAndUpdate(
                connection._id,
                { lastMessage: new Date() }
            );

            responseReturn(res, 201, { message: newMessage });
        } catch (error) {
            console.log(error);
            responseReturn(res, 500, { error: 'Internal server error' });
        }
    };

    // Get message history between two users
    get_messages = async (req, res) => {
        const { receiverId } = req.params;
        const senderId = req.id;

        try {
            // Get messages between users
            const messages = await CommunityMessage.find({
                $or: [
                    {
                        $and: [{
                            receiverId: { $eq: receiverId }
                        }, {
                            senderId: { $eq: senderId }
                        }]
                    },
                    {
                        $and: [{
                            receiverId: { $eq: senderId }
                        }, {
                            senderId: { $eq: receiverId }
                        }]
                    }
                ]
            }).sort({ createdAt: 1 });

            // Mark unread messages as delivered
            await CommunityMessage.updateMany(
                {
                    senderId: receiverId,
                    receiverId: senderId,
                    status: 'sent'
                },
                { status: 'delivered' }
            );

            responseReturn(res, 200, { messages });
        } catch (error) {
            console.log(error);
            responseReturn(res, 500, { error: 'Internal server error' });
        }
    };

    // Get all connected users with last message info
    get_connected_users = async (req, res) => {
        const userId = req.id;
        console.log('🔵 Fetching connected users for:', userId);

        try {
            const userObjectId = new mongoose.Types.ObjectId(userId);
            
            // Debug log the query
            console.log('Query:', {
                $or: [
                    { senderId: userObjectId, status: 'accepted' },
                    { receiverId: userObjectId, status: 'accepted' }
                ]
            });
            
            const connections = await CommunityConnection.find({
                $or: [
                    { senderId: userObjectId, status: 'accepted' },
                    { receiverId: userObjectId, status: 'accepted' }
                ]
            })
            .populate('senderId', 'firstName lastName image')
            .populate('receiverId', 'firstName lastName image');

            console.log('Found raw connections:', connections);

            const connectedUsers = connections.map(conn => {
                const otherUser = conn.senderId._id.toString() === userId 
                    ? conn.receiverId 
                    : conn.senderId;

                return {
                    _id: otherUser._id,
                    connectionId: conn._id,
                    firstName: otherUser.firstName,
                    lastName: otherUser.lastName,
                    image: otherUser.image || '/images/user.png',
                    status: conn.status
                };
            });

            console.log('Formatted connected users:', connectedUsers);

            return responseReturn(res, 200, { 
                success: true, 
                connections: connectedUsers 
            });
        } catch (error) {
            console.error('Error in get_connected_users:', error);
            return responseReturn(res, 500, { 
                success: false, 
                error: 'Internal server error' 
            });
        }
    };

    // Mark messages as seen
    mark_messages_seen = async (req, res) => {
        const { senderId } = req.params;
        const receiverId = req.id;

        try {
            await CommunityMessage.updateMany(
                {
                    senderId,
                    receiverId,
                    status: { $ne: 'seen' }
                },
                { status: 'seen' }
            );

            responseReturn(res, 200, { success: true });
        } catch (error) {
            console.log(error);
            responseReturn(res, 500, { error: 'Internal server error' });
        }
    };
}

module.exports = new CommunityMessageController();