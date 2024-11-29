const { Schema, model } = require('mongoose');

const userLocationSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'customer',
        required: true
    },
    userType: {
        type: String,
        enum: ['customers', 'sellers', 'admin'],
        default: 'customers'
    },
    location: {
        continent: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true,
            index: '2dsphere'
        }
    },
    lastActive: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = model('UserLocation', userLocationSchema);