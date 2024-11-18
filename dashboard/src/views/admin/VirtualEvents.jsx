import React, { useState, useEffect } from "react";
import { Trash2, Edit2, X } from "lucide-react";
import api from "../../api/api";

const VirtualEvents = () => {
  const [eventData, setEventData] = useState({
    title: "",
    date: "",
    time: "",
    description: "",
    streamingLink: "",
    eventType: "liveStream",
    thumbnailImage: null,
    rsvpLimit: "",
  });

  const [events, setEvents] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const response = await api.get("/events");
      setEvents(response.data);
    } catch (error) {
      console.error("Error loading events:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  const resizeImage = (file) => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 800;
                const MAX_HEIGHT = 600;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', 0.7)); // Compress to JPEG with 70% quality
            };
        };
    });
};

 // Update handleFileChange
const handleFileChange = async (e) => {
  const file = e.target.files[0];
  if (file) {
      try {
          const resizedImage = await resizeImage(file);
          setEventData({ ...eventData, thumbnailImage: resizedImage });
      } catch (error) {
          console.error('Error resizing image:', error);
      }
  }
};

  const resetForm = () => {
    setEventData({
      title: "",
      date: "",
      time: "",
      description: "",
      streamingLink: "",
      eventType: "liveStream",
      thumbnailImage: null,
      rsvpLimit: "",
    });
    setIsEditing(false);
    setEditingId(null);
  };

  const handleEdit = (event) => {
    setIsEditing(true);
    setEditingId(event._id);
    setEventData({
      title: event.title,
      date: event.date.split("T")[0], // Format date for input
      time: event.time,
      description: event.description,
      streamingLink: event.streamingLink,
      eventType: event.eventType,
      rsvpLimit: event.rsvpLimit,
      thumbnailImage: null, // Reset thumbnail since we can't pre-fill file input
    });
  };

  const handleDelete = async (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await api.delete(`/events/${eventId}`);
        loadEvents();
      } catch (error) {
        console.error("Error deleting event:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...eventData,
        ...(eventData.thumbnailImage && eventData.thumbnailImage.startsWith('data:image') 
          ? { thumbnailImage: eventData.thumbnailImage }
          : {})
      };

      if (isEditing) {
        await api.put(`/events/${editingId}`, dataToSend);
      } else {
        await api.post("/events", dataToSend);
      }

      resetForm();
      loadEvents();
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800">
        {isEditing ? "Edit Virtual Event" : "Create Virtual Event"}
      </h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-gray-700">Title:</span>
            <input
              type="text"
              name="title"
              value={eventData.title}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </label>

          <label className="block">
            <span className="text-gray-700">Date:</span>
            <input
              type="date"
              name="date"
              value={eventData.date}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </label>

          <label className="block">
            <span className="text-gray-700">Time:</span>
            <input
              type="time"
              name="time"
              value={eventData.time}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </label>

          <label className="block">
            <span className="text-gray-700">Event Type:</span>
            <select
              name="eventType"
              value={eventData.eventType}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
              <option value="liveStream">Live Stream</option>
              <option value="workshop">Interactive Workshop</option>
            </select>
          </label>
        </div>

        <label className="block">
          <span className="text-gray-700">Description:</span>
          <textarea
            name="description"
            value={eventData.description}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm h-32"
          />
        </label>

        <label className="block">
          <span className="text-gray-700">Live Stream Link:</span>
          <input
            type="url"
            name="streamingLink"
            value={eventData.streamingLink}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </label>

        <label className="block">
          <span className="text-gray-700">Thumbnail Image:</span>
          <input
            type="file"
            name="thumbnailImage"
            onChange={handleFileChange}
            required={!isEditing}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </label>

        <label className="block">
          <span className="text-gray-700">RSVP Limit:</span>
          <input
            type="number"
            name="rsvpLimit"
            value={eventData.rsvpLimit}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </label>

        <div className="flex gap-4">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700">
            {isEditing ? "Update Event" : "Create Event"}
          </button>

          {isEditing && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 bg-gray-600 text-white rounded-md shadow-sm hover:bg-gray-700">
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-800">Upcoming Events</h2>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event) => (
            <div
              key={event._id}
              className="p-4 bg-white shadow rounded relative">
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  onClick={() => handleEdit(event)}
                  className="p-1 text-blue-600 hover:text-blue-800">
                  <Edit2 size={20} />
                </button>
                <button
                  onClick={() => handleDelete(event._id)}
                  className="p-1 text-red-600 hover:text-red-800">
                  <Trash2 size={20} />
                </button>
              </div>

              <h3 className="text-xl font-semibold text-gray-800">
                {event.title}
              </h3>
              <p className="mt-2 text-gray-600">{event.description}</p>
              <p className="mt-2 text-gray-600">
                Date: {new Date(event.date).toLocaleDateString()}
              </p>
              <p className="mt-2 text-gray-600">Time: {event.time}</p>
              <p className="mt-2 text-gray-600">Type: {event.eventType}</p>
              <img
                src={event.thumbnailImage} // Now directly using Cloudinary URL
                alt={event.title}
                className="mt-2 w-full h-48 object-cover rounded"
              />
              <a
                href={event.streamingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block text-blue-600 hover:underline">
                Join Event
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VirtualEvents;
