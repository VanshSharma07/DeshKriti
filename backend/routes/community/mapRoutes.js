const router = require('express').Router();
const mapController = require('../../controllers/community/mapController');
const { authMiddleware } = require('../../middlewares/authMiddleware');

// Validation middleware
const validateLocationRequest = (req, res, next) => {
    const { country } = req.body;
    if (!country) {
        return res.status(400).json({ 
            success: false, 
            error: 'Country is required' 
        });
    }
    next();
};

router.get('/locations', authMiddleware, mapController.getFilteredLocations);
router.put('/location', [authMiddleware, validateLocationRequest], mapController.updateUserLocation);

module.exports = router;