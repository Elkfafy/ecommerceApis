const mongoose = require('mongoose')
const categorySchema = mongoose.Schema({
    productId: {

    },
    name: {
        type: String,
        minLength: 1,
        maxLength: 30,
        required: true
    },
})