const router = require('express').Router();
const storyController = require('../../controllers/story/storyController');
const { authMiddleware } = require('../../middlewares/authMiddleware');

// Public route for viewing all stories
router.get('/get-stories', authMiddleware, storyController.getStories);

// Seller routes
router.get('/seller/stories', authMiddleware, storyController.getStories);

// Story CRUD routes
router.post('/create', authMiddleware, storyController.createStory);
router.get('/:storyId', authMiddleware, storyController.getStory);
router.put('/:storyId', authMiddleware, storyController.updateStory);
router.delete('/:storyId', authMiddleware, storyController.deleteStory);

// Story engagement routes
router.post('/:storyId/view', authMiddleware, storyController.recordView);
router.post('/like/:storyId', authMiddleware, storyController.toggleLike);
router.get('/:storyId/comments', authMiddleware, storyController.getComments);
router.post('/:storyId/comment', authMiddleware, storyController.addComment);
router.delete('/:storyId/comments/:commentId', authMiddleware, storyController.deleteComment);

module.exports = router; 