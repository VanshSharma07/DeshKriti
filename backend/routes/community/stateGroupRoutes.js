const express = require('express');
const router = express.Router();
const stateGroupController = require('../../controllers/community/stateGroupController');
const { authMiddleware } = require('../../middlewares/authMiddleware');

// Protected routes - Move getAllGroups under authMiddleware
router.use(authMiddleware);
router.get('/', stateGroupController.getAllGroups);
router.get('/:groupId', stateGroupController.getGroupDetails);
router.post('/:groupId/join', stateGroupController.joinGroup);
router.post('/:groupId/leave', stateGroupController.leaveGroup);
router.post('/:groupId/posts', stateGroupController.createPost);
router.delete('/:groupId/posts/:postId', stateGroupController.deletePost);
router.post('/:groupId/posts/:postId/like', stateGroupController.likePost);
router.post('/:groupId/posts/:postId/comment', stateGroupController.addComment);

module.exports = router;