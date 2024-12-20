const { Client } = require('pg');
require('dotenv').config();

// Database connection using environment variables
const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

client.connect()
  .then(() => console.log('Connected to PostgreSQL database'))
  .catch((err) => console.error('Connection error', err.stack));

module.exports = client;
