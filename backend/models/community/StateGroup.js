const mongoose = require('mongoose');

const stateGroupSchema = new mongoose.Schema({
  stateName: {
    type: String,
    required: true,
    unique: true
  },
  description: String,
  memberCount: {
    type: Number,
    default: 0
  },
  members: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'customer' // Ensure this matches the user model
    },
    role: {
      type: String,
      enum: ['member', 'moderator', 'admin'],
      default: 'member'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StateGroupPost'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('StateGroup', stateGroupSchema);