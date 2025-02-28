// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
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
    // Attach the decoded user info to the request
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = authMiddleware;
