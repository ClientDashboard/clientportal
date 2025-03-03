const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware'); // Fixed path
const ClientUser = require('../models/ClientUser'); // Fixed path

// Protected client dashboard route
router.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    // Find the client user by their ID (from token) and populate the associated folder
    const clientUser = await ClientUser.findById(req.user.id).populate('folder');
    if (!clientUser) {
      return res.status(404).json({ error: 'Client not found' });
    }
    res.json({
      message: "Welcome to your client dashboard!",
      folder: clientUser.folder
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
