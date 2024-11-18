const { Schema, model } = require('mongoose');

const topicSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'customer'
  },
  title: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  content: {
    type: String,
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  likes: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'customer'
    }
  }],
  views: {
    type: Number,
    default: 0
  },
  images: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['active', 'blocked'],
    default: 'active'
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true }
});

// Virtual for comment count
topicSchema.virtual('commentCount', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'topicId',
  count: true
});

// Virtual for comments
topicSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'topicId',
  options: { sort: { createdAt: -1 } }
});

module.exports = model('Topic', topicSchema);