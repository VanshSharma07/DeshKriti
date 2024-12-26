const router = require('express').Router();
const aiChatController = require('../../controllers/chat/aiChatController');

// Chat routes
router.post('/process-message', aiChatController.processMessage);
router.delete('/clear-history', aiChatController.clearHistory);

module.exports = router; 