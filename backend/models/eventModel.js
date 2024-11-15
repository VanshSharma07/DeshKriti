// eventModel.js
const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    description: { type: String, required: true },
    streamingLink: { type: String, required: true },
    eventType: { type: String, required: true },
    thumbnailImage: { type: String, required: true },
    rsvpLimit: {
      type: Number,
      required: true,
    },
    currentRSVPs: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
