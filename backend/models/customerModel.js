const {Schema, model} = require("mongoose");

const customerSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    country: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    method: {
        type: String,
        required: true,
        default: 'manually'
    },
    followersCount: {
        type: Number,
        default: 0
    },
    followingCount: {
        type: Number,
        default: 0
    },
    profilePicture: {
        url: String,
        public_id: String
    },
    indianState: {
        type: String,
        required: true
    }
}, { timestamps: true })

module.exports = model('customer', customerSchema)