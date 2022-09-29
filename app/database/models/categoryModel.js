//Modules & Variables
const mongoose = require("mongoose");
const productModel = require('./productModel')
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
//Virtual
categorySchema.virtual("searchProducts", {
    ref: "products",
    localField: "name",
    foreignField: "category",
});
categorySchema.virtual("productsCount", {
    ref: "products",
    localField: "name",
    foreignField: "category",
    count: true
});
//Pre
// categorySchema.pre('remove', async )
//Post
categorySchema.post('findOneAndDelete', async function(doc) {
    await productModel.removeAll({category: doc.name})
})
//Methods
//Statics

//Export
const categoryModel = mongoose.model("categories", categorySchema);
module.exports = categoryModel;
