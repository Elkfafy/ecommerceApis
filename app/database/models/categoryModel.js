const mongoose = require('mongoose')
const categorySchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        minLength: 1,
        maxLength: 30,
        required: true,
        unique: true,
    }
})

const categoryModel = mongoose.model('categories', categorySchema)
module.exports = categoryModel