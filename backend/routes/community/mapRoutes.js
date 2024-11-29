const router = require('express').Router();
const mapController = require('../../controllers/community/mapController');
const { authMiddleware } = require('../../middlewares/authMiddleware');

router.get('/locations', authMiddleware, mapController.getFilteredLocations);
router.get('/all-users', authMiddleware, mapController.getFilteredLocations);
router.put('/location', authMiddleware, mapController.updateUserLocation);

module.exports = router;