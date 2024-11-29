const router = require('express').Router();
const messageRoutes = require('./communityMessageRoutes');
const connectionRoutes = require('./communityConnectionRoutes');
const mapRoutes = require('./mapRoutes');
const communityRoutes = require('./communityRoutes');

// Combine all community-related routes
router.use('/', communityRoutes);  // General community routes
router.use('/connection', connectionRoutes);  // Connection-related routes
router.use('/messages', messageRoutes);  // Message-related routes
router.use('/map', mapRoutes);  // Map-related routes

module.exports = router;