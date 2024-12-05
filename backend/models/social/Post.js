const mongoose = require('mongoose');

const reactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customer',
        required: true
    },
    type: {
        type: String,
        enum: ['like', 'love', 'haha', 'wow', 'sad', 'angry'],
        required: true
    }
});

const commentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customer',
        required: true
    },
    text: {
        type: String,
        required: true
    },
    reactions: [reactionSchema],
    replies: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'customer',
            required: true
        },
        text: {
            type: String,
            required: true
        },
        reactions: [reactionSchema],
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const postSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customer',
        required: true
    },
    text: {
        type: String,
        required: true,
        trim: true
    },
    mediaUrl: {
        type: String,
        default: null
    },
    mediaType: {
        type: String,
        enum: ['image', 'video', null],
        default: null
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customer'
    }],
    comments: [commentSchema]
}, {
    timestamps: true
});

module.exports = mongoose.model('Post', postSchema); 