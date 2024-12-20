const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const orderRoutes = require('./routes/orderRoutes');
require('dotenv').config();

const app = express();

// PostgreSQL database connection
const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'postgres', // Use Docker service name or fallback to localhost
    database: process.env.DB_NAME || 'order_service_db',
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
});

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Simple health check route
app.get('/healthcheck', async (req, res) => {
    try {
        // Perform a simple query to validate the database connection
        const result = await pool.query('SELECT NOW()');
        res.status(200).json({
            status: 'ok',
            time: result.rows[0].now,
        });
    } catch (err) {
        console.error('Error connecting to database:', err.message);
        res.status(500).json({
            status: 'error',
            message: 'Database connection failed',
            error: err.message,
        });
    }
});

// Order routes
app.use('/api/orders', orderRoutes);

// Global error handler middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err.message);
    res.status(err.status || 500).json({
        status: 'error',
        message: err.message || 'Internal server error',
    });
});

// Start the server
const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
    console.log(`Order service running on port ${PORT}`);
});
