//Require & Variables
const router = require("express").Router();
const productController = require('../app/controllers/productController')
const {auth, authVendor} = require('../app/middlewares/auth')
//Routes
//All
router.get('/all', productController.all)
router.get('/all/:id', productController.single)
router.get('/search/category/:name', productController.searchProducts)
router.get('/search/user/:id', productController.vendorProducts)
//Vendor
router.post('/add', auth, authVendor, productController.add )
//Export
module.exports = router;
