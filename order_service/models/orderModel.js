const { Pool } = require('pg');
require('dotenv').config();

// Initialize the database pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Test database connection
(async () => {
  try {
    const client = await pool.connect();
    console.log('Connected to the database successfully!');
    client.release();
  } catch (err) {
    console.error('Database connection error:', err.message);
  }
})();

// Utility function to query the database
const query = async (text, params) => {
  try {
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (err) {
    console.error('Query error', { text, params, message: err.message });
    throw err;
  }
};

// Close the database pool on shutdown
const gracefulShutdown = () => {
  console.log('Shutting down database pool...');
  pool.end(() => {
    console.log('Database pool has been closed.');
  });
};

// Catch termination signals
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

module.exports = { query };
