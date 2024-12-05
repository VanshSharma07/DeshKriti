const express = require('express');
const router = express.Router();
const userController = require('../controllers/social/userController');
const postController = require('../controllers/social/postController');
const connectionController = require('../controllers/social/connectionController');
const chatController = require('../controllers/social/chatController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { updateProfile } = require('../controllers/userController');

// User routes
router.get('/user/me', authMiddleware, userController.getCurrentUser);
router.get('/user/:userId', authMiddleware, userController.getUser);
router.put('/users/profile/edit', authMiddleware, updateProfile);

// Post routes
router.get('/posts', authMiddleware, postController.getFeedPosts);
router.get('/posts/user/:userId', authMiddleware, postController.getUserPosts);
router.post('/posts/create', authMiddleware, postController.createPost);
router.patch('/posts/:postId/like', authMiddleware, postController.likePost);
router.delete('/posts/:postId', authMiddleware, postController.deletePost);
router.get('/upload-signature', authMiddleware, postController.getUploadSignature);
router.post('/upload-chunk', authMiddleware, postController.uploadChunk);
router.post('/complete-upload', authMiddleware, postController.completeUpload);

// Comment and reaction routes
router.post('/posts/:postId/comment', authMiddleware, postController.addComment);
router.post('/posts/:postId/comments/:commentId/reply', authMiddleware, postController.addReply);
router.post('/posts/:postId/comments/:commentId/react', authMiddleware, postController.addReaction);
router.delete('/posts/:postId/comments/:commentId', authMiddleware, postController.deleteComment);
router.delete('/posts/:postId/comments/:commentId/replies/:replyId', authMiddleware, postController.deleteReply);
router.patch('/posts/:postId/comments/:commentId', authMiddleware, postController.editComment);
router.patch('/posts/:postId/comments/:commentId/replies/:replyId', authMiddleware, postController.editReply);
router.delete('/posts/:postId/comments/:commentId/reactions/:reactionId', authMiddleware, postController.deleteReaction);

// Connection routes
router.post('/follow', authMiddleware, connectionController.followUser);
router.get('/requests/pending', authMiddleware, connectionController.getPendingRequests);
router.put('/requests/:requestId/accept', authMiddleware, connectionController.acceptRequest);
router.put('/requests/:requestId/reject', authMiddleware, connectionController.rejectRequest);
router.get('/connection-status/:targetId', authMiddleware, connectionController.getConnectionStatus);
router.delete('/unfollow/:followingId', authMiddleware, connectionController.unfollowUser);
router.get('/followers/:userId?', authMiddleware, connectionController.getFollowers);
router.get('/following/:userId?', authMiddleware, connectionController.getFollowing);
router.get('/suggestions', authMiddleware, connectionController.getSuggestions);
router.get('/connection-counts/:userId?', authMiddleware, connectionController.getConnectionCounts);
router.get('/friends', authMiddleware, connectionController.getFriends);

// Chat routes
router.post('/chats/create', authMiddleware, chatController.createChat);
router.get('/chats/:chatId', authMiddleware, chatController.getChatById);
router.post('/chats/:chatId/message', authMiddleware, chatController.sendMessage);
router.get('/chats', authMiddleware, chatController.getChats);
router.patch('/chats/:chatId/read', authMiddleware, chatController.markAsRead);
router.delete('/chats/:chatId', authMiddleware, chatController.deleteChat);

module.exports = router; 