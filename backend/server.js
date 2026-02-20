const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
});

// Connect to MongoDB - FIXED VERSION
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Atlas Connected Successfully!');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

connectDB();

// Import models
require('./models/User');
require('./models/Accommodation');
require('./models/Reservation');

// Import routes
const authRoutes = require('./routes/auth');
const accommodationRoutes = require('./routes/accommodations');
const userRoutes = require('./routes/users');
const reservationRoutes = require('./routes/reservations');

// Routes
app.get('/', (req, res) => {
  res.json({
    message: '🏠 Airbnb Backend API is running!',
    version: '1.0.0',
    status: 'active',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        profile: 'GET /api/auth/me',
        logout: 'POST /api/auth/logout'
      },
      accommodations: {
        getAll: 'GET /api/accommodations',
        getOne: 'GET /api/accommodations/:id',
        create: 'POST /api/accommodations',
        update: 'PUT /api/accommodations/:id',
        delete: 'DELETE /api/accommodations/:id'
      },
      users: {
        getAll: 'GET /api/users',
        getOne: 'GET /api/users/:id',
        update: 'PUT /api/users/:id',
        delete: 'DELETE /api/users/:id'
      },
      reservations: {
        getAll: 'GET /api/reservations',
        getOne: 'GET /api/reservations/:id',
        create: 'POST /api/reservations',
        update: 'PUT /api/reservations/:id',
        delete: 'DELETE /api/reservations/:id'
      }
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    nodeVersion: process.version
  });
});

// API Test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    message: 'API is working!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/accommodations', accommodationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reservations', reservationRoutes);

// Demo endpoint
app.get('/api/demo', (req, res) => {
  res.json({
    success: true,
    message: 'Demo endpoint for testing',
    testUsers: [
      {
        email: 'admin@airbnb.com',
        password: 'admin123',
        role: 'admin'
      },
      {
        email: 'host@airbnb.com',
        password: 'host123',
        role: 'host'
      },
      {
        email: 'user@airbnb.com',
        password: 'user123',
        role: 'user'
      }
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    requestedUrl: req.originalUrl
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
  ============================================
  🚀 Airbnb Backend Server Started!
  ============================================
  🌐 Local: http://localhost:${PORT}
  📊 Health: http://localhost:${PORT}/api/health
  🧪 Test: http://localhost:${PORT}/api/test
  📍 Demo: http://localhost:${PORT}/api/demo
  🗄️  MongoDB: ${mongoose.connection.readyState === 1 ? '✅ Connected' : '❌ Disconnected'}
  ============================================
  Press Ctrl+C to stop the server
  ============================================
  `);
});