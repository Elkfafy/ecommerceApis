//Modules & variables
const mongoose = require("mongoose");
const categoryModel = require("./categoryModel");
//Schema
const productSchema = mongoose.Schema(
    {
        vendorId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "users",
        },
        consumers: [
            {
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    ref: "users",
                },
                count: {
                    type: Number,
                    min: 1,
                    default: 1,
                },
            },
        ],
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
        thumnail: {
            type: String,
            trim: true,
            minLength: 1,
            maxLength: 300,
            default: "defaultThumnail.jpg",
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
            required: true,
            min: 0,
            validate: function () {
                if (this.value === "") this.value = 0;
            },
        },
        category: {
            type: String,
            trim: true,
            minLength: 1,
            maxLength: 30,
            required: true,
            ref: "categories",
        },
    },
    { timeStamp: true }
);

//Methods
productSchema.methods.toJSON = function () {
    const product = this.toObject();
    delete product.__v;
    return product;
};

//Export
const productModel = mongoose.model("products", productSchema);
module.exports = productModel;
