const { Pool } = require('pg');
require('dotenv').config();

// Use a connection pool for better performance and connection management
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false, // SSL configuration for production
});

// Function to create a user
const createUser = async (email, password, roles) => {
  const query = `
    INSERT INTO Users (email, password_hash, roles)
    VALUES ($1, $2, $3) RETURNING *;
  `;
  try {
    const result = await pool.query(query, [email, password, roles]);
    return result.rows[0];
  } catch (error) {
    return {'error':error.toString()}
  }
};

// Function to get user by email
const getUserByEmail = async (email) => {
  const query = `SELECT * FROM auth_service.Users WHERE email = $1`;
  try {
    const result = await pool.query(query, [email]);
    return result.rows[0];
  } catch (error) {
    console.error('Error fetching user by email:', error);
    throw new Error('Database operation failed');
  }
};

// Get all users
const getAllUsers = async () => {
  const query = `SELECT * FROM auth_service.Users`;
  const result = await client.query(query);
  return result.rows;
};

// Get user by ID
const getUserById = async (id) => {
  const query = `SELECT * FROM auth_service.Users WHERE user_id = $1`;
  const result = await client.query(query, [id]);
  return result.rows[0];
};

module.exports = { 
  createUser, 
  getUserByEmail, 
  getAllUsers, 
  getUserById 
};


module.exports = { createUser, getUserByEmail };
