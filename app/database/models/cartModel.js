//Required & Variables
const mongoose = require("mongoose");
const productModel = require("./productModel");
//Schema
const cartSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "users",
        },
        products: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    ref: "products",
                },
                count: {
                    type: Number,
                    min: 1,
                    default: 1,
                },
            },
        ],
        totalPrice: {
            type: Number,
            min: 0,
            required: true,
        },
    },
    { timeStamp: true }
);

  
//Export
const cartModel = mongoose.model("carts", cartSchema);
module.exports = cartModel;
