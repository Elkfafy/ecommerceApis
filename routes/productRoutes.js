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
            name: "thumnail",
            maxCount: 1,
        },
        {
            name: "images",
        },
    ]),
    auth,
    authAdmin,
    productController.add
);
router.put("/edit/:id", auth, authAdmin, productController.edit);
router.delete("/delete/:id", auth, authAdmin, productController.delete);
//Admin
//Export
module.exports = router;
