const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const isAuthenticated = require("../middleware/auth.js");

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
    role,
    password
  } = req.body;

  try {


    // Check if email or username already exists
    const existingUser = await User.findOne({ $or: [{ email }, { userName }] });
    if (existingUser) {
      return res.json({ status: "error", error: "Email or username already registered" });
    }

    // Check if the role is Executive or Manager, and if password is provided
    if ((role === 'Executive' || role === 'Manager') && !password) {
      return res.status(400).json({ message: 'Password is required for Executive or Manager roles' });
    }

    if (!email || typeof email !== "string") {
      return res.json({ status: "error", error: "Email empty or invalid" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.json({ status: "error", error: "Invalid email format" });
    }

    // Password validation using regex
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.json({
        status: "error",
        error: "Invalid password format"
      });
    }

    const hashPassword = await bcrypt.hash(password, 12)

    // Create a new User document
    const newUser = await new User({
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
      password: hashPassword
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


router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Ensure both username and password are provided
  if (!username || !password) {
    return res.status(400).json({ status: "error", error: "No data provided" });
  }

  try {
    // Query to find the user by either email or userName (adjusted based on your schema)
    const user = await User.findOne({
      $or: [
        { email: { $regex: username, $options: 'i' } }, // Case-insensitive search for email
        { userName: { $regex: username, $options: 'i' } } // Case-insensitive search for userName
      ]
    }).select("+password"); // Include password field in the result (because it’s `select: false` by default)

    if (!user) {
      return res.status(404).json({ status: "error", error: "User Not Found" });
    }

    // If the user exists and has a password
    if (user.password) {
      // Compare the provided password with the stored hashed password
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        // If the password matches, generate a JWT token
        const token = jwt.sign(
          { id: user._id, userName: user.userName }, // Payload with user info
          process.env.JWT_SECRET, // Your JWT secret key
          { expiresIn: '1h' } // Token expiration time
        );
        return res.status(200).json({ status: "ok", token });
      } else {
        // If the password does not match
        return res.status(400).json({ status: "error", error: "Invalid password" });
      }
    } else {
      // If no password is found for the user (like a Customer with no password)
      return res.status(400).json({ status: "error", error: "No password set for this user" });
    }
  } catch (error) {
    // Catch any unexpected errors
    console.error("Error during login:", error);
    return res.status(500).json({ status: "error", error: "Internal server error" });
  }
});



// get user API endpoint
router.get("/getUserDetails", async (req, res) => {
  try {
    // Get the userId from query parameters (you can use req.query or req.body depending on the frontend implementation)
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ status: "error", error: "User ID is required." });
    }

    // Find the user by the provided userId
    const user = await User.findById(userId).select("-password");

    // If user is not found, return an error
    if (!user) {
      return res.status(404).json({ status: "error", error: "User not found." });
    }

    res.json(user); // Return the user details
  } catch (err) {
    console.error("Error in getUser route:", err); // Log error for debugging
    res.status(500).json({ status: "error", error: "Server error" });
  }
});



module.exports = router;