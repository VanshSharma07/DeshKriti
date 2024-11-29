const router = require('express').Router();
const communityConnectionController = require('../../controllers/community/communityConnectionController');
const { authMiddleware } = require('../../middlewares/authMiddleware');

router.post('/send-request', authMiddleware, communityConnectionController.sendConnectionRequest);
router.get('/pending-requests', authMiddleware, communityConnectionController.getPendingRequests);
router.put('/handle-request', authMiddleware, communityConnectionController.handleConnectionRequest);
router.get('/status/:userId', authMiddleware, communityConnectionController.checkConnectionStatus);

module.exports = router;