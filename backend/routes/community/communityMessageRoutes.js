const router = require('express').Router();
const communityMessageController = require('../../controllers/community/communityMessageController');
const { authMiddleware } = require('../../middlewares/authMiddleware');

router.get('/connected-users', authMiddleware, communityMessageController.get_connected_users);
router.get('/get-messages/:receiverId', authMiddleware, communityMessageController.get_messages);
router.post('/add-message', authMiddleware, communityMessageController.add_message);
router.put('/mark-seen/:senderId', authMiddleware, communityMessageController.mark_messages_seen);

module.exports = router;