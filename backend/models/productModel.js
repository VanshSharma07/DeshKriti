const {Schema, model} = require("mongoose");

const productSchema = new Schema({
    sellerId: {
        type: Schema.ObjectId,
        required : true
    },
    name: {
        type: String,
        required : true
    },
    slug: {
        type: String,
        required : true
    },
    brand: {
        type: String,
        required : true
    },
    price: {
        type: Number,
        required : true
    },
    stock: {
        type: Number,
        required : true
    },
    discount: {
        type: Number,
        required : true
    },
    description: {
        type: String,
        required : true
    },
    shopName: {
        type: String,
        required : true
    },
    images: {
        type: Array,
        required : true
    },
    rating: {
        type: Number,
        default : 0
    },
    categories: [{
        type: String,
        required: true
    }],
    region: {
        type: String,
        required: true
    },
    state: {
        type: String, 
        required: true
    }

}, {timestamps: true})

productSchema.index({
    name: 'text',
    categories: 'text',
    brand: 'text',
    description: 'text'
},{
    weights: {
        name: 5,
        categories: 4,
        brand: 3,
        description: 2
    }

})

module.exports = model('products',productSchema)