const jwt = require("jsonwebtoken");
require("dotenv").config();

const isAuthenticated = (req, res, next) => {

    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ status: "error", error: "Invalid Token Or Token Expired Token" })
    }
    try {

        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();

    } catch (err) {

        // Differentiate the error for expired token
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                status: "error",
                error: "Token has expired"
            });
        }

        return res.status(401).json({ status: "Error", error: "Authentication Error" })
    }
}

module.exports = isAuthenticated;