//Modules & variables
const mongoose = require("mongoose");
const categoryModel = require("./categoryModel");
//Schema
const productSchema = mongoose.Schema({
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "users",
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
        max: 999999,
        required: true,
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
});
//Pre
productSchema.pre("save", async function () {
    if (this.isModified("category")) {
        const category = await categoryModel.findOne({ name: this.category });
        if (category) {
            category.count++;
            await category.save();
        } else {
            const myCat = categoryModel({ name: this.category });
            await myCat.save();
        }
    }
});
productSchema.pre("remove", async function () {
    const category = await categoryModel.findOne({ name: this.category });
    category.count--;
    if (category.count == 0) await category.remove();
    else await category.save();
});

//Post
productSchema.post("findOneAndDelete", async function (doc) {
    console.log(doc);
    const category = await categoryModel.findOne({ name: doc.category });
    category.count--;
    if (category.count == 0) await category.remove();
    else await category.save();
});

//Methods
productSchema.methods.toJSON = function () {
    const product = this.toObject();
    delete product.__v;
    return product;
}; // عشان امسحه لازم اتاكد اني ال vendor
//Statics
productSchema.statics.removeAll = async cond => {
    const products = await productModel.find(cond);
    products.forEach(async product => {
        await product.remove();
    });
};

//Export
const productModel = mongoose.model("products", productSchema);
module.exports = productModel;
