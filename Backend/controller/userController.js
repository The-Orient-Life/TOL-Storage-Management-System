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

router.get("/getuser", async (req, res) => {
  try {
    const { nicNumber } = req.query;

    if (!nicNumber) {
      return res.status(400).json({ message: "NIC Number is required" });
    }

    const user = await User.findOne({ nicNumber });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

// GET all users with the role "Customer"
router.get("/getusers", async (req, res) => {
  try {
    
    const users = await User.find({ role: "Customer" });

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found with the role 'Customer'" });
    }

    
    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

// GET all users with the role "Manager"
router.get("/getmanager", async (req, res) => {
  try {

    const users = await User.find({ role: "Manager" });

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found with the role 'Manager'" });
    }


    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

// GET all users with the role "Manager"
router.get("/getexecutive", async (req, res) => {
  try {

    const users = await User.find({ role: "Executive" });

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found with the role 'Executive'" });
    }


    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;