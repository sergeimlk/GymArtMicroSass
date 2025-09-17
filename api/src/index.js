const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// PostgreSQL connection
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5433,
  database: process.env.DB_NAME || 'gymart',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Error connecting to PostgreSQL:', err.message);
  } else {
    console.log('✅ Connected to PostgreSQL database');
    release();
  }
});

// Middleware
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({
    name: 'GymArt API',
    version: '1.0.0',
    description: 'Backend API for GymArt application',
    endpoints: ['/api/test', '/api/health'],
  });
});

app.get('/api/test', (req, res) => {
  res.json({
    ok: true,
    message: 'API is working correctly!',
    timestamp: new Date().toISOString(),
    endpoint: '/api/test',
  });
});

app.get('/api/health', async (req, res) => {
  try {
    // Test database connection with SELECT 1 as required
    await pool.query('SELECT 1');

    // Success response - exact format required by brief
    res.json({
      status: 'ok',
      message: 'API connected to database!',
    });
  } catch (error) {
    console.error('Database connection failed:', error.message);

    // Error response - exact format required by brief
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 API available at http://localhost:${PORT}`);
});
