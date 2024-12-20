const express = require('express');
const bodyParser = require('body-parser');
const productRoutes = require('./routes/productRoutes');
const app = express();

app.use(bodyParser.json());
app.use('/api', productRoutes);

// Middleware
app.use(express.json());

// Routes
app.use("/", productRoutes);

// Default route
app.get("/", (req, res) => {
    res.send("Product Service is running...");
});

// Error Handling Middleware
app.use((req, res) => {
    res.status(404).send("Route not found");
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Product service running on port ${PORT}`));

const { Pool } = require('pg');

// Create a new Pool instance for PostgreSQL connection
const pool = new Pool({
    user: 'postgres',
    host: 'postgres', 
    database: 'product_service_db',
    password: 'FOOJOI1997',
    port: 5432,
});

// Simple health check
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.log('Error connecting to the database:', err);
        process.exit(1); // Exit the process with failure code
    } else {
        console.log('Database connected successfully:', res.rows[0]);
    }
});