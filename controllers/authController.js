// controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usage = require('../models/Usage'); // If you're creating usage docs upon registration

exports.register = async (req, res) => {
  try {
    const { email, password, plan, companyName } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Determine the selected plan; if not provided or invalid, default to "basic"
    const validPlans = ['basic', 'standard', 'pro'];
    const selectedPlan = (plan && validPlans.includes(plan)) ? plan : 'basic';

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Set the free trial expiration (15 days from now)
    const trialExpiresAt = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);

    // Generate a unique client URL if a company name is provided
    let clientUrl = "";
    if (companyName) {
      const slugify = require('slugify');
      clientUrl = slugify(companyName, { lower: true }) + '-' + Date.now();
    }

    // Create the new user
    const newUser = await User.create({
      email,
      password: hashedPassword,
      plan: selectedPlan,
      trialExpiresAt,
      companyName,
      clientUrl
    });

    // (Optional) Create a usage record for this user if you're tracking usage
    await Usage.create({
      user: newUser._id,
      filesCount: 0,
      storageUsed: 0
      // tasksCount, formsCreated, etc. if needed
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: newUser
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create a JWT payload (include role, plan, etc. if needed)
    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
      plan: user.plan
    };

    // Sign the token
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({
      message: 'Login successful',
      token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
