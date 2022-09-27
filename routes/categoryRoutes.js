//Required & Variables
const router = require("express").Router();
const categoryController = require('../app/controllers/categoryController')
//Routes
//All (show all categories)
router.get('/', )
//Admin (delete a category)
router.post('/', categoryController.add)
router.delete('/:id', categoryController.delete)
router.put('/:id', categoryController.edit)

//Export
module.exports = router;
