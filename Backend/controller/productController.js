const express = require('express');
const router = express.Router();

const Product = require("../models/Product.js")

// Define routes in productController
router.get('/getProduct', async (req, res) => {
    
    try{
        
        const getProduct = await Product.find();
        res.status(200).json({message: "Product Fetched Successfully" , getProduct})
        console.log("Product Fetched Successfully Completed !")
    }catch(error){

        res.status(500).json({message: "Error Fetching Product" , error: error.message})
        console.log("Product Fetched Unsuccessfully !")

    }
    


});

// Example for another route
router.post('/addProduct', async (req, res) => {
    
    const { productName, productCategory, productVariants, productTotalWorth, productStockStatus } = req.body;

    
    if (!Array.isArray(productVariants) || productVariants.some(v => !v.name || v.stock === undefined)) {
        return res.status(400).json({ message: 'Each variant must have a name and stock quantity.' });
    }

    
    const newProduct = new Product({
        productName,
        productCategory, 
        productVariants,  
        productTotalWorth,
        productStockStatus,
    });

    try {
        
        const saveProduct = await newProduct.save();


        res.status(201).json({ message: "Product Saved Successfully", product: saveProduct });
        console.log("Product Saved Successfully Completed!");
    } catch (error) {
        
        res.status(500).json({ message: "Error Adding Product", error: error.message });
        console.log("Product Saved Unsuccessfully!");
    }
});



// DELETE a product by productID
router.delete('/deleteProduct/:productID', async (req, res) => {
    try {
        const deletedProduct = await Product.findOneAndDelete({ productID: req.params.productID });

        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: "Product deleted successfully", product: deletedProduct });
    } catch (error) {
        res.status(500).json({ message: "Error deleting product", error: error.message });
    }
});

module.exports = router; // Make sure to export the router
