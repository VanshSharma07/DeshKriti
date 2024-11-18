const { Schema, model } = require('mongoose');

const commentSchema = new Schema({
  topicId: {
    type: Schema.Types.ObjectId,
    ref: 'Topic',
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'customer'
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  parentId: {
    type: Schema.Types.ObjectId,
    ref: 'Comment',
    default: null
  },
  likes: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'customer'
    }
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

commentSchema.virtual('replies', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'parentId',
  options: { sort: { createdAt: -1 } }
});

module.exports = model('Comment', commentSchema);