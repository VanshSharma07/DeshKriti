const Chat = require('../../models/social/Chat');
const { responseReturn } = require('../../utiles/response');

class ChatController {
    async createChat(req, res) {
        try {
            const { participantIds } = req.body;
            const customerId = req.id;

            const allParticipants = [...new Set([customerId, ...participantIds])];

            let chat = await Chat.findOne({
                participants: { $all: allParticipants, $size: allParticipants.length }
            }).populate('participants', 'firstName lastName image email');

            if (!chat) {
                chat = await Chat.create({
                    participants: allParticipants,
                    messages: []
                });
                chat = await chat.populate('participants', 'firstName lastName image email');
            }

            responseReturn(res, 200, { chat });
        } catch (error) {
            console.error('Create chat error:', error);
            responseReturn(res, 500, { error: error.message });
        }
    }

    async getChatById(req, res) {
        try {
            const { chatId } = req.params;
            const customerId = req.id;

            const chat = await Chat.findById(chatId)
                .populate('participants', 'firstName lastName image email');

            if (!chat) {
                return responseReturn(res, 404, { error: 'Chat not found' });
            }

            if (!chat.participants.some(p => p._id.toString() === customerId)) {
                return responseReturn(res, 403, { error: 'Not authorized to view this chat' });
            }

            responseReturn(res, 200, { chat });
        } catch (error) {
            console.error('Get chat error:', error);
            responseReturn(res, 500, { error: error.message });
        }
    }

    async sendMessage(req, res) {
        try {
            const { chatId } = req.params;
            const { text } = req.body;
            const customerId = req.id;

            const chat = await Chat.findById(chatId);
            if (!chat) {
                return responseReturn(res, 404, { error: 'Chat not found' });
            }

            if (!chat.participants.some(p => p.toString() === customerId)) {
                return responseReturn(res, 403, { error: 'Not authorized to send messages in this chat' });
            }

            const newMessage = {
                senderId: customerId,
                text: text,
                timestamp: new Date()
            };

            chat.messages.push(newMessage);
            chat.lastMessage = new Date();
            await chat.save();

            responseReturn(res, 200, { message: newMessage });
        } catch (error) {
            console.error('Send message error:', error);
            responseReturn(res, 500, { error: error.message });
        }
    }

    async getChats(req, res) {
        try {
            const customerId = req.id;

            const chats = await Chat.find({
                participants: customerId
            }).populate('participants', 'firstName lastName image email');

            responseReturn(res, 200, { chats });
        } catch (error) {
            console.error('Get chats error:', error);
            responseReturn(res, 500, { error: error.message });
        }
    }

    async markAsRead(req, res) {
        try {
            const { chatId } = req.params;
            const customerId = req.id;

            const chat = await Chat.findById(chatId);
            if (!chat) {
                return responseReturn(res, 404, { error: 'Chat not found' });
            }

            responseReturn(res, 200, { success: true });
        } catch (error) {
            console.error('Mark as read error:', error);
            responseReturn(res, 500, { error: error.message });
        }
    }

    async deleteChat(req, res) {
        try {
            const { chatId } = req.params;
            const customerId = req.id;

            const chat = await Chat.findOneAndDelete({
                _id: chatId,
                participants: customerId
            });

            if (!chat) {
                return responseReturn(res, 404, { error: 'Chat not found or unauthorized' });
            }

            responseReturn(res, 200, { success: true });
        } catch (error) {
            console.error('Delete chat error:', error);
            responseReturn(res, 500, { error: error.message });
        }
    }
}

// Export a new instance of the class
const chatController = new ChatController();
module.exports = chatController; 