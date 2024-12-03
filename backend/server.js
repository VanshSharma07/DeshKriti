const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { dbConnect } = require('./utiles/db');
const socket = require('socket.io');
const http = require('http');
const path = require('path');
const multer = require('multer');
require('dotenv').config();
const communityRoutes = require('./routes/community/communityRoutes');
const loanRoutes = require('./routes/loanRoutes');
const campaignRoutes = require('./routes/dashboard/campaignRoutes');
const compression = require('compression');
const storyRoutes = require('./routes/story/storyRoutes');
const aiChatRoutes = require('./routes/chat/aiChatRoutes');
const stateGroupRoutes = require('./routes/community/stateGroupRoutes');

// Create HTTP server
const server = http.createServer(app);

// CORS configuration
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true
}));

// Socket.io setup
const io = socket(server, {
    cors: {
        origin: '*',
        credentials: true
    }
});

// Socket user management
let allCustomer = [];
let allSeller = [];
let admin = {};

const addUser = (customerId, socketId, userInfo) => {
    const checkUser = allCustomer.some(u => u.customerId === customerId);
    if (!checkUser) {
        allCustomer.push({ customerId, socketId, userInfo });
    }
};

const addSeller = (sellerId, socketId, userInfo) => {
    const checkSeller = allSeller.some(u => u.sellerId === sellerId);
    if (!checkSeller) {
        allSeller.push({ sellerId, socketId, userInfo });
    }
};

const findCustomer = (customerId) => allCustomer.find(c => c.customerId === customerId);
const findSeller = (sellerId) => allSeller.find(c => c.sellerId === sellerId);
const remove = (socketId) => {
    allCustomer = allCustomer.filter(c => c.socketId !== socketId);
    allSeller = allSeller.filter(c => c.socketId !== socketId);
};

const onlineUsers = new Map();

io.on('connection', (socket) => {
    socket.on('user_online', (userId) => {
        onlineUsers.set(userId, socket.id);
        io.emit('online_users', Array.from(onlineUsers.keys()));
    });

    socket.on('user_offline', (userId) => {
        onlineUsers.delete(userId);
        io.emit('online_users', Array.from(onlineUsers.keys()));
    });

    socket.on('join_community_chat', (userId) => {
        socket.join(`community_user_${userId}`);
    });

    socket.on('send_community_message', (data) => {
        const { receiverId, message } = data;
        
        // Emit to receiver
        socket.to(`community_user_${receiverId}`).emit('receive_community_message', {
            ...message,
            status: 'sent'
        });

        // If receiver is online, mark as delivered
        if (onlineUsers.has(receiverId)) {
            socket.to(`community_user_${receiverId}`).emit('message_delivered', {
                messageId: message._id,
                senderId: message.senderId
            });
        }
    });

    socket.on('message_delivered', (data) => {
        const { messageId, senderId } = data;
        socket.to(`community_user_${senderId}`).emit('message_status_update', {
            messageId,
            status: 'delivered'
        });
    });

    socket.on('message_seen', (data) => {
        const { messageId, senderId } = data;
        socket.to(`community_user_${senderId}`).emit('message_status_update', {
            messageId,
            status: 'seen'
        });
    });

    socket.on('disconnect', () => {
        // Find and remove disconnected user
        for (const [userId, socketId] of onlineUsers.entries()) {
            if (socketId === socket.id) {
                onlineUsers.delete(userId);
                io.emit('online_users', Array.from(onlineUsers.keys()));
                break;
            }
        }
    });

    socket.on('connection_status_change', async ({ connectionId, status }) => {
        // Broadcast connection status change to relevant users
        const connection = await CommunityConnection.findById(connectionId)
            .populate('senderId', 'firstName lastName image')
            .populate('receiverId', 'firstName lastName image');

        if (connection) {
            io.to(`user_${connection.senderId}`).emit('connection_update', {
                connectionId,
                status,
                otherUser: connection.receiverId
            });
            io.to(`user_${connection.receiverId}`).emit('connection_update', {
                connectionId,
                status,
                otherUser: connection.senderId
            });
        }
    });

    // Add new community-specific handlers
    socket.on('join_community_room', (userId) => {
        socket.join(`community_${userId}`);
        onlineUsers.set(userId, socket.id);
        io.emit('community_online_users', Array.from(onlineUsers.keys()));
    });

    socket.on('send_community_message', (data) => {
        const { receiverId, senderId, message, senderName } = data;
        
        // Emit to both sender and receiver rooms
        io.to(`community_${receiverId}`).emit('receive_community_message', {
            senderId,
            receiverId,
            message,
            senderName,
            createdAt: new Date()
        });
    });

    socket.on('add_community_user', (userId, userInfo) => {
        socket.join(`community_${userId}`);
        let temp = allCustomer.some(u => u.customerId === userId);
        if (!temp) {
            allCustomer.push({ customerId: userId, socketId: socket.id, userInfo });
        }
        io.emit('activeCustomer', allCustomer);
    });

    socket.on('send_community_message', (message) => {
        const { receiverId } = message;
        socket.to(`community_${receiverId}`).emit('receive_community_message', message);
    });

    socket.on('disconnect', () => {
        allCustomer = allCustomer.filter(u => u.socketId !== socket.id);
        io.emit('activeCustomer', allCustomer);
    });
});

// Middleware setup
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Add this before route registrations
app.use((req, res, next) => {
    req.io = io;
    next();
});

// API routes
app.use('/api/home', require('./routes/home/homeRoutes'));
app.use('/api', require('./routes/authRoutes'));
app.use('/api', require('./routes/order/orderRoutes'));
app.use('/api', require('./routes/home/cardRoutes'));
app.use('/api', require('./routes/dashboard/categoryRoutes'));
app.use('/api', require('./routes/dashboard/productRoutes'));
app.use('/api', require('./routes/dashboard/sellerRoutes'));
app.use('/api', require('./routes/home/customerAuthRoutes'));
app.use('/api', require('./routes/chatRoutes'));
app.use('/api', require('./routes/paymentRoutes'));
app.use('/api', require('./routes/dashboard/dashboardRoutes'));
app.use('/api', require('./routes/dashboard/eventRoutes'));
app.use('/api/community', require('./routes/community'));
app.use('/api/loan', loanRoutes);
app.use('/api/dashboard', campaignRoutes);
app.use('/api', campaignRoutes);
app.use('/api/story', storyRoutes);
app.use('/api/ai-chat', aiChatRoutes);

// Community routes
app.use('/api/community', require('./routes/community'));

// State Group routes
app.use('/api/community/state-groups', stateGroupRoutes);

// Basic route
app.get('/', (req, res) => res.send('Hello Server'));

// Error handling middleware
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File size is too large. Max limit is 5MB' });
        }
        return res.status(400).json({ error: err.message });
    }
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
});

// Database connection and server start
const port = process.env.PORT || 8000;

const startServer = async () => {
    try {
        await dbConnect();
        
        // Register models in correct order
        require('./models/sellerModel');  // Register seller model first
        require('./models/customerModel');
        require('./models/story/Story');
        require('./models/story/StoryComment');
        require('./models/community/Topic');
        require('./models/community/Comment');
        require('./models/Campaign');
        require('./models/UserLocation');
        require('./models/community/StateGroup');
        require('./models/community/StateGroupPost');

        server.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise rejection:', err);
    // In production, you might want to do some cleanup here
    // server.close(() => process.exit(1));
});
module.exports = { app, server, io }; // Export for testing purposes

app.use(compression()); // Add compression middleware
