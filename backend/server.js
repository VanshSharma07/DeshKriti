const express = require('express');
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
const socialRoutes = require('./routes/social');
const WebSocketService = require('./services/websocket');

const app = express();

// Create HTTP server
const server = http.createServer(app);

// CORS configuration
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://192.168.29.10:3000',
    'http://192.168.29.10:3001'
];

app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) === -1) {
            var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Socket.io setup
const io = require('socket.io')(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        credentials: true
    }
});

// WebSocket service initialization
const wsService = new WebSocketService(server);

// Middleware setup
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Add this before route registrations
app.use((req, res, next) => {
    req.io = io;
    req.wsService = wsService; // Make wsService available to routes
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
app.use('/api/social', socialRoutes);

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

        // Add this after database connection
        console.log('Checking UserLocation model...');
        const UserLocation = require('./models/UserLocation');
        const sampleLocation = await UserLocation.findOne();
        console.log('Sample location from DB:', sampleLocation);

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
