const { Schema, model } = require('mongoose');

const communityMessageSchema = new Schema({
  senderId: {
    type: Schema.Types.ObjectId,
    ref: 'customers',
    required: true
  },
  receiverId: {
    type: Schema.Types.ObjectId,
    ref: 'customers',
    required: true
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['sent', 'delivered', 'seen'],
    default: 'sent'
  }
}, { timestamps: true });

module.exports = model('CommunityMessage', communityMessageSchema);