//Modules & variables
const mongoose = require("mongoose");
const productSchema = mongoose.Schema({
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    consumersId: {
        type: Array,
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
        maxLength: 500,
    },
    categories: {
        type: Array,
    },
    thumnail: {
        type: String,
        trim: true,
        minLength: 1,
        maxLength: 300,
        default: "defaultThumnail.png",
    },
    images: [
        {
            type: String,
            trim: true,
            minLength: 1,
            maxLength: 300,
        },
    ],
    price: {
        type: Number,
        max: 999999,
        required: true,
        validate: function () {
            if (this.value === "") this.value = 0;
        },
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
    },
});
//Pre
productSchema.pre("save", function () {});
//Methods
productSchema.methods.toJSON = function () {
    const product = this.toObject();
    delete product.__v;
    return product;
};
//Statics

//Export
const productModel = mongoose.model("products", productSchema);
module.exports = productModel;
