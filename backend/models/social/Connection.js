const mongoose = require('mongoose');

const connectionSchema = new mongoose.Schema({
    follower: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customer',
        required: [true, 'Follower ID is required'],
        index: true
    },
    following: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customer',
        required: [true, 'Following ID is required'],
        index: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    }
}, { 
    timestamps: true,
    validateBeforeSave: true
});

// Add compound index
connectionSchema.index(
    { follower: 1, following: 1 }, 
    { 
        unique: true,
        background: true,
        // Ensure both fields are non-null
        partialFilterExpression: {
            follower: { $type: "objectId" },
            following: { $type: "objectId" }
        }
    }
);

// Pre-save validation
connectionSchema.pre('save', function(next) {
    if (!this.follower || !this.following) {
        return next(new Error('Both follower and following IDs are required'));
    }
    if (this.follower.toString() === this.following.toString()) {
        return next(new Error('Users cannot follow themselves'));
    }
    next();
});

// Drop existing indexes and recreate them
const Connection = mongoose.model('Connection', connectionSchema);

const recreateIndexes = async () => {
    try {
        await Connection.collection.dropIndexes();
        await Connection.createIndexes();
        console.log('Connection indexes recreated successfully');
    } catch (error) {
        console.error('Error recreating indexes:', error);
    }
};

recreateIndexes();

module.exports = Connection;