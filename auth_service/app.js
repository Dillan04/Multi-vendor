const express = require('express');
const { Pool } = require('pg');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();

const app = express();

// PostgreSQL database connection using environment variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || `postgres://postgres:${process.env.DB_PASSWORD}@localhost:5432/auth_service_db`,
});

pool.connect()
  .then(() => console.log('Connected to the database'))
  .catch((err) => console.error('Database connection error', err));

// Simple health check route
app.get('/healthcheck', async (req, res) => {
  try {
    // Perform a simple query to check if the database is connected
    const result = await pool.query('SELECT NOW()');
    res.status(200).json({
      status: 'ok',
      time: result.rows[0].now,
    });
  } catch (err) {
    console.error('Error connecting to database:', err);
    res.status(500).json({ status: 'error', message: 'Database connection failed' });
  }
});

// Middleware to parse JSON requests (express built-in parser)
app.use(express.json());

// Use the authentication routes
app.use('/api/auth', authRoutes);

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Authentication service running on port ${PORT}`);
}).on('error', (err) => {
  console.error('Error starting the server:', err);
});
