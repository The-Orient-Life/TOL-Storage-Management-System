const express = require('express');
const router = express.Router();

const Transaction = require("../models/Transaction.js")
const User = require("../models/User.js");
const Product = require("../models/Product.js");

const { v4: uuidv4 } = require('uuid'); // To generate unique transaction IDs
const ExcelJS = require('exceljs');

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

    if (paymentType === "Full Payment") {
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
  const { transactionID, AdminName } = req.body;  // Assuming the transaction ID is sent in the request body

  try {
    // Find the transaction using the provided transaction ID
    const transaction = await Transaction.findOne({ transactionID });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Update the headAdminApproval field to true
    transaction.headAdminApproval = true;
    console.log("head admin Name : ", AdminName);
    transaction.headAdminName = AdminName;

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


// API route to handle finding payment by payment ID
router.post('/findpayment', async (req, res) => {
  try {
    const { paymentId } = req.body;  // Extract paymentId from request body

    if (!paymentId) {
      return res.status(400).json({ message: "Payment ID is required" });
    }

    // Find the transaction document where the payment ID exists within the easyPayment array
    const transaction = await Transaction.findOne({
      "easyPayment.payments._id": paymentId  // Match paymentId in the payments array
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction with the provided payment ID not found" });
    }

    // Find the specific payment that matches the paymentId
    const payment = transaction.easyPayment.payments.find(payment => payment._id.toString() === paymentId);

    if (!payment) {
      return res.status(404).json({ message: "Payment not found for the given payment ID" });
    }

    // Return only the payment details
    res.status(200).json(payment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


// API route to find payment details and show the full payments array
router.get('/findpaymentdetails/:paymentId', async (req, res) => {
  try {
    const { paymentId } = req.params;  // Extract payment ID from the URL parameter

    // Find the transaction where the paymentId is in the 'payments' array
    const transaction = await Transaction.findOne({
      "easyPayment.payments._id": paymentId
    });

    // Check if transaction is found
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Return the entire payments array
    return res.status(200).json(transaction.easyPayment.payments);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});



  

// Assuming you're using Express.js for your API

// Route to handle payment processing
router.post('/processpayment', async (req, res) => {
  try {
    const { paymentId, paymentAmount } = req.body;  // Extract payment ID and amount from the request

    // Find the transaction containing the given paymentId
    const transaction = await Transaction.findOne({
      "easyPayment.payments._id": paymentId
    });

    // Check if the transaction exists
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Locate the payment in the payments array by paymentId
    const payment = transaction.easyPayment.payments.find(p => p._id.toString() === paymentId);
    
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    let remainingPayment = paymentAmount;  // Start with the payment amount
    let updatedPayments = [];

    // Process payments month by month
    for (let i = 0; i < transaction.easyPayment.payments.length; i++) {
      const currentPayment = transaction.easyPayment.payments[i];

      if (remainingPayment > 0) {
        if (currentPayment.dueAmount > 0) {
          // If the customer has enough to pay for this month
          if (remainingPayment >= currentPayment.dueAmount) {
            // Overpay or exact pay the full dueAmount
            remainingPayment -= currentPayment.dueAmount;
            currentPayment.dueAmount = 0;
            currentPayment.status = "paid";  // Mark this month as paid
          } else {
            // Partial payment (not enough to cover the full dueAmount)
            currentPayment.dueAmount -= remainingPayment;
            remainingPayment = 0;
            currentPayment.status = "pending";
           // currentPayment.status = "paid";  // Month still pending
          }
        }
      }

      updatedPayments.push(currentPayment);
    }

    // Update the transaction's payments and due amount
    transaction.easyPayment.payments = updatedPayments;

    // Calculate the new remaining due amount for the transaction
    const newDuePayment = transaction.easyPayment.payments.reduce((total, payment) => total + payment.dueAmount, 0);

    transaction.duePayment = newDuePayment;
    //transaction.status = "paid"

    // Save the updated transaction to the database
    await transaction.save();

    return res.status(200).json({
      message: "Payment processed successfully",
      updatedTransaction: transaction
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});



// Route to handle payment processing
router.post('/processpaymentWWW', async (req, res) => {
  try {
    const { paymentId, paymentAmount } = req.body;  // Extract payment ID and amount from the request

    // Find the transaction containing the given paymentId
    const transaction = await Transaction.findOne({
      "easyPayment.payments._id": paymentId
    });

    // Check if the transaction exists
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Locate the payment in the payments array by paymentId
    const payment = transaction.easyPayment.payments.find(p => p._id.toString() === paymentId);
    
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    let remainingPayment = paymentAmount;  // Start with the payment amount
    let updatedPayments = [];

    // Process payments month by month
    for (let i = 0; i < transaction.easyPayment.payments.length; i++) {
      const currentPayment = transaction.easyPayment.payments[i];

      if (remainingPayment > 0) {
        if (currentPayment.amount > 0) {
          // If the customer has enough to pay for this month
          if (remainingPayment >= currentPayment.amount) {
            // Overpay or exact pay the full amount
            remainingPayment -= currentPayment.amount;
            currentPayment.amount = 0;
            currentPayment.status = "paid";  // Mark this month as paid
          } else {
            // Partial payment (not enough to cover the full amount)
            currentPayment.amount -= remainingPayment;
            remainingPayment = 0;
            currentPayment.status = "pending";  // Month still pending
          }
        }
      }

      updatedPayments.push(currentPayment);
    }

    // Update the transaction's payments and amount remaining
    transaction.easyPayment.payments = updatedPayments;

    // Calculate the new remaining amount for the transaction
    const newRemainingAmount = transaction.easyPayment.payments.reduce((total, payment) => total + payment.amount, 0);
    transaction.remainingAmount = newRemainingAmount;

    // If no amount is remaining, mark the transaction as paid
    if (newRemainingAmount === 0) {
      transaction.status = "paid";
    } else {
      transaction.status = "Pending";
    }

    // Save the updated transaction to the database
    await transaction.save();

    return res.status(200).json({
      message: "Payment processed successfully",
      updatedTransaction: transaction
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});



// Route to handle payment processing
router.post('/processpaymentTTTQW', async (req, res) => {
  try {
    const { paymentId, paymentAmount } = req.body;  // Extract payment ID and amount from the request

    // Find the transaction containing the given paymentId
    const transaction = await Transaction.findOne({
      "easyPayment.payments._id": paymentId
    });

    // Check if the transaction exists
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Locate the payment in the payments array by paymentId
    const payment = transaction.easyPayment.payments.find(p => p._id.toString() === paymentId);
    
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    let remainingPayment = paymentAmount;  // Start with the payment amount
    let updatedPayments = [];
    let overpaidAmount = 0; // Variable to track overpayment

    // Process payments month by month
    for (let i = 0; i < transaction.easyPayment.payments.length; i++) {
      const currentPayment = transaction.easyPayment.payments[i];

      if (remainingPayment > 0 || overpaidAmount > 0) {
        let paymentForMonth = currentPayment.amount + overpaidAmount; // Add overpaid amount from previous month

        if (paymentForMonth >= remainingPayment) {
          // If the customer has enough to pay for this month (considering overpayment)
          currentPayment.amount = 0;
          currentPayment.status = "paid";  // Mark this month as paid
          remainingPayment -= paymentForMonth; // Reduce the remaining payment

          // If there's any leftover payment, it becomes the overpayment for the next month
          overpaidAmount = remainingPayment < 0 ? Math.abs(remainingPayment) : 0;
        } else {
          // If the payment for this month is not enough to cover the full amount
          currentPayment.amount -= paymentForMonth; // Reduce the current month's due amount
          remainingPayment = 0; // All payment for this month is done
          currentPayment.status = "pending"; // Month still pending
          overpaidAmount = 0; // No more overpayment for next months
        }
      }

      updatedPayments.push(currentPayment);
    }

    // Update the transaction's payments and amount remaining
    transaction.easyPayment.payments = updatedPayments;

    // Calculate the new remaining amount for the transaction
    const newRemainingAmount = transaction.easyPayment.payments.reduce((total, payment) => total + payment.amount, 0);
    transaction.remainingAmount = newRemainingAmount;

    // If no amount is remaining, mark the transaction as paid
    if (newRemainingAmount === 0) {
      transaction.status = "paid";
    } else {
      transaction.status = "Pending";
    }

    // Save the updated transaction to the database
    await transaction.save();

    return res.status(200).json({
      message: "Payment processed successfully",
      updatedTransaction: transaction
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


// Route to handle payment processing
router.post('/processpaymentXMXM', async (req, res) => {
 
});


/////////////////////////////

router.post('/processpaymentFINAL', async (req, res) => {
  try {
    const { paymentId, paymentAmount } = req.body;  // Extract payment ID and amount from the request

    // Find the transaction containing the given paymentId
    const transaction = await Transaction.findOne({
      "easyPayment.payments._id": paymentId
    });

    // Check if the transaction exists
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Locate the payment in the payments array by paymentId
    const payment = transaction.easyPayment.payments.find(p => p._id.toString() === paymentId);
    
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    // Deduct the paymentAmount from the current payment's dueAmount
    let remainingPayment = payment.amount - paymentAmount;

    // If remaining amount is less than or equal to 0, mark the payment as paid
    if (remainingPayment <= 0) {
      payment.amount = 0;
      payment.status = "paid";
    } else {
      // Otherwise, update the due amount to the remaining payment
      payment.amount = remainingPayment;
      payment.status = "pending";
    }

    // Save the updated transaction to the database
    await transaction.save();

    return res.status(200).json({
      message: "Payment processed successfully",
      updatedTransaction: transaction
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


/////////////////////////////////////////

router.post('/processpaymentLastFinal', async (req, res) => {
  try {
    const { paymentId, paymentAmount } = req.body;  // Extract payment ID and amount from the request

    // Find the transaction containing the given paymentId
    const transaction = await Transaction.findOne({
      "easyPayment.payments._id": paymentId
    });

    // Check if the transaction exists
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Locate the payment in the payments array by paymentId
    const payment = transaction.easyPayment.payments.find(p => p._id.toString() === paymentId);
    
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    // Deduct the paymentAmount from the current payment's dueAmount
    let remainingPayment = payment.amount - paymentAmount;

    // If remaining amount is less than or equal to 0, mark the payment as paid
    if (remainingPayment <= 0) {
      payment.amount = 0;
      payment.status = "paid";
    } else {
      // Otherwise, update the due amount to the remaining payment
      payment.amount = remainingPayment;
      payment.status = "pending";
    }

    // Check if all payments are fully paid
    const allPaymentsPaid = transaction.easyPayment.payments.every(p => p.amount === 0 && p.status === "paid");

    // If all payments are paid, update the transaction status to "Completed"
    if (allPaymentsPaid) {
      transaction.status = "Completed";
    }

    // Save the updated transaction to the database
    await transaction.save();

    return res.status(200).json({
      message: "Payment processed successfully",
      updatedTransaction: transaction
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});



router.get('/export-transactions', async (req, res) => {
  try {
    const transactions = await Transaction.find();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Transactions');

    // Set headers
    worksheet.columns = [
      { header: 'Transaction ID', key: 'transactionID', width: 30 },
      { header: 'Customer Name', key: 'customerName', width: 25 },
      { header: 'Customer NIC', key: 'customerNIC', width: 20 },
      { header: 'Product Name', key: 'productName', width: 25 },
      { header: 'Product Quantity', key: 'productQuantity', width: 20 },
      { header: 'Executive Name', key: 'executiveName', width: 25 },
      { header: 'Branch', key: 'branch', width: 20 },
      { header: 'Payment Method', key: 'paymentMethod', width: 20 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Created At', key: 'createdAt', width: 25 },
    ];

    // Add rows
    transactions.forEach(tx => {
      worksheet.addRow({
        transactionID: tx.transactionID,
        customerName: tx.customerName,
        customerNIC: tx.customerNIC,
        productName: tx.product?.productName || '',
        productQuantity: tx.product?.productQuantity || '',
        executiveName: tx.executive?.executiveName || '',
        branch: tx.branch,
        paymentMethod: tx.paymentMethod,
        status: tx.status,
        createdAt: new Date(tx.createdAt).toLocaleString(),
      });

      // Optional: Add nested payment rows
      if (tx.easyPayment?.payments?.length) {
        tx.easyPayment.payments.forEach((p, index) => {
          worksheet.addRow({
            transactionID: '',
            customerName: '',
            customerNIC: '',
            productName: index === 0 ? 'Easy Payments:' : '',
            productQuantity: '',
            executiveName: '',
            branch: '',
            paymentMethod: '',
            status: '',
            createdAt: '',
          });

          worksheet.addRow({
            transactionID: `→ Month ${p.easyPaymentMonth}/${p.easyPaymentYear}`,
            customerName: `Due: ${p.dueAmount}`,
            customerNIC: `Status: ${p.status}`,
            productName: `Paid on: ${new Date(p.doneDate).toLocaleDateString()}`,
          });
        });
      }

      worksheet.addRow({}); // empty row between transactions
    });

    // Set response headers
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=transactions.xlsx'
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error('Excel export error:', err);
    res.status(500).send('Failed to export Excel');
  }
});



router.get('/export-transactionsTest', async (req, res) => {
  try {
    const { optionName, selectedPeriod } = req.query;

    // Determine status based on optionName
    let statusFilter = {};
    if (optionName === 'Ongoing Payments') {
      statusFilter.status = 'Pending';
    } else if (optionName === 'Completed Payments') {
      statusFilter.status = 'Completed';
    }

    // Date filtering
    let dateFilter = {};
    if (selectedPeriod === 'weekly') {
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      dateFilter.createdAt = { $gte: lastWeek };
    } else if (selectedPeriod === 'monthly') {
      const lastMonth = new Date();
      lastMonth.setDate(lastMonth.getDate() - 30);
      dateFilter.createdAt = { $gte: lastMonth };
    }

    // Combine filters
    const filter = { ...statusFilter, ...dateFilter };

    const transactions = await Transaction.find(filter);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Transactions');

    worksheet.columns = [
      { header: 'Transaction ID', key: 'transactionID', width: 30 },
      { header: 'Customer Name', key: 'customerName', width: 25 },
      { header: 'Customer NIC', key: 'customerNIC', width: 20 },
      { header: 'Product Name', key: 'productName', width: 25 },
      { header: 'Product Quantity', key: 'productQuantity', width: 20 },
      { header: 'Executive Name', key: 'executiveName', width: 25 },
      { header: 'Branch', key: 'branch', width: 20 },
      { header: 'Payment Method', key: 'paymentMethod', width: 20 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Created At', key: 'createdAt', width: 25 },
    ];

    transactions.forEach(tx => {
      worksheet.addRow({
        transactionID: tx.transactionID,
        customerName: tx.customerName,
        customerNIC: tx.customerNIC,
        productName: tx.product?.productName || '',
        productQuantity: tx.product?.productQuantity || '',
        executiveName: tx.executive?.executiveName || '',
        branch: tx.branch,
        paymentMethod: tx.paymentMethod,
        status: tx.status,
        createdAt: new Date(tx.createdAt).toLocaleString(),
      });

      // Add nested payment rows
      if (tx.easyPayment?.payments?.length) {
        tx.easyPayment.payments.forEach((p, index) => {
          worksheet.addRow({
            transactionID: '',
            customerName: '',
            customerNIC: '',
            productName: index === 0 ? 'Easy Payments:' : '',
            productQuantity: '',
            executiveName: '',
            branch: '',
            paymentMethod: '',
            status: '',
            createdAt: '',
          });

          worksheet.addRow({
            transactionID: `→ Month ${p.easyPaymentMonth}/${p.easyPaymentYear}`,
            customerName: `Due: ${p.dueAmount}`,
            customerNIC: `Status: ${p.status}`,
            productName: `Paid on: ${new Date(p.doneDate).toLocaleDateString()}`,
          });
        });
      }

      worksheet.addRow({}); // empty row
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=transactions.xlsx'
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error('Excel export error:', err);
    res.status(500).send('Failed to export Excel');
  }
});



router.get('/export-products', async (req, res) => {
  try {
    const { selectedPeriod } = req.query;

    let dateFilter = {};
    if (selectedPeriod === 'weekly') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      dateFilter.createdAt = { $gte: sevenDaysAgo };
    } else if (selectedPeriod === 'monthly') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      dateFilter.createdAt = { $gte: thirtyDaysAgo };
    }

    const products = await Product.find(dateFilter);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Products');

    // Headers
    worksheet.columns = [
      { header: 'Product Name', key: 'productName', width: 30 },
      { header: 'Category', key: 'productCategory', width: 25 },
      { header: 'Total Worth', key: 'productTotalWorth', width: 20 },
      { header: 'Stock Status', key: 'productStockStatus', width: 20 },
      { header: 'Created At', key: 'createdAt', width: 25 },
    ];

    // Add rows
    products.forEach(product => {
      worksheet.addRow({
        productName: product.productName,
        productCategory: product.productCategory,
        productTotalWorth: product.productTotalWorth,
        productStockStatus: product.productStockStatus,
        createdAt: new Date(product.createdAt).toLocaleString(),
      });

      if (product.productVariants?.length) {
        worksheet.addRow({ productCategory: 'Variants:' });
        worksheet.addRow({
          productName: 'Variant Name',
          productCategory: 'Stock',
          productTotalWorth: 'Price',
        });

        product.productVariants.forEach(variant => {
          worksheet.addRow({
            productName: `→ ${variant.name}`,
            productCategory: variant.stock,
            productTotalWorth: variant.price,
          });
        });

        worksheet.addRow({}); // space between products
      }
    });

    // Headers
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader('Content-Disposition', 'attachment; filename=products.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error('Excel export error:', err);
    res.status(500).send('Failed to export Excel');
  }
});

// Route to handle payment processing and get the count of transactions with headAdminApproval as null
router.post('/processpaymentXMXMQQQ', async (req, res) => {
  try {
    // Count transactions where headAdminApproval is null
    const count = await Transaction.countDocuments({ headAdminApproval: null });

    // Send the count as the response
    res.json({ count });
  } catch (error) {
    // Handle any potential errors
    console.error("Error while counting transactions:", error);
    res.status(500).json({ error: "An error occurred while fetching the count" });
  }
});


router.get('/sumeasypayment', async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const transactions = await Transaction.find({
      paymentMethod: "Easy Payment",
      createdAt: { $gte: thirtyDaysAgo }
    });

    let totalDueAmount = 0;

    transactions.forEach(transaction => {
      const payments = transaction.easyPayment?.payments;
      if (payments && payments.length > 0) {
        const firstPayment = payments[0];
        if (firstPayment && firstPayment.dueAmount > 0) {
          totalDueAmount += firstPayment.dueAmount;
        }
      }
    });

    return res.status(200).json({ totalFirstPaymentDueAmount: totalDueAmount });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});



router.get('/sumfullpayment', async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const transactions = await Transaction.find({
      paymentMethod: "Full Payment",
      createdAt: { $gte: thirtyDaysAgo }
    });

    let totalDueAmount = 0;

    transactions.forEach(transaction => {
      const payments = transaction.easyPayment?.payments;
      if (payments && payments.length > 0) {
        const firstPayment = payments[0];
        if (firstPayment && firstPayment.dueAmount > 0) {
          totalDueAmount += firstPayment.dueAmount;
        }
      }
    });

    return res.status(200).json({ totalFirstPaymentDueAmount: totalDueAmount });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});




/////////////////////////////////////////

router.get('/payment-trends', async (req, res) => {
  try {
    const now = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(now.getMonth() - 5);
    sixMonthsAgo.setDate(1); // Start of the first month

    const transactions = await Transaction.find({
      createdAt: { $gte: sixMonthsAgo }
    });

    // Initialize month buckets
    const monthMap = {};
    for (let i = 0; i < 6; i++) {
      const date = new Date();
      date.setMonth(now.getMonth() - i);
      const monthKey = date.toLocaleString('default', { month: 'short' });

      monthMap[monthKey] = {
        name: monthKey,
        easyPayment: 0,
        fullPayment: 0
      };
    }

    transactions.forEach(transaction => {
      const createdAt = new Date(transaction.createdAt);
      const monthKey = createdAt.toLocaleString('default', { month: 'short' });
      if (!monthMap[monthKey]) return;

      if (transaction.paymentMethod === "Easy Payment") {
        const payments = transaction.easyPayment?.payments || [];
        const totalPaid = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
        monthMap[monthKey].easyPayment += totalPaid;
      }

      if (transaction.paymentMethod === "Full Payment") {
        // If the totalAmount is a valid number, add it to fullPayment
        if (transaction.totalAmount && typeof transaction.totalAmount === 'number') {
          monthMap[monthKey].fullPayment += transaction.totalAmount;
        }

        // Add dueAmount from first Easy Payment (if present)
        const payments = transaction.easyPayment?.payments;
        const firstPayment = payments?.[0];
        if (firstPayment?.dueAmount > 0) {
          monthMap[monthKey].fullPayment += firstPayment.dueAmount;
        }
      }
    });

    // Sort from oldest to newest
    const sortedData = Object.values(monthMap).reverse();
    res.status(200).json(sortedData);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});



module.exports = router;