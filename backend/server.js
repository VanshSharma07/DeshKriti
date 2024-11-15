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

// Socket.io event handling
io.on('connection', (soc) => {
    console.log('Socket server connected');

    soc.on('add_user', (customerId, userInfo) => {
        addUser(customerId, soc.id, userInfo);
        io.emit('activeSeller', allSeller);
    });

    soc.on('add_seller', (sellerId, userInfo) => {
        addSeller(sellerId, soc.id, userInfo);
        io.emit('activeSeller', allSeller);
    });

    soc.on('send_seller_message', (msg) => {
        const customer = findCustomer(msg.receverId);
        if (customer !== undefined) {
            soc.to(customer.socketId).emit('seller_message', msg);
        }
    });

    soc.on('send_customer_message', (msg) => {
        const seller = findSeller(msg.receverId);
        if (seller !== undefined) {
            soc.to(seller.socketId).emit('customer_message', msg);
        }
    });

    soc.on('send_message_admin_to_seller', (msg) => {
        const seller = findSeller(msg.receverId);
        if (seller !== undefined) {
            soc.to(seller.socketId).emit('receved_admin_message', msg);
        }
    });

    soc.on('send_message_seller_to_admin', (msg) => {
        if (admin.socketId) {
            soc.to(admin.socketId).emit('receved_seller_message', msg);
        }
    });

    soc.on('add_admin', (adminInfo) => {
        delete adminInfo.email;
        delete adminInfo.password;
        admin = adminInfo;
        admin.socketId = soc.id;
        io.emit('activeSeller', allSeller);
    });

    soc.on('disconnect', () => {
        console.log('User disconnected');
        remove(soc.id);
        io.emit('activeSeller', allSeller);
    });
});

// Middleware setup
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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