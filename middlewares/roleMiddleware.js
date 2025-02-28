// middlewares/roleMiddleware.js
const roleMiddleware = (allowedRoles) => {
    return (req, res, next) => {
      // Ensure the user data is available (set by authMiddleware)
      if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
      }
      // Check if the user's role is one of the allowed roles
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Access denied: insufficient permissions' });
      }
      next();
    };
  };
  
  module.exports = roleMiddleware;
  