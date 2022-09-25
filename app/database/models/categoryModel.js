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
    count: {
        type: Number,
        min: 1,
        max: 9999,
        default: 1,
        validate: function () {
            if (!this.value) this.value = 1;
        },
    },
});
//Virtual
categorySchema.virtual("searchProducts", {
    ref: "products",
    localField: "name",
    foreignField: "category",
});
//Pre
// categorySchema.pre('remove', async )
//Methods
//Statics

//Export
const categoryModel = mongoose.model("categories", categorySchema);
module.exports = categoryModel;
