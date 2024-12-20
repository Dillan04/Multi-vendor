const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg'); // For PostgreSQL connection
require('dotenv').config();

const app = express();

// PostgreSQL database connection
const pool = new Pool({
    user: 'postgres',
    host: 'postgres', // Docker service name for PostgreSQL
    database: 'notification_service_db', // Database name
    password: process.env.DB_PASSWORD,
    port: 5432,
});

// Health check route
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

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Define the POST route for sending notifications
app.post('/api/notifications/send-notification', (req, res) => {
    const { message, email } = req.body;

    // Simulate sending a notification (here we just log it)
    console.log(`Notification sent to ${email}: ${message}`);

    // Respond with success
    res.status(200).json({
        success: true,
        message: 'Notification sent successfully!',
    });
});

// Start the server
const PORT = process.env.PORT || 5004;
app.listen(PORT, () => {
    console.log(`Notification Service is running on port ${PORT}`);
});
