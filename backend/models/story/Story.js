const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sellers',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    videoUrl: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customers'
    }],
    views: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customers'
    }],
    viewCount: {
        type: Number,
        default: 0
    },
    likeCount: {
        type: Number,
        default: 0
    },
    commentCount: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    }
}, { timestamps: true });

// Add index for better query performance
storySchema.index({ sellerId: 1, createdAt: -1 });
storySchema.index({ status: 1 });

// Add middleware to update counts
storySchema.pre('save', function(next) {
    if (this.isModified('views')) {
        this.viewCount = this.views.length;
    }
    if (this.isModified('likes')) {
        this.likeCount = this.likes.length;
    }
    next();
});

module.exports = mongoose.model('Story', storySchema); 