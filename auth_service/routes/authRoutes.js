const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Register route
router.post('/register', authController.registerUser);

// Login route
router.post('/login', authController.loginUser);

// Refresh token route
router.post('/refresh-token', authController.refreshToken);

// Get all users (example for an admin endpoint)
router.get('/users', authController.getAllUsers);

// Get user by ID
router.get('/users/:id', authController.getUserById);

module.exports = router;
