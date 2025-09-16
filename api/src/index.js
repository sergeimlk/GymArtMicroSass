require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/api/test', (req, res) => {
  res.json({
    status: 'success',
    message: 'API is working correctly',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Health endpoint with database connectivity check
app.get('/api/health', async (req, res) => {
  try {
    const dbStatus = await db.ping();

    const healthResponse = {
      status: dbStatus.connected ? 'ok' : 'error',
      message: dbStatus.connected ? 'Service is healthy' : 'Service has issues',
      timestamp: new Date().toISOString(),
      database: dbStatus,
    };

    const statusCode = dbStatus.connected ? 200 : 500;
    res.status(statusCode).json(healthResponse);
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Health check failed',
      timestamp: new Date().toISOString(),
      database: {
        connected: false,
        message: 'Health check error',
        details: {
          error: error.message,
        },
      },
    });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'GymArt API',
    version: '0.1.0',
    status: 'running',
    endpoints: {
      test: '/api/test',
      health: '/api/health',
    },
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Endpoint not found',
    path: req.originalUrl,
  });
});

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { error: err.message }),
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await db.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  await db.close();
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 GymArt API server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Test endpoint: http://localhost:${PORT}/api/test`);
  console.log(`💚 Health endpoint: http://localhost:${PORT}/api/health`);
});

module.exports = app;
