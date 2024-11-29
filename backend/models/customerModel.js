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
    }
}, { timestamps: true })

module.exports = model('customer', customerSchema)