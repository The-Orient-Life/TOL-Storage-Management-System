const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    productCategory: { type: String, required: true },
    productVariants: [
        {
            name: { type: String, required: true },  
            stock: { type: Number, required: true },
            price: { type: String, required: true }  // Include price for each variant
        }
    ], 
    productTotalWorth: { type: Number, required: true },
    productStockStatus: { type: String, required: true },
    imagePreview: { type: String },  // Add imagePreview to store base64 encoded image
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
