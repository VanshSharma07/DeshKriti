const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'customer',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  replies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'comment'
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'customer'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const stateGroupPostSchema = new mongoose.Schema({
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StateGroup',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'customer',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  images: [{
    type: String
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'customer'
  }],
  comments: [commentSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('StateGroupPost', stateGroupPostSchema);