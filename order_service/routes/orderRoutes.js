const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authenticateJWT = require('../middleware/authMiddleware');

// Route to place a new order
// POST /api/orders
router.post('/', authenticateJWT, async (req, res, next) => {
  try {
    await orderController.placeOrder(req, res);
  } catch (error) {
    next(error); // Pass errors to the centralized error handler
  }
});

// Route to view a specific order by its ID
// GET /api/orders/:order_id
router.get('/:order_id', authenticateJWT, async (req, res, next) => {
  try {
    await orderController.getOrder(req, res);
  } catch (error) {
    next(error); // Pass errors to the centralized error handler
  }
});

// Optional: Route to get all orders (e.g., admin view or user's orders)
// GET /api/orders
router.get('/', authenticateJWT, async (req, res, next) => {
  try {
    await orderController.getAllOrders(req, res); // Ensure this method exists in your controller
  } catch (error) {
    next(error); // Pass errors to the centralized error handler
  }
});

module.exports = router;
