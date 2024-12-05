const mongoose = require('mongoose');

const userLocationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'userType'
    },
    userType: {
        type: String,
        required: true,
        enum: ['customers', 'sellers']
    },
    location: {
        country: {
            type: String,
            required: true
        },
        continent: {
            type: String,
            required: true
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true,
            validate: {
                validator: function(v) {
                    return Array.isArray(v) && v.length === 2 &&
                           v[0] >= -180 && v[0] <= 180 && // longitude
                           v[1] >= -90 && v[1] <= 90;    // latitude
                },
                message: 'Invalid coordinates'
            }
        }
    },
    lastActive: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Index for geospatial queries
userLocationSchema.index({ 'location.coordinates': '2d' });

module.exports = mongoose.model('UserLocation', userLocationSchema);