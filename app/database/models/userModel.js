const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        minLength: 1,
        maxLength: 30,
        required: true
    },
    age: {
        type: Number,
        min: 10,
        max: 150,
        validate: function() {
            if (!this.value) this.value = 10;
        }
    },
    email: {
        type: String,
        trim: true,
        minLength: 3,
        maxLength: 30,
        required: true,
        unique: true
    },
    password: {
        type: String,
        trim: true,
        minLength: 1,
        maxLength: 30,
        required: true,
    },
    status: {
        type: Boolean,
        default: false,
    },
    userType: {
        type: String,
        trim: true,
        enum: ['consumer', 'vendor', 'admin']
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

}, {timeStamp: true})

const userModel = mongoose.model('users', userSchema)
module.exports = userModel