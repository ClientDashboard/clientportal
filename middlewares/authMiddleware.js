// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Ensure JWT_SECRET is available
  if (!process.env.JWT_SECRET) {
    console.error("❌ ERROR: Missing JWT_SECRET in .env file!");
    return res.status(500).json({ error: "Internal server error" });
  }

  // Check for the Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  // Extract the token from the header
  const token = authHeader.split(" ")[1];

  try {
    // Verify the token using the secret from your environment
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    // Handle specific JWT errors
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired, please log in again" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token" });
    }

    // Log the error in development mode
    if (process.env.NODE_ENV !== "production") {
      console.error("JWT Verification Error:", error);
    }

    return res.status(401).json({ error: "Authentication failed" });
  }
};

module.exports = authMiddleware;
