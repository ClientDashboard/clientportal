// routes/usageRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const Usage = require('../models/Usage');

// GET /api/usage
// Retrieves usage data for the logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const usage = await Usage.findOne({ user: req.user.id });
    if (!usage) {
      return res.status(404).json({ error: 'Usage data not found' });
    }
    res.json({ usage });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
