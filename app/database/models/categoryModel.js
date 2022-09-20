//Modules & Variables
const mongoose = require("mongoose");
//Schema
const categorySchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        minLength: 1,
        maxLength: 30,
        required: true,
        unique: true,
    },
});
//Pre
//Methods
//Statics

//Export
const categoryModel = mongoose.model("categories", categorySchema);
module.exports = categoryModel;
