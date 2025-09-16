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
    endpoints: ['/api/test', '/api/health']
  });
});

app.get('/api/test', (req, res) => {
  res.json({
    ok: true,
    message: 'API is working correctly!',
    timestamp: new Date().toISOString(),
    endpoint: '/api/test'
  });
});

app.get('/api/health', async (req, res) => {
  const startTime = Date.now();
  
  try {
    // Test database connection
    const result = await pool.query('SELECT NOW() as current_time, version() as db_version');
    const responseTime = Date.now() - startTime;
    
    // Insert health check record
    await pool.query(
      'INSERT INTO health_checks (status, response_time_ms, endpoint, details) VALUES ($1, $2, $3, $4)',
      ['ok', responseTime, '/api/health', JSON.stringify({ 
        database_connected: true,
        db_time: result.rows[0].current_time,
        response_time_ms: responseTime
      })]
    );

    res.json({
      ok: true,
      status: 'healthy',
      message: 'API and database are working correctly!',
      timestamp: new Date().toISOString(),
      endpoint: '/api/health',
      database: {
        connected: true,
        response_time_ms: responseTime,
        current_time: result.rows[0].current_time
      }
    });
  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    // Try to log error to database if possible
    try {
      await pool.query(
        'INSERT INTO health_checks (status, response_time_ms, endpoint, details) VALUES ($1, $2, $3, $4)',
        ['error', responseTime, '/api/health', JSON.stringify({ 
          database_connected: false,
          error: error.message,
          response_time_ms: responseTime
        })]
      );
    } catch (logError) {
      console.error('Failed to log health check error:', logError.message);
    }

    res.status(500).json({
      ok: false,
      status: 'unhealthy',
      message: 'Database connection failed',
      timestamp: new Date().toISOString(),
      endpoint: '/api/health',
      error: error.message,
      database: {
        connected: false,
        response_time_ms: responseTime
      }
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 API available at http://localhost:${PORT}`);
});
