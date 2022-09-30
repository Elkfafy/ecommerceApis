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
            const limit = req.query.limit;
            const page = req.query.page;
            const count = await productModel.count();
            const products = await productModel
                .find()
                .limit(limit)
                .skip(page * limit);
            res.status(200).send(
                sendSuccess({ products, count }, "Products has been found")
            );
        } catch (e) {
            res.status(500).send(sendError(e));
        }
    };
    //show single(not require login)
    static single = async (req, res) => {
        try {
            const product = await productModel.findById(req.params.id).populate('vendor');
            const container = {...product.toJSON(), vendorName: product.vendor.name}
            // console.log(container)
            res.status(200).send(
                sendSuccess(container, "product has been found")
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
        try {
            if (!["admin", "vendor"].includes(req.user.userType))
                throw new Error("You aren't Authorized");
            const product = productModel({
                ...req.body,
                vendorId: req.user._id,
            });
            if (req.files.thumnailImage && req.files.thumnailImage[0]) {
                product.changeThumnail(req.files.thumnailImage[0]);
            }
            if (req.files.imagesArr && req.files.imagesArr.length) {
                product.changeImages(req.files.imagesArr);
            }
            await product.save();
            res.status(200).send(sendSuccess(product, "added"));
        } catch (e) {
            res.status(500).send(sendError(e));
        }
    };
    static edit = async (req, res) => {
        try {
            console.log(req.body)
            Object.keys(req.body).forEach(key => {
                req.product[key] = req.body[key];
            });
            if (req.files.thumnailImage && req.files.thumnailImage[0]) {
                req.product.changeThumnail(req.files.thumnailImage[0]);
            }
            if (req.files.imagesArr && req.files.imagesArr.length) {
                req.product.changeImages(req.files.imagesArr);
            }
            await req.product.save();
            res.status(200).send(sendSuccess(req.product, "Product Updated"));
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
