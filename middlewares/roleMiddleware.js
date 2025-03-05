// middlewares/roleMiddleware.js
const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    // Ensure user data exists (set by authMiddleware)
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Ensure the user's role is defined
    if (!req.user.role) {
      return res.status(403).json({ error: 'Access denied: User role not found' });
    }

    // Check if the user's role is in the allowed roles list
    if (!allowedRoles.includes(req.user.role)) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          `[Access Denied] User Role: ${req.user.role}, Allowed Roles: ${allowedRoles.join(", ")}`
        );
      }
      return res.status(403).json({
        error: `Access denied: User role '${req.user.role}' is not authorized for this action`,
      });
    }

    next();
  };
};

module.exports = roleMiddleware;
