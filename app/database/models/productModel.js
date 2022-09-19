const mongoose = require('mongoose')
const productSchema = mongoose.Schema({
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    consumersId: {
        type: Array
    },
    name: {
        type: String,
        trim: true,
        minLength: 1,
        maxLength: 30,
        required: true,
    },
    title: {
        type: String,
        trim: true,
        maxLength: 100,
    },
    desc: {
        type: String,
        trim: true,
        maxLength: 500
    },
    categories: {
        type: Array,
    },
    images: [{
        imgType: {
            type: String,
            trim: true,
            minLength: 1,
            maxLength: 30,
            required: true,
        },
        loc: {
            type: String,
            trim: true,
            minLength: 1,
            maxLength: 300,
            required: true,
        }
    }],
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
    }

})

const productModel = mongoose.model('products', productSchema);
module.exports = productModel