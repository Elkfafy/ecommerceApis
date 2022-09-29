//Require & variables
const productModel = require("../database/models/productModel");
const userModel = require("../database/models/userModel");
const categoryModel = require("../database/models/categoryModel");
const { sendError, sendSuccess } = require("../handlers/sendMessage");

//Product
class Product {
    //All (show all products(not require login)
    static all = async (req, res) => {
        try {
            const limit = req.query.limit
            const page = req.query.page
            const count = await productModel.count()
            const products = await productModel.find().limit(limit).skip(page * limit);
            res.status(200).send(
                sendSuccess({products, count}, "Products has been found")
            );
        } catch (e) {
            res.status(500).send(sendError(e));
        }
    };
    //show single(not require login)
    static single = async (req, res) => {
        try {
            const product = await productModel.findById(req.params.id);
            res.status(200).send(
                sendSuccess(product, "product has been found")
            );
        } catch (e) {
            res.status(500).send(sendError(e));
        }
    };
    //show products depending on a category
    static searchProducts = async (req, res) => {
        try {
            const category = await categoryModel.findOne({
                name: req.params.name,
            });
            await category.populate("searchProducts");
            res.status(200).send(
                sendSuccess(category.searchProducts, "products have been found")
            );
        } catch (e) {
            res.status(500).send(sendError(e));
        }
    };
    //show products depending on vendor
    static vendorProducts = async (req, res) => {
        try {
            const vendor = await userModel.findById(req.params.id);
            await vendor.populate("vendorProducts");
            res.status(200).send(
                sendSuccess(vendor.vendorProducts, "products has been found")
            );
        } catch (e) {
            res.status(500).send(sendError(e));
        }
    };
    //Vendor Or Admin (add, edit, delete)
    static add = async (req, res) => {
        console.log(req.files)
        try {
            const product = productModel({
                ...req.body,
                vendorId: req.user._id,
            });
            if (req.files.thumnail[0]) {
                product.changeThumnail(req.files.thumnail[0])
            }
            if (req.files.images.length) {

                product.changeImages(req.files.images)
            }
            await product.save();
            res.status(200).send(sendSuccess(product, "added"));
        } catch (e) {
            res.status(500).send(sendError(e));
        }
    };
    static edit = async (req, res) => {
        // not editing category
        delete req.body.category;
        try {
            const data = await productModel.findByIdAndUpdate(
                req.params.id,
                req.body
            );
            if (!data) throw new Error("Didn't find this id");
            res.status(200).send(sendSuccess(data, "Product Updated"));
        } catch (e) {
            res.status(500).send(sendError(e));
        }
    };
    static delete = async (req, res) => {
        try {
            const data = await productModel.findByIdAndDelete(req.params.id);
            if (!data) throw new Error("Didn't find this id");
            res.status(200).send(sendSuccess(data, "Product Deleted"));
        } catch (e) {
            res.status(500).send(sendError(e));
        }
    };
}

//Export
module.exports = Product;
