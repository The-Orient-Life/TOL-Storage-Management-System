const mongoose = require('mongoose');
const { Schema } = mongoose;

// Subschema for Executive
const executiveSchema = new Schema({
  executiveName: { type: String, required: true },
  executiveNIC: { type: String, required: true },
});

// Subschema for Manager
const managerSchema = new Schema({
  managerName: { type: String, required: true },
  managerNIC: { type: String, required: true },
  managerApproval: { type: Boolean, default: false },
});

// Subschema for Guarantor
const guarantorSchema = new Schema({
  guarantorName: { type: String, required: true },
  guarantorNIC: { type: String, required: true },
});

// Subschema for Easy Payment
const easyPaymentSchema = new Schema({
  amount: { type: Number, required: true }, // Amount paid in the current easy payment
  doneDate: { type: Date, required: true }, // Date when the payment was made
  dueAmount: { type: Number, required: true }, // Remaining due amount for the customer
  dueDate: { type: Date, required: true }, // Date when the next payment is due
  easyPaymentMonth: { type: Number, required: true }, // Month (1 to 12)
  easyPaymentYear: { type: Number, required: true }, // Year (e.g., 2025)
  status: { 
    type: String, 
    enum: ['paid', 'pending'], 
    default: 'pending' 
  }, // Status of the payment
});

// Method to check if the payment is fully paid
easyPaymentSchema.methods.checkFullPayment = function() {
  if (this.amount >= this.dueAmount) {
    this.status = 'paid'; // Mark as fully paid
    this.dueAmount = 0; // Set due amount to 0 since the full payment is made
  }
};

// Subschema for Penalty
const penaltySchema = new Schema({
  penaltyReason: { type: String },
  penaltyAmount: { type: Number },
  penaltyPaymentDate: { type: Date },
  executive: executiveSchema,
  managerApproval: { type: Boolean, default: false },
  reasonForDecline: { type: String },
  headAdminApproval: { type: Boolean, default: false },
});

// Main Transaction Schema
const transactionSchema = new Schema({
  transactionID: { type: String, required: true },
  customerName: { type: String, required: true },
  customerNIC: { type: String, required: true },
  product: {
    productID: { type: String, required: true },
    productName: { type: String, required: true },
    productQuantity: { type: Number, required: true },
  },
  executive: executiveSchema,
  manager: managerSchema,
  declinedReason: { type: String },
  guarantors: [guarantorSchema],
  easyPayment: {
    payments: [easyPaymentSchema], // List of easy payment records
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Credit', 'Debit', 'Online','Easy Payment','Full Payment'],
    required: true,
  },
  branch: { type: String, required: true },
  status: {
    type: String,
    enum: ['Pending', 'Completed', 'Declined', 'On Hold'],
    required: true,
  },
  commotion: { type: String },
  headAdminApproval: { type: Boolean, default: null },

  penalty: penaltySchema,
}, { timestamps: true });

// Add index using schema.index()
transactionSchema.index({ transactionID: 1 });
transactionSchema.index({ customerNIC: 1 });

// Add a method to process full payment check for easy payments
transactionSchema.methods.processEasyPayments = function() {
  this.easyPayment.payments.forEach(payment => {
    payment.checkFullPayment(); // Check and update the status of each easy payment
  });
};

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
