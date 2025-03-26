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
  
  router.post('/savetransactionG', async (req, res) => {
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
  
      // Find product variant by ID
      const product = await Product.findOne({ 'productVariants._id': productVariantId });
      if (!product) {
        return res.status(404).json({ message: 'Product variant not found' });
      }
  
      // Retrieve the product variant details
      const productVariant = product.productVariants.find(variant => variant._id.toString() === productVariantId);
  
      // Ensure guarantors are populated with required fields
      let guarantors = customer.guarantors || [];
  
      // Ensure each guarantor has the required fields
      guarantors = guarantors.map(guarantor => ({
        guarantorNIC: guarantor.nicNumber,  // Assuming `nicNumber` is the NIC field
        guarantorName: guarantor.userName, // Assuming `userName` is the name field
        ...guarantor,  // Spread the remaining guarantor fields
      }));
  
      // If guarantors array is empty, we can set it to an empty array or add placeholders
      if (guarantors.length === 0) {
        guarantors = [];  // Or, if needed, you can add placeholders here.
      }
  
      // Calculate total price after commission (3% commission)
      const commission = (subtotal * 3) / 100;
      const totalAmount = subtotal; //+ commission;
      const remainingAmount = totalAmount - downPayment;
      const monthlyPaymentCalculated = remainingAmount / easyPaymentMonths;
  console.log("Commission - ",commission, "TotalAmount - ",totalAmount, "Remaining Amount - ",remainingAmount, "monthly Pay - ", monthlyPaymentCalculated);
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
  
      // Create the transaction object
      const transaction = new Transaction({
        transactionID: transactionID,
        customerName: customer.userName,
        customerNIC: customerNIC,
        product: {
          productID: product._id,
          productName: product.productName,
          productQuantity: 1
        },
        executive: {
          executiveName: executive.userName,
          executiveNIC: executiveNIC
        },
        guarantors: guarantors,  // Use the customer's guarantors or an empty array
        easyPayment: {
          payments: payments
        },
        paymentMethod: paymentType,
        branch: customer.branch,
        status: 'Pending',
        commotion: commission,
        headAdminApproval: false,
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
  

module.exports = router;