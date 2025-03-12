const express = require('express');
const router = express.Router();

const User = require("../models/User.js")


//userRegisterAPI --------------------------------------------------------------------------------------------------------------


router.post('/register', async (req, res) => {
    const {
      userName,
      nicNumber,
      email,
      phoneNumber1,
      phoneNumber2,
      address,
      branch,
      guarantors,
      photo,
      role
    } = req.body;
  
    try {
      // Validate role (should be 'User')
      // if (role !== 'User') {
      //   return res.status(400).json({ message: "Role must be 'User'" });
      // }
      // if (!role || role.trim() === '') {
      //   role = 'Customer';  // Set to 'Customer' if the role is empty
      // }
  
      // Create a new User document
      const newUser = new User({
        userName,
        nicNumber,
        email,
        phoneNumber1,
        phoneNumber2,
        address,
        branch,
        guarantors: guarantors || [], // Optional field: If no guarantors, set to an empty array
        photo: photo || [],           // Optional field: If no photos, set to an empty array
        role,
      });
  
      await newUser.save();
  
      // Respond with the saved user data (excluding sensitive data like password if you add one)
      res.status(201).json({ message: 'User registered successfully', user: newUser });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error, could not register user', error: err.message });
    }
  });

  module.exports = router;