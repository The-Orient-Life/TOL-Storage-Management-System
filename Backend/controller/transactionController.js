const express = require('express');
const router = express.Router();

const Transaction = require("../models/Transaction.js")

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
  

module.exports = router;