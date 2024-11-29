const {Schema, model} = require("mongoose");
const reviewSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'customer'
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String
    },
    rating: {
        type: Number,
        required: true
    },
    review: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});
module.exports = model('reviews',reviewSchema)