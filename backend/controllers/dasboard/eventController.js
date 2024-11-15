// eventController.js
const Event = require('../../models/eventModel');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret,
    secure: true
});
// Helper function to extract public_id from Cloudinary URL
const getPublicIdFromUrl = (url) => {
  const splits = url.split('/');
  const filename = splits[splits.length - 1];
  return `events/${filename.split('.')[0]}`; // Assuming images are in 'events' folder
};

exports.createEvent = async (req, res) => {
  try {
      const { thumbnailImage, ...eventData } = req.body;
      
      // Upload image to Cloudinary
      const result = await cloudinary.uploader.upload(thumbnailImage, {
          folder: "events",
      });

      // Create new event with Cloudinary URL
      const event = new Event({
          ...eventData,
          thumbnailImage: result.url
      });

      await event.save();
      res.status(201).json(event);
  } catch (error) {
      console.error('Error creating event:', error);
      res.status(400).json({ error: error.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
      const { thumbnailImage, ...updateData } = req.body;
      const event = await Event.findById(req.params.id);

      if (!event) {
          return res.status(404).json({ error: 'Event not found' });
      }

      // If new image is provided, upload to Cloudinary and delete old image
      if (thumbnailImage) {
          // Delete old image from Cloudinary
          const oldImagePublicId = getPublicIdFromUrl(event.thumbnailImage);
          await cloudinary.uploader.destroy(oldImagePublicId);

          // Upload new image
          const result = await cloudinary.uploader.upload(thumbnailImage, {
              folder: "events",
          });
          updateData.thumbnailImage = result.url;
      }

      const updatedEvent = await Event.findByIdAndUpdate(
          req.params.id,
          updateData,
          { new: true, runValidators: true }
      );

      res.status(200).json(updatedEvent);
  } catch (error) {
      console.error('Error updating event:', error);
      res.status(400).json({ error: error.message });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 }); // Sort by date ascending
    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Error fetching events' });
  }
};

exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.status(200).json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ error: 'Error fetching event' });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      if (req.file) {
        await deleteFile(req.file.filename);
      }
      return res.status(404).json({ error: 'Event not found' });
    }

    const updateData = { ...req.body };
    
    if (req.file) {
      // Delete old image
      await deleteFile(event.thumbnailImage);
      updateData.thumbnailImage = req.file.filename;
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedEvent);
  } catch (error) {
    if (req.file) {
      await deleteFile(req.file.filename);
    }
    console.error('Error updating event:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
      const event = await Event.findById(req.params.id);
      if (!event) {
          return res.status(404).json({ error: 'Event not found' });
      }

      // Delete image from Cloudinary
      const publicId = getPublicIdFromUrl(event.thumbnailImage);
      await cloudinary.uploader.destroy(publicId);

      // Delete event from database
      await Event.findByIdAndDelete(req.params.id);
      
      res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
      console.error('Error deleting event:', error);
      res.status(500).json({ error: 'Error deleting event' });
  }
};
// Add this method to your eventController
exports.rsvpEvent = async (req, res) => {
  try {
      const event = await Event.findById(req.params.id);
      
      if (!event) {
          return res.status(404).json({ 
              success: false, 
              message: 'Event not found' 
          });
      }

      // Check if event is full
      if (event.currentRSVPs >= event.rsvpLimit) {
          return res.status(400).json({ 
              success: false, 
              message: 'Event is already full' 
          });
      }

      // Increment RSVP count
      event.currentRSVPs = (event.currentRSVPs || 0) + 1;
      await event.save();

      res.status(200).json({ 
          success: true, 
          message: 'Successfully RSVP\'d for the event',
          currentRSVPs: event.currentRSVPs 
      });
  } catch (error) {
      console.error('RSVP error:', error);
      res.status(500).json({ 
          success: false, 
          message: 'Failed to RSVP for the event' 
      });
  }
};

