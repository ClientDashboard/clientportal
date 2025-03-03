const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware'); // Fixed path
const User = require('../models/User'); // Fixed path

// Existing dashboard endpoint
router.get('/dashboard', authMiddleware, (req, res) => {
  res.json({
    message: "Welcome to your dashboard!",
    user: req.user
  });
});

// Endpoint to update the user's plan (simulate an upgrade after payment)
router.post('/change-plan', authMiddleware, async (req, res) => {
  try {
    const { plan } = req.body; // plan: "basic", "standard", or "pro"
    
    if (!['basic', 'standard', 'pro'].includes(plan)) {
      return res.status(400).json({ error: 'Invalid plan' });
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { plan },
      { new: true }
    );
    
    res.json({ message: `Plan updated to ${plan}`, user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
