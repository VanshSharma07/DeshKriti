const router = require('express').Router();
const communityController = require('../../controllers/community/communityController');
const { authMiddleware } = require('../../middlewares/authMiddleware');

// Public routes
router.get('/topics', communityController.getTopics);
router.get('/topic/:topicId', communityController.getTopic);

// Protected routes
router.post('/create-topic', authMiddleware, communityController.createTopic);
router.post('/topic/:topicId/comment', authMiddleware, communityController.addComment);
router.put('/topic/:topicId/like', authMiddleware, communityController.toggleLike);
router.put('/topic/:topicId/comment/:commentId/like', authMiddleware, communityController.toggleCommentLike);

module.exports = router;