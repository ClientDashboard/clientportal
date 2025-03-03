const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware'); // Fixed path
const planLimits = require('../config/planLimits'); // Fixed path
const ClientFolder = require('../models/ClientFolder'); // Fixed path
const Usage = require('../models/Usage'); // Fixed path
const slugify = require('slugify');

router.post('/create', authMiddleware, async (req, res) => {
  try {
    const { folderName } = req.body;
    if (!folderName) {
      return res.status(400).json({ error: 'Folder name is required' });
    }

    const userPlan = req.user.plan; // e.g. "basic"
    const maxClients = planLimits[userPlan].maxClients;

    // Find or create a usage record for the user
    let usage = await Usage.findOne({ user: req.user.id });
    if (!usage) {
      usage = await Usage.create({ user: req.user.id, clientCount: 0 });
    }

    // Check if user has reached limit
    if (usage.clientCount >= maxClients) {
      return res.status(403).json({ error: 'Client creation limit reached. Please upgrade your plan.' });
    }

    // Create the folder
    const slug = slugify(folderName, { lower: true }) + '-' + Date.now();
    const newFolder = await ClientFolder.create({
      folderName,
      slug,
      owner: req.user.id,
    });

    // Increment clientCount
    usage.clientCount += 1;
    await usage.save();

    res.status(201).json({ message: 'Client folder created', folder: newFolder });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// other routes...

module.exports = router;

