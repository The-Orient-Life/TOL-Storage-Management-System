const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the main User Schema
const userSchema = new Schema({
  userName: {
    type: String,
    required: true
  },
  nicNumber: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phoneNumber1: {
    type: String,
    required: true
  },
  phoneNumber2: {
    type: String,
    required: false
  },
  address: {
    type: String,
    required: true
  },
  branch: {
    type: String,
    required: true
  },
  // Guarantors field, an array of objects (optional)
  guarantors: [{
    userName: {
      type: String,
      required: true
    },
    nicNumber: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phoneNumber1: {
      type: String,
      required: true
    },
    phoneNumber2: {
      type: String,
      required: false
    },
    address: {
      type: String,
      required: true
    },
    branch: {
      type: String,
      required: true
    }
  }],
  // Store photo data if provided (optional)
  photo: {
    type: [Schema.Types.Mixed],
    required: false
  },
  // Role can be 'User' or 'Guarantor'
  role: {
    type: String,
    enum: ['Customer', 'Executive', 'Manager'],
    required: true
  }
}, { timestamps: true });  // This enables timestamps: createdAt and updatedAt

// Create a model for the User schema
const User = mongoose.model('User', userSchema);

// Export the model
module.exports = User;
