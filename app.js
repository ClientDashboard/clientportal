// app.js

require('dotenv').config();

// Check required environment variables
if (!process.env.JWT_SECRET) {
  console.error("❌ ERROR: Missing JWT_SECRET in .env file!");
  process.exit(1);
}

if (!process.env.MONGO_URI) {
  console.error("❌ ERROR: Missing MONGO_URI in .env file!");
  process.exit(1);
}

console.log('✅ JWT_SECRET from .env:', process.env.JWT_SECRET);

const express = require('express');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./config/database');

const app = express();

// Connect MongoDB
connectDB();

// Middlewares
app.use(morgan('dev'));
app.use(express.json());

// Serve static files
app.use('/landingpage/assets', express.static(path.join(__dirname, 'public/landingpage/assets')));
app.use('/dashboard/assets', express.static(path.join(__dirname, 'public/dashboard/assets')));

// Main page routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/landingpage/index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/landingpage/login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/landingpage/register.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/dashboard/dashboard.html'));
});

// Load API routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const fileRoutes = require('./routes/fileRoutes');
const clientFolderRoutes = require('./routes/clientFolderRoutes');
const clientAccountRoutes = require('./routes/clientAccountRoutes');
const clientDashboardRoutes = require('./routes/clientDashboardRoutes');
const usageRoutes = require('./routes/usageRoutes');
const protectedRoutes = require('./routes/protectedRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/client-folders', clientFolderRoutes);
app.use('/api/client-accounts', clientAccountRoutes);
app.use('/api/client-dashboard', clientDashboardRoutes);
app.use('/api/usage', usageRoutes);
app.use('/api/protected', protectedRoutes);

// Handle 404 errors
app.use('*', (req, res) => {
  res.status(404).send('404 - Page Not Found');
});

// Error handling middleware
const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);

// Start server with dynamic port (supports DigitalOcean & local development)
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Handle process errors to prevent crashes
process.on('SIGINT', () => {
  console.log('Received SIGINT. Shutting down server...');
  server.close(() => {
    console.log('All connections closed.');
    process.exit(0);
  });
});

process.on('uncaughtException', (err) => {
  console.error('🔥 Uncaught Exception! Server shutting down...', err);
  process.exit(1);
});
