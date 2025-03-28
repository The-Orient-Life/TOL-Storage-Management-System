const express = require('express');
const router = express.Router();

const Transaction = require("../models/Transaction.js")
const User = require("../models/User.js");
const Product = require("../models/Product.js");

const { v4: uuidv4 } = require('uuid'); // To generate unique transaction IDs

router.post('/savetransaction', async (req, res) => {
    try {
      // Extract data from the incoming request body
      const {
        transactionID,
        customerName,
        customerNIC,
        product,
        executive,
        manager,
        declinedReason,
        guarantors,
        easyPayment,
        paymentMethod,
        branch,
        status,
        commotion,
        headAdminApproval,
        penalty
      } = req.body;
  
      // Create a new transaction instance using the data from the request body
      const transaction = new Transaction({
        transactionID,
        customerName,
        customerNIC,
        product,
        executive,
        manager,
        declinedReason,
        guarantors,
        easyPayment, // easyPayment is an array, ensure it's an array of payments
        paymentMethod,
        branch,
        status,
        commotion,
        headAdminApproval,
        penalty
      });
  
      // Process easy payments to check if full payments are made
      transaction.processEasyPayments();
  
      // Save the transaction to the database
      await transaction.save();
  
      // Send the saved transaction as a response
      res.status(201).json({
        success: true,
        message: 'Transaction successfully created!',
        data: transaction
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: 'An error occurred while creating the transaction.',
        error: err.message
      });
    }
  });

 // GET API to fetch all transactions by customer NIC
router.get('/customer/:customerNIC', async (req, res) => {
    try {
      const { customerNIC } = req.params;  // Get the customerNIC from the request params
  
      // Find all transactions where the customerNIC matches
      const transactions = await Transaction.find({ customerNIC });
  
      if (!transactions || transactions.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No transactions found for this customer.',
        });
      }
  
      // Send the transactions as a response
      res.status(200).json({
        success: true,
        data: transactions,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: 'An error occurred while fetching transactions.',
        error: err.message,
      });
    }
  });
  
  //Payment Complete  End Poin ------------------------------
  
  // router.post('/savetransactionY', async (req, res) => {
  //   try {
  //     const {
  //       customerNIC,
  //       executiveNIC,
  //       productVariantId,
  //       subtotal,
  //       downPayment,
  //       remainingBalance,
  //       monthlyPayment,
  //       paymentType,
  //       easyPaymentMonths,
  //       guarantors = []  // Default to an empty array if no guarantors are provided
  //     } = req.body;
  
  //     // Find customer and executive based on NICs
  //     const customer = await User.findOne({ nicNumber: customerNIC });
  //     const executive = await User.findOne({ nicNumber: executiveNIC });
  
  //     if (!customer || !executive) {
  //       return res.status(404).json({ message: 'Customer or Executive not found' });
  //     }
  
  //     // Find the product variant based on the ID
  //     const product = await Product.findOne({ 'productVariants._id': productVariantId });
  //     if (!product) {
  //       return res.status(404).json({ message: 'Product variant not found' });
  //     }
  
  //     // Retrieve the product variant details
  //     const productVariant = product.productVariants.find(variant => variant._id.toString() === productVariantId);
      
  //     // Calculate total price after commission
  //     const commission = (subtotal * 3) / 100;
  //     const totalAmount = subtotal + commission;
  //     const remainingAmount = totalAmount - downPayment;
  //     const monthlyPaymentCalculated = remainingAmount / easyPaymentMonths;
  
  //     // Create easy payment schedule
  //     const payments = [];
  //     let dueAmount = remainingAmount;
  //     for (let i = 0; i < easyPaymentMonths; i++) {
  //       const payment = {
  //         amount: monthlyPaymentCalculated,
  //         doneDate: new Date(),
  //         dueAmount: dueAmount,
  //         dueDate: new Date(new Date().setMonth(new Date().getMonth() + i + 1)),
  //         easyPaymentMonth: i + 1,
  //         easyPaymentYear: new Date().getFullYear(),
  //         status: 'pending'
  //       };
  //       payments.push(payment);
  //       dueAmount -= monthlyPaymentCalculated; // Decrement due amount
  //     }
  
  //     // Create transaction object
  //     const transaction = new Transaction({
  //       transactionID: uuidv4(),
  //       customerName: customer.userName,
  //       customerNIC: customerNIC,
  //       product: {
  //         productID: product._id,
  //         productName: product.productName,
  //         productQuantity: 1
  //       },
  //       executive: {
  //         executiveName: executive.userName,
  //         executiveNIC: executiveNIC
  //       },
  //       guarantors: guarantors,  // Use provided guarantors or empty array
  //       easyPayment: {
  //         payments: payments
  //       },
  //       paymentMethod: paymentType,
  //       branch: customer.branch,
  //       status: 'Pending',
  //       commotion: '',
  //       headAdminApproval: false,
  //       penalty: null
  //     });
  
  //     // Save transaction to the database
  //     await transaction.save();
  
  //     return res.status(201).json({ message: 'Transaction saved successfully', transaction });
  //   } catch (error) {
  //     console.error(error);
  //     return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  //   }
  // });
  

// POST route to find a single productVariant by its ID
router.post('/findQ', async (req, res) => {
  try {
      // Get the variantId from the request body
      const { variantId } = req.body; // variantId should be a single ObjectId string
      
      // Query the Product collection for the product that contains the variantId
      const product = await Product.findOne({
          'productVariants._id': variantId // Find the product containing the matching variantId
      }).select('productVariants'); // Only return the productVariants field

      if (!product) {
          return res.status(404).json({ message: 'Product not found' });
      }

      // Find the specific variant from the product's variants
      const foundVariant = product.productVariants.find(variant => String(variant._id) === String(variantId));

      if (!foundVariant) {
          return res.status(404).json({ message: 'Variant not found' });
      }

      // Format the response as per your required structure
      const formattedData = {
          name: foundVariant.name,      // The variant's name (e.g., "64GB")
          stock: foundVariant.stock,    // The variant's stock
          price: foundVariant.price,    // The variant's price (keep as string)
          _id: foundVariant._id         // The variant's _id
      };

      console.log(formattedData); // Log the formatted data

      return res.status(200).json(formattedData); // Return the formatted data as JSON
  } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
  }
});

// Helper function to get product variant details by ID
async function getProductVariantDetails(variantId) {
  try {
    // Query the Product collection for the product containing the variantId
    const product = await Product.findOne({
      'productVariants._id': variantId
    }).select('productVariants'); // Only return the productVariants field

    if (!product) {
      throw new Error('Product not found');
    }

    // Find the specific variant from the product's variants
    const foundVariant = product.productVariants.find(variant => String(variant._id) === String(variantId));

    if (!foundVariant) {
      throw new Error('Variant not found');
    }

    // Return the necessary data
    return {
      name: foundVariant.name,
      stock: foundVariant.stock,
      price: foundVariant.price,
      _id: foundVariant._id
    };
  } catch (err) {
    throw new Error('Error fetching product variant details: ' + err.message);
  }
}

// POST route to save the transaction
router.post('/savetransactionGWQ', async (req, res) => {
  try {
    const {
      customerNIC,
      executiveNIC,
      productVariantId,
      subtotal,
      downPayment,
      remainingBalance,
      monthlyPayment,
      paymentType,
      easyPaymentMonths
    } = req.body;

    // Find customer by NIC
    const customer = await User.findOne({ nicNumber: customerNIC });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Find executive by NIC
    const executive = await User.findOne({ nicNumber: executiveNIC });
    if (!executive) {
      return res.status(404).json({ message: 'Executive not found' });
    }

    // Get product variant details using the helper function
    let productVariant;
    try {
      productVariant = await getProductVariantDetails(productVariantId);
    } catch (err) {
      return res.status(404).json({ message: err.message });
    }

    // Ensure guarantors are populated with required fields
    let guarantors = customer.guarantors || [];

    // Ensure each guarantor has the required fields
    guarantors = guarantors.map(guarantor => ({
      guarantorNIC: guarantor.nicNumber,
      guarantorName: guarantor.userName,
      ...guarantor,
    }));

    if (guarantors.length === 0) {
      guarantors = []; // Or add placeholders if needed
    }

    // Calculate total price after commission (3% commission)
    const commission = (subtotal * 3) / 100;
    const totalAmount = subtotal; //+ commission;
    const remainingAmount = totalAmount - downPayment;
    const monthlyPaymentCalculated = remainingAmount / easyPaymentMonths;
    
    console.log("Commission - ", commission, "TotalAmount - ", totalAmount, "Remaining Amount - ", remainingAmount, "monthly Pay - ", monthlyPaymentCalculated);

    // Create the easy payment schedule
    const payments = [];
    let dueAmount = remainingAmount;
    for (let i = 0; i < easyPaymentMonths; i++) {
      const payment = {
        amount: monthlyPaymentCalculated,
        doneDate: new Date(),
        dueAmount: dueAmount,
        dueDate: new Date(new Date().setMonth(new Date().getMonth() + i + 1)),
        easyPaymentMonth: i + 1,
        easyPaymentYear: new Date().getFullYear(),
        status: 'pending'
      };
      payments.push(payment);
      dueAmount -= monthlyPaymentCalculated;  // Decrease due amount
    }

    // Generate the transaction ID using uuid
    const transactionID = uuidv4();

    // Check if full payment has been made
    let transactionStatus = 'Pending';
    if (remainingBalance === 0) {
      if (productVariant.stock <= 0) {
        console.log('Insufficient quantity available for this product variant');
        return res.status(400).json({ message: 'Insufficient product quantity' });
      }

      // Reduce the product variant quantity by 1
      console.log('Reducing quantity of product variant');
      productVariant.stock -= 1;

      // Save the updated product with reduced quantity
      await Product.updateOne(
        { 'productVariants._id': productVariant._id },
        { $set: { 'productVariants.$.stock': productVariant.stock } }
      );

      // Update transaction status to 'Completed'
      transactionStatus = 'Completed';
    }

    // Create the transaction object
    const transaction = new Transaction({
      transactionID: transactionID,
      customerName: customer.userName,
      customerNIC: customerNIC,
      product: {
        productID: productVariant._id,
        productName: productVariant.name,
        productQuantity: 1
      },
      executive: {
        executiveName: executive.userName,
        executiveNIC: executiveNIC
      },
      guarantors: guarantors,
      easyPayment: {
        payments: payments
      },
      paymentMethod: paymentType,
      branch: customer.branch,
      status: transactionStatus,
      commission: commission,
      headAdminApproval: null,
      penalty: null
    });

    // Save the transaction to the database
    await transaction.save();

    return res.status(201).json({ message: 'Transaction saved successfully', transaction });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// GET route to retrieve all transactions
router.get('/gettransactions', async (req, res) => {
  try {
    // Retrieve all transactions from the database
    const transactions = await Transaction.find({ headAdminApproval: null });

    // If no transactions are found, return a 404 error
    if (!transactions || transactions.length === 0) {
      return res.status(404).json({ message: 'No transactions found' });
    }

    // Return the list of transactions
    return res.status(200).json({ message: 'Transactions retrieved successfully', transactions });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// GET route to retrieve all transactions
router.get('/gettransactionsall', async (req, res) => {
  try {
    // Retrieve all transactions from the database
    const transactions = await Transaction.find();

    // If no transactions are found, return a 404 error
    if (!transactions || transactions.length === 0) {
      return res.status(404).json({ message: 'No transactions found' });
    }

    // Return the list of transactions
    return res.status(200).json({ message: 'Transactions retrieved successfully', transactions });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});



// // A separate function to reduce the stock of a product variant
const reduceVariantStock = async (variantId) => {
  try {
    // Find the product that contains the variant with the given variantId
    const product = await Product.findOne({ "productVariants._id": variantId });

    if (!product) {
      throw new Error("Product with the specified variant not found");
    }

    // Find the variant inside the product's productVariants array
    const variant = product.productVariants.find(v => v._id.toString() === variantId);

    if (!variant) {
      throw new Error("Product variant not found");
    }

    // Check if the stock is greater than 0 before reducing
    if (variant.stock <= 0) {
      throw new Error("No stock available to reduce");
    }

    // Reduce the quantity of the variant by 1
    variant.stock -= 1;

    // Save the updated product back to the database
    await product.save();

    return { product, message: "Quantity reduced successfully" };
  } catch (error) {
    throw new Error(error.message);
  }
};

// router.post('/transactions', (req,res) => {
   

// })


// API route to handle updating head admin approval and reduce product stock
router.post('/transactionsBN', async (req, res) => {
  const { transactionID } = req.body;  // Assuming the transaction ID is sent in the request body

  try {
    // Find the transaction using the provided transaction ID
    const transaction = await Transaction.findOne({ transactionID });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Update the headAdminApproval field to true
    transaction.headAdminApproval = true;

    // Save the updated transaction
    await transaction.save();

    // Reduce the stock of the associated product
    const productID = transaction.product.productID;  // Assuming productID is stored in the transaction
    const result = await reduceVariantStock(productID);

    // Respond with success
    return res.status(200).json({
      message: "Transaction approved and product stock reduced successfully",
      product: result.product,
    });
  } catch (error) {
    // Catch and handle errors
    return res.status(500).json({ message: error.message });
  }
});


  

module.exports = router;