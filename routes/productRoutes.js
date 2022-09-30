//Require & Variables
const router = require("express").Router();
const upload = require("../app/middlewares/uploadFile");
const productController = require("../app/controllers/productController");
const { auth, authVendor, authAdmin } = require("../app/middlewares/auth");
//Routes
//All
router.get("/all", productController.all);
router.get("/all/:id", productController.single);
router.get("/search/category/:name", productController.searchProducts);
router.get("/search/user/:id", productController.vendorProducts);
//Vendor
router.post(
    "/add",
    upload.fields([
        {
            name: "thumnailImage",
            maxCount: 1,
        },
        {
            name: "imagesArr",
        },
    ]),
    auth,
    productController.add
);
router.put(
    "/edit/:id",
    upload.fields([
        {
            name: "thumnailImage",
            maxCount: 1,
        },
        {
            name: "imagesArr",
        },
    ]),
    auth,
    authVendor,
    productController.edit
);
router.delete("/delete/:id", auth, authVendor, productController.delete);
//Admin
//Export
module.exports = router;
