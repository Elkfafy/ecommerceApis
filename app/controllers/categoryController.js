//Require & Variables
const categoryModel = require('../database/models/categoryModel')
const productModel = require('../database/models/productModel')
const { sendError, sendSuccess } = require('../handlers/sendMessage')

//Category
class Category {
    //All (get All Categories)
    static all = async (req, res) => {
        try {
            const categories = await categoryModel.find()
            res.status(200).send(sendSuccess(categories, 'Categories Fetched'))
        } catch(e) {
            res.status(500).send(sendError(e))
        }
    }
    //Admin (delete an entire category)
    static delete = async (req, res) => {
        try {
            const data = await productModel.findByIdAndDelete(req.params.id)
            if (!data) throw new Error('This id not found')
            res.status(200).send(sendSuccess(data, 'Category Deleted'))
        } catch(e) {
            res.status(500).send(sendError(e))
        }
    }
    static add = async (req, res) => {
        try {
            const category = categoryModel(req.body)
            await category.save()
            res.status(200).send(sendSuccess(category, 'category added'))
        } catch(e) {
            res.status(500).send(sendError(e))
        }
    }
    static edit = async (req, res) => {
        try {
            const data = await categoryModel.findByIdAndUpdate(req.params.id)
            if (!data) throw new Error('Invalid ID')
            res.status(200).send(sendSuccess(data, 'category updated'))
        } catch(e) {
            res.status(500).send(sendError(e))
        }
    }
}

module.exports = Category