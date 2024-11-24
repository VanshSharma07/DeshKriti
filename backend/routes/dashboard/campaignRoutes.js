const express = require('express');
const router = express.Router();
const campaignController = require('../../controllers/dasboard/campaignController');
const { authMiddleware } = require('../../middlewares/authMiddleware');

// Admin routes (protected)
router.post('/campaign/create', authMiddleware, campaignController.create_campaign);
router.put('/campaign/update/:campaignId', authMiddleware, campaignController.update_campaign);
router.put('/campaign/update-images/:campaignId', authMiddleware, campaignController.update_campaign_images);
router.delete('/campaign/:campaignId', authMiddleware, campaignController.delete_campaign);
router.put('/campaign/toggle-feature/:campaignId', authMiddleware, campaignController.toggle_feature);

// Public routes
router.get('/campaigns', campaignController.get_campaigns);
router.get('/campaign/:identifier', campaignController.get_campaign);
router.get('/campaigns/featured', campaignController.get_featured_campaigns);
router.get('/campaigns/category/:category', campaignController.get_campaigns_by_category);

// Campaign updates routes
router.post('/campaign/:campaignId/update', authMiddleware, campaignController.add_campaign_update);
router.delete('/campaign/:campaignId/update/:updateId', authMiddleware, campaignController.delete_campaign_update);

// Donation routes
router.post('/campaign/:campaignId/donate', authMiddleware, campaignController.add_donation);
router.get('/campaign/:campaignId/donations', campaignController.get_campaign_donations);

// Add this route for updating campaign status
router.put('/campaign/:campaignId/status', authMiddleware, campaignController.update_campaign_status);

// Dashboard specific routes
router.get('/dashboard/campaigns/stats', authMiddleware, campaignController.get_campaign_stats);
router.get('/dashboard/campaigns/recent-donations', authMiddleware, campaignController.get_recent_donations);
router.get('/dashboard/campaigns/analytics/:campaignId', authMiddleware, campaignController.get_campaign_analytics);

// Update this route to handle status query
router.get('/dashboard/campaigns', authMiddleware, campaignController.get_campaigns);

module.exports = router;