const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// First verify the token, then check for admin role
router.get('/dashboard', authMiddleware, roleMiddleware(['admin']), (req, res) => {
  res.json({
    message: "Welcome to the admin dashboard!",
    user: req.user
  });
});

module.exports = router;
