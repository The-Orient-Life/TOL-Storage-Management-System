const express = require('express');
const router = express.Router();

const Product = require("../models/Product.js")

// Define routes in productController
router.get('/getProduct', async (req, res) => {

    try {

        const getProduct = await Product.find();
        res.status(200).json({ message: "Product Fetched Successfully", getProduct })
        console.log("Product Fetched Successfully Completed !")
    } catch (error) {

        res.status(500).json({ message: "Error Fetching Product", error: error.message })
        console.log("Product Fetched Unsuccessfully !")

    }



});

router.post('/addProduct', async (req, res) => {

    const { productName, productCategory, productVariants, productTotalWorth, productStockStatus, imagePreview } = req.body;

    // Validation for variants (checking if name, stock, and price are provided)
    if (!Array.isArray(productVariants) || productVariants.some(v => !v.name || v.stock === undefined || v.price === undefined)) {
        return res.status(400).json({ message: 'Each variant must have a name, stock quantity, and price.' });
    }

    const newProduct = new Product({
        productName,
        productCategory,
        productVariants,
        productTotalWorth,
        productStockStatus,
        imagePreview  // Include image preview
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

// Define routes in productController
router.get('/getModels', async (req, res) => {
    try {
        // Fetch products from the database
        const products = await Product.find();

        // Extract only the relevant data from each product
        const formattedProducts = products.map(product => ({
            productName: product.productName,  // Including product name if needed
            productCategory: product.productCategory,
            productStockStatus: product.productStockStatus,
            imagePreview: product.imagePreview,
            productVariants: product.productVariants.map(variant => ({
                name: variant.name,
                stock: variant.stock,
                price: variant.price,
                _id: variant._id
            }))
        }));

        // Send the response with the formatted data
        res.status(200).json({
            message: "Product Fetched Successfully",
            products: formattedProducts
        });
        console.log("Product Fetched Successfully Completed!");

    } catch (error) {
        res.status(500).json({
            message: "Error Fetching Product",
            error: error.message
        });
        console.log("Product Fetched Unsuccessfully!");
    }
});

router.get('/getM', async (req, res) => {
    try {
        // Fetch products from the database
        const products = await Product.find();

        // Create an array to store the formatted variants
        let formattedVariants = [];

        // Loop through each product
        products.forEach(product => {
            // For each product, loop through the product variants and format them
            product.productVariants.forEach(variant => {
                formattedVariants.push({
                    id: variant._id,  // Using the variant's _id
                    name: variant.name,  // Use the variant's name as the "product name"
                    category: product.productCategory,  // Product category
                    stockLevel: variant.stock,  // Variant stock level
                    price: variant.price,  // Variant price
                    status: variant.stock > 0 ? 'In Stock' : 'Low Stock',  // Stock status based on stock level
                    image: product.imagePreview  // Assuming the product image is used for the variant
                });
            });
        });

        // Send the response with the formatted variants data
        res.status(200).json({
            message: "Variants Fetched Successfully",
            variants: formattedVariants
        });
        console.log("Variants Fetched Successfully Completed!");

    } catch (error) {
        res.status(500).json({
            message: "Error Fetching Variants",
            error: error.message
        });
        console.log("Variants Fetched Unsuccessfully!");
    }
});




router.patch("/reduceQ", async (req, res) => {
    try {
        const { variantId } = req.body;  // Extract variantId from the request body

        // Find the product that contains the variant with the given variantId
        const product = await Product.findOne({ "productVariants._id": variantId });

        if (!product) {
            return res.status(404).json({ message: "Product with the specified variant not found" });
        }

        // Find the variant inside the product's productVariants array
        const variant = product.productVariants.find(v => v._id.toString() === variantId);

        if (!variant) {
            return res.status(404).json({ message: "Product variant not found" });
        }

        // Check if the stock is greater than 0 before reducing
        if (variant.stock <= 0) {
            return res.status(400).json({ message: "No stock available to reduce" });
        }

        // Reduce the quantity of the variant by 1
        variant.stock -= 1;

        // Save the updated product back to the database
        await product.save();

        return res.status(200).json({ message: "Quantity reduced successfully", updatedProduct: product });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred", error: error.message });
    }
});

router.patch("/restockVariant", async (req, res) => {
    try {
        const { variantId, restockAmount } = req.body;  // Extract variantId and restockAmount from the request body

        // Find the product that contains the variant with the given variantId
        const product = await Product.findOne({ "productVariants._id": variantId });

        if (!product) {
            return res.status(404).json({ message: "Product with the specified variant not found" });
        }

        // Find the variant inside the product's productVariants array
        const variant = product.productVariants.find(v => v._id.toString() === variantId);

        if (!variant) {
            return res.status(404).json({ message: "Product variant not found" });
        }

        // Ensure the restockAmount is a positive number
        if (restockAmount <= 0) {
            return res.status(400).json({ message: "Restock amount must be greater than 0" });
        }

        // Add the restockAmount to the current stock of the variant
        variant.stock += restockAmount;

        // Save the updated product back to the database
        await product.save();

        return res.status(200).json({ message: "Variant restocked successfully", updatedProduct: product });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred", error: error.message });
    }
});

router.get("/lowStockVariantCount", async (req, res) => {
    try {
        const products = await Product.find({}, 'productVariants');

        let lowStockCount = 0;

        products.forEach(product => {
            const count = product.productVariants.filter(variant => variant.stock <= 5).length;
            lowStockCount += count;
        });

        return res.status(200).json({ lowStockVariantCount: lowStockCount });
    } catch (error) {
        console.error("Error counting low stock variants:", error);
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
});

router.get("/outOfStockVariantCount", async (req, res) => {
    try {
        const products = await Product.find({}, 'productVariants');

        let outOfStockCount = 0;

        products.forEach(product => {
            const count = product.productVariants.filter(variant => variant.stock === 0).length;
            outOfStockCount += count;
        });

        return res.status(200).json({ outOfStockVariantCount: outOfStockCount });
    } catch (error) {
        console.error("Error counting out-of-stock variants:", error);
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
});






module.exports = router; // Make sure to export the router
