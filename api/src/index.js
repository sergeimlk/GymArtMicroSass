const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// PostgreSQL connection
const dbConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl:
        process.env.NODE_ENV === 'production'
          ? { rejectUnauthorized: false }
          : false,
    }
  : {
      host: process.env.DB_HOST || process.env.POSTGRES_HOST || 'localhost',
      port: process.env.DB_PORT || process.env.POSTGRES_PORT || 5433,
      database: process.env.DB_NAME || process.env.POSTGRES_DB || 'gymart',
      user: process.env.DB_USER || process.env.POSTGRES_USER || 'postgres',
      password:
        process.env.DB_PASSWORD || process.env.POSTGRES_PASSWORD || 'postgres',
      ssl:
        process.env.NODE_ENV === 'production'
          ? { rejectUnauthorized: false }
          : false,
    };

// Debug database configuration (sans le password)
console.log('🔍 Database config:', {
  host: dbConfig.host,
  port: dbConfig.port,
  database: dbConfig.database,
  user: dbConfig.user,
  ssl: dbConfig.ssl,
  hasPassword: !!dbConfig.password,
});

const pool = new Pool(dbConfig);

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Error connecting to PostgreSQL:', err.message);
  } else {
    console.log('✅ Connected to PostgreSQL database');
    release();
  }
});

// Security middleware - MUST be first
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ['self'],
        styleSrc: ['self', 'unsafe-inline'],
        scriptSrc: ['self'],
        imgSrc: ['self', 'data:', 'https:'],
      },
    },
    crossOriginEmbedderPolicy: false, // Pour compatibilité développement
  })
);

// Rate limiting - Protection contre les attaques par déni de service
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 1000, // Limite par IP
  message: {
    error: 'Trop de requêtes depuis cette IP, réessayez dans 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// CORS strict - Seulement les origines autorisées
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:3000', 'http://localhost:3001'];

app.use(
  cors({
    origin: function (origin, callback) {
      // Permettre les requêtes sans origin (mobile apps, etc.)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Non autorisé par la politique CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Logging sécurisé
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '10mb' })); // Limite la taille des requêtes

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

// Middleware de gestion d'erreurs sécurisé
app.use((err, req, res, _next) => {
  console.error('❌ Error:', err.message);

  // Ne pas exposer les détails d'erreur en production
  if (process.env.NODE_ENV === 'production') {
    res.status(500).json({
      error: 'Erreur interne du serveur',
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(500).json({
      error: err.message,
      stack: err.stack,
      timestamp: new Date().toISOString(),
    });
  }
});

// Middleware pour routes non trouvées
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route non trouvée',
    path: req.originalUrl,
    timestamp: new Date().toISOString(),
  });
});

// Start server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 API available at http://localhost:${PORT}`);
    console.log('🛡️ Security: Helmet, CORS, Rate limiting enabled');
    console.log(`🔒 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

module.exports = app;
