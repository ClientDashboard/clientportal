// app.js
require('dotenv').config();
console.log('JWT_SECRET from .env:', process.env.JWT_SECRET);
const express = require('express');
const morgan = require('morgan');
const connectDB = require('./config/database');

const app = express(); // Initialize app before using it

// Serve static files from the 'public' folder
app.use(express.static('public'));

// Connect to MongoDB
connectDB();

// Use Morgan for HTTP request logging
app.use(morgan('dev'));

// Middleware to parse JSON bodies
app.use(express.json());

// Auth routes
const authRoutes = require('./dashboard/routes/authRoutes');
app.use('/api/auth', authRoutes);

// Protected user routes
const userRoutes = require('./dashboard/routes/userRoutes');
app.use('/api/user', userRoutes);

// Admin routes
const adminRoutes = require('./dashboard/routes/adminRoutes');
app.use('/api/admin', adminRoutes);

// File management routes
const fileRoutes = require('./dashboard/routes/fileRoutes');
app.use('/api/files', fileRoutes);

// Client folder routes (for creating & sharing client portals)
const clientFolderRoutes = require('./dashboard/routes/clientFolderRoutes');
app.use('/api/client-folders', clientFolderRoutes);

// Client account routes (for clients to register and access a folder)
const clientAccountRoutes = require('./dashboard/routes/clientAccountRoutes');
app.use('/api/client-accounts', clientAccountRoutes);

// Client dashboard routes (for clients to view their portal)
const clientDashboardRoutes = require('./dashboard/routes/clientDashboardRoutes');
app.use('/api/client-dashboard', clientDashboardRoutes);

// Usage routes (to view usage data)
const usageRoutes = require('./dashboard/routes/usageRoutes');
app.use('/api/usage', usageRoutes);

// 🔹 Serve the landing page (landingpage/index.html) as the default homepage
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/landingpage/index.html');
});

// 🔹 Optional: Redirect old index.html to the landing page
app.get('/index.html', (req, res) => {
  res.redirect('/');
});

// Centralized error handling middleware
const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);

// Use port from .env or default to 3000
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

// Graceful shutdown: Close server on SIGINT (Ctrl+C)
process.on('SIGINT', () => {
  console.log('Received SIGINT. Shutting down gracefully.');
  server.close(() => {
    console.log('Closed out remaining connections.');
    process.exit(0);
  });
});
