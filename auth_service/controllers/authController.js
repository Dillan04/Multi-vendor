const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const redis = require('redis');
const authModel = require('../models/authModel');

// Redis client for managing refresh tokens
const redisClient = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST || 'localhost',  // Ensure Redis is accessible
    port: process.env.REDIS_PORT || 6379,
  },
});

// redisClient.connect().catch((err) => {
//   console.error('Redis connection error:', err);
// });

// Register user
const registerUser = async (req, res) => {
  const { email, password, roles } = req.body;

  if (!email || !password || !roles) {
    return res.status(400).json({ error: 'Email, password, and role are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await authModel.createUser(email, hashedPassword, roles);
    if (user.error == undefined) {
      return res.status(201).json({ user });
    } else {
      return res.status(500).json({ error : user['error'] });
    }
  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const user = await authModel.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign({ user_id: user.user_id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ user_id: user.user_id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

    // Store refresh token in Redis
    await redisClient.set(user.user_id, refreshToken, 'EX', 60 * 60 * 24 * 7); // Expires in 7 days

    return res.status(200).json({ token, refreshToken });
  } catch (error) {
    console.error('Error logging in user:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await authModel.getAllUsers(); // Fetch all users from the database
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({ message: 'Error fetching users' });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await authModel.getUserById(id); // Fetch user by ID from the database
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error.message);
    res.status(500).json({ message: 'Error fetching user' });
  }
};

// Refresh token
const refreshToken = async (req, res) => {
  const { refresh_token } = req.body;

  if (!refresh_token) {
    return res.status(400).json({ error: 'Refresh token is required' });
  }

  try {
    // Verify the refresh token
    const decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET);
    
    // Get user using the user_id from the decoded token
    const user = await authModel.getUserById(decoded.user_id);

    if (!user) {
      return res.status(403).json({ error: 'User not found' });
    }

    // Generate new access token
    const newToken = jwt.sign({ user_id: user.user_id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.status(200).json({ token: newToken });
  } catch (error) {
    console.error('Error refreshing token:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

// Middleware to validate JWT token
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Get token from Authorization header

  if (!token) {
    return res.status(401).json({ error: 'Access denied, no token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    req.user = user;
    next();
  });
};

module.exports = {
  registerUser,
  loginUser,
  refreshToken,
  getAllUsers,
  getUserById,
  authenticateToken, // Export middleware for use in routes
};
