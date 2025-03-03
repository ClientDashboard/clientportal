// routes/clientFolderRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const planLimits = require('../config/planLimits');
const ClientFolder = require('../models/ClientFolder');
const Usage = require('../models/Usage'); // Ensure this is imported

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
    const slugify = require('slugify');
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
