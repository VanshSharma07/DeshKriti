const mongoose = require('mongoose');

const storyCommentSchema = new mongoose.Schema({
    storyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Story',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customer',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    userInfo: {
        firstName: String,
        lastName: String,
        image: String
    }
}, { timestamps: true });

module.exports = mongoose.model('StoryComment', storyCommentSchema); 