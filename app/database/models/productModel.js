//Modules & variables
const mongoose = require("mongoose");
const fs = require('fs')
const path = require('path')
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
//pre
productSchema.pre('remove', async function() {
    await this.changeThumnail({filename: ''})
    await this.changeImages([])
    
})
//post 
productSchema.post('findOneAndDelete', async function(doc, next) {
    if(!doc) next()
    await doc.changeThumnail({filename: ''})
    await doc.changeImages([])
    
})
//Methods
productSchema.methods.toJSON = function () {
    const product = this.toObject();
    delete product.__v;
    return product;
};
productSchema.methods.changeThumnail = async function(file) {
    const oldThumnail = this.thumnail == 'defaultThumnail.jpg'? null : this.thumnail
    this.thumnail = file.filename
    try {
        if (oldThumnail) fs.unlinkSync(path.join(__dirname, '../../public', oldThumnail))

    } catch(e) {

    }
}
productSchema.methods.changeImages = async function(images) {
    const oldImages = this.images
    const myImages = []
    images.forEach(image => {
        myImages.push(image.filename)
    })
    this.images = myImages
    if (oldImages.length) {
        oldImages.forEach(image => {
            try {

                fs.unlinkSync(path.join(__dirname, '../../public', image))
            } catch(e) {
                
            }
        })
    }
}
//Statics
productSchema.statics.removeAll = async function (condition) {
    const products = await productModel.find(condition)
    products.forEach(async product => await product.remove())
}
//Export
const productModel = mongoose.model("products", productSchema);
module.exports = productModel;
