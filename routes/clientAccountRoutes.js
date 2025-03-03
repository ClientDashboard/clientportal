const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ClientUser = require('../models/ClientUser'); // Fixed path
const ClientFolder = require('../models/ClientFolder'); // Fixed path

// Endpoint: Register a client account
router.post('/register', async (req, res) => {
  try {
    const { folderSlug, email, password } = req.body;

    if (!folderSlug || !email || !password) {
      return res.status(400).json({ error: 'folderSlug, email, and password are required' });
    }

    // Find the client folder by its slug
    const folder = await ClientFolder.findOne({ slug: folderSlug });
    if (!folder) {
      return res.status(404).json({ error: 'Client folder not found' });
    }

    // Check if a client account with this email already exists
    const existingClient = await ClientUser.findOne({ email });
    if (existingClient) {
      return res.status(400).json({ error: 'Email already registered for a client account' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the client account linked to the folder
    const clientUser = await ClientUser.create({
      email,
      password: hashedPassword,
      folder: folder._id
    });

    res.status(201).json({ message: 'Client account created successfully', clientUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint: Client login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const clientUser = await ClientUser.findOne({ email });

    if (!clientUser) {
      return res.status(404).json({ error: 'Client not found' });
    }

    const isMatch = await bcrypt.compare(password, clientUser.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate a JWT token for the client account
    const token = jwt.sign(
      { id: clientUser._id, email: clientUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ message: 'Client login successful', token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
