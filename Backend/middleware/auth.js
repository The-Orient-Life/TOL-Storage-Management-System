const jwt = require("jsonwebtoken");
require("dotenv").config();

// Define constant error messages
const ERROR_MESSAGES = {
  missingToken: "Authorization token is required.",
  invalidToken: "Invalid token format.",
  tokenExpired: "Token has expired.",
  authenticationError: "Authentication failed. Please try again.",
};

const isAuthenticated = async (req, res, next) => {
  const token = req.headers.authorization;

  // Check if token is present
  if (!token) {
    return res.status(401).json({ status: "error", error: ERROR_MESSAGES.missingToken });
  }

  // Extract token from 'Bearer <token>' format
  const tokenParts = token.split(" ");
  if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
    return res.status(401).json({ status: "error", error: ERROR_MESSAGES.invalidToken });
  }

  // Verify the token
  try {
    const decoded = jwt.verify(tokenParts[1], process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    // Handle specific JWT errors
    if (err.name === "TokenExpiredError") {
      return res.status(403).json({ status: "error", error: ERROR_MESSAGES.tokenExpired });
    }
    return res.status(401).json({ status: "error", error: ERROR_MESSAGES.authenticationError });
  }
};

module.exports = isAuthenticated;
