const express = require('express');
const router = express.Router();
const eventController = require('../../controllers/dasboard/eventController');

// Remove upload middleware as we'll handle file upload directly with Cloudinary
router.post('/events', eventController.createEvent);
router.post('/events/:id/rsvp', eventController.rsvpEvent);
router.get('/events', eventController.getEvents);
router.get('/events/:id', eventController.getEvent);
router.put('/events/:id', eventController.updateEvent);
router.delete('/events/:id', eventController.deleteEvent);


module.exports = router;