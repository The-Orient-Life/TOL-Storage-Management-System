const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({

    productID: {type: String , required: true, unique: true},
    productName: {type: String , required: true},
    productPrice: {type: Number , required: true},
    productQTY: {type: Number , required: true},
    productStatus: {type: String , required: true},
    productMainCategoty: {type: String , require: true},
    productSubCategoty: {type: String , require: true},
    productSpecs: {type: String}

},{timestamps: true})

const Product = mongoose.model("Product", productSchema)

module.exports = Product;