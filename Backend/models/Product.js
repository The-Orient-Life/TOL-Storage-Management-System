const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    productCategory: { type: String, required: true },
    productVariants: [
        {
            name: { type: String, required: true },  
            stock: { type: Number, required: true }  
        }
    ], 
    productTotalWorth: { type: Number, required: true },
    productStockStatus: { type: String, required: true },
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
