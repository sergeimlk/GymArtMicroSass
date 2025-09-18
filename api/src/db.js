const { Pool } = require('pg');

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'gymart',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

// Create connection pool
const pool = new Pool(dbConfig);

// Handle pool errors
pool.on('error', err => {
  console.error('Unexpected error on idle client:', err);
});

/**
 * Test database connectivity
 * @returns {Promise<{connected: boolean, message: string, details?: any}>}
 */
async function ping() {
  try {
    console.log('Testing database connection...');

    const client = await pool.connect();
    const result = await client.query('SELECT 1 as ping, NOW() as timestamp');
    client.release();

    const response = {
      connected: true,
      message: 'Database connection successful',
      details: {
        host: dbConfig.host,
        port: dbConfig.port,
        database: dbConfig.database,
        timestamp: result.rows[0].timestamp,
      },
    };

    console.log('✅ Database ping successful');
    return response;
  } catch (error) {
    const response = {
      connected: false,
      message: 'Database connection failed',
      details: {
        error: error.message,
        code: error.code,
        host: dbConfig.host,
        port: dbConfig.port,
        database: dbConfig.database,
      },
    };

    console.error('❌ Database ping failed:', error.message);
    return response;
  }
}

/**
 * Get a client from the pool
 * @returns {Promise<PoolClient>}
 */
async function getClient() {
  return await pool.connect();
}

/**
 * Execute a query
 * @param {string} text - SQL query
 * @param {Array} params - Query parameters
 * @returns {Promise<QueryResult>}
 */
async function query(text, params) {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}

/**
 * Close all connections
 */
async function close() {
  await pool.end();
  console.log('Database pool closed');
}

module.exports = {
  ping,
  getClient,
  query,
  close,
  pool,
};
