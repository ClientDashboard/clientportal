const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware'); // Fixed path

router.get('/dashboard', authMiddleware, (req, res) => {
  res.json({
    message: "Welcome to your dashboard!",
    user: req.user
  });
});

module.exports = router;
