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
  amount: { type: Number, required: true },
  doneDate: { type: Date, required: true },
  dueAmount: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  easyPaymentMonth: { type: Number, required: true }, // Month (1 to 12)
  easyPaymentYear: { type: Number, required: true }, // Year (e.g., 2025)
});

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
    payments: [easyPaymentSchema],
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Credit', 'Debit', 'Online'],
    required: true,
  },
  branch: { type: String, required: true },
  status: {
    type: String,
    enum: ['Pending', 'Completed', 'Declined', 'On Hold'],
    required: true,
  },
  commotion: { type: String },
  headAdminApproval: { type: Boolean, default: false },

  penalty: penaltySchema,
}, { timestamps: true });

// Add index using schema.index()
transactionSchema.index({ transactionID: 1 });
transactionSchema.index({ customerNIC: 1 });

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
