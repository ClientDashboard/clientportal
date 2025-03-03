// app.js
require('dotenv').config();
console.log('JWT_SECRET from .env:', process.env.JWT_SECRET);

const express = require('express');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./config/database');

const app = express(); // Initialize app before using it

// Connect to MongoDB
connectDB();

// Use Morgan for HTTP request logging
app.use(morgan('dev'));

// Middleware to parse JSON bodies
app.use(express.json());

// ✅ Serve static files correctly
app.use('/landingpage/assets', express.static(path.join(__dirname, 'public/landingpage/assets')));
app.use('/dashboard/assets', express.static(path.join(__dirname, 'public/dashboard/assets')));

// ✅ Fix asset paths for landing page
app.use(express.static(path.join(__dirname, 'public/landingpage')));

// ✅ Serve the landing page as the homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/landingpage/efectivio-home.html'));
});

// ✅ Serve the dashboard page
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/dashboard/dashboard.html'));
});

// ✅ Routes for Dashboard APIs
const authRoutes = require('./public/dashboard/routes/authRoutes');
const userRoutes = require('./public/dashboard/routes/userRoutes');
const adminRoutes = require('./public/dashboard/routes/adminRoutes');
const fileRoutes = require('./public/dashboard/routes/fileRoutes');
const clientFolderRoutes = require('./public/dashboard/routes/clientFolderRoutes');
const clientAccountRoutes = require('./public/dashboard/routes/clientAccountRoutes');
const clientDashboardRoutes = require('./public/dashboard/routes/clientDashboardRoutes');
const usageRoutes = require('./public/dashboard/routes/usageRoutes');
const protectedRoutes = require('./public/dashboard/routes/protectedRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/client-folders', clientFolderRoutes);
app.use('/api/client-accounts', clientAccountRoutes);
app.use('/api/client-dashboard', clientDashboardRoutes);
app.use('/api/usage', usageRoutes);
app.use('/api/protected', protectedRoutes);

// ✅ Centralized error handling middleware
const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);

// ✅ Set up server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

// ✅ Graceful shutdown: Close server on SIGINT (Ctrl+C)
process.on('SIGINT', () => {
  console.log('Received SIGINT. Shutting down gracefully.');
  server.close(() => {
    console.log('Closed out remaining connections.');
    process.exit(0);
  });
});
