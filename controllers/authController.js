// controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usage = require('../models/Usage');
const slugify = require('slugify');

if (!process.env.JWT_SECRET) {
  console.error("❌ ERROR: Missing JWT_SECRET in .env file!");
  process.exit(1);
}

// Register a new user
exports.register = async (req, res, next) => {
  try {
    const { email, password, plan, companyName } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Validate selected plan; default to "basic" if invalid
    const validPlans = ['basic', 'standard', 'pro'];
    const selectedPlan = validPlans.includes(plan) ? plan : 'basic';

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Set the free trial expiration (15 days from now)
    const trialExpiresAt = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);

    // Generate a unique client URL if a company name is provided
    let clientUrl = "";
    if (companyName) {
      let slug = slugify(companyName, { lower: true }) + '-' + Date.now();
      let existingUserWithSlug = await User.findOne({ clientUrl: slug });

      // Ensure unique slug
      while (existingUserWithSlug) {
        slug = slugify(companyName, { lower: true }) + '-' + Date.now();
        existingUserWithSlug = await User.findOne({ clientUrl: slug });
      }
      clientUrl = slug;
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

    // Create a usage record for this user (optional)
    await Usage.create({
      user: newUser._id,
      filesCount: 0,
      storageUsed: 0
    });

    // Remove sensitive data before responding
    const { password: _, ...userWithoutPassword } = newUser.toObject();

    res.status(201).json({
      message: 'User registered successfully',
      user: userWithoutPassword
    });
  } catch (error) {
    next(error);
  }
};

// User login
exports.login = async (req, res, next) => {
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

    // Create a JWT payload (include role, plan, etc.)
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
    next(error);
  }
};
