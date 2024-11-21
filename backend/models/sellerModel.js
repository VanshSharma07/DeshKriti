const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
    name: {
        type: String,
        required : true
    },
    email: {
        type: String,
        required : true
    },
    password: {
        type: String,
        required : true,
        select: false
    },     
    role: {
        type: String,
        default : 'seller'
    },
    status: {
        type: String,
        default : 'pending'
    },
    payment: {
        type: String,
        default : 'inactive'
    },
    method: {
        type: String,
        required : true
    },
    image: {
        type: String,
        default : ''
    },
    shopInfo: {
        type: Object,
        default : {}
    },
    creditScore: {
        type: Number,
        default: 0
    },
    activeLoans: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MicroLoan'
    }],
    loanHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MicroLoan'
    }],
    walletAddress: {
        type: String
    }
},{ timestamps: true })

sellerSchema.index({
    name: 'text',
    email: 'text',

},{
    weights: {
        name: 5,
        email: 4,

    }
})

module.exports = mongoose.model('sellers',sellerSchema)