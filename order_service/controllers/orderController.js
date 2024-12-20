const pool = require('../models/orderModel');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

// Place an order
exports.placeOrder = async (req, res) => {
  const { user_id, product_id, total_price } = req.body;

  // Generate a unique order ID
  const order_id = uuidv4();

  try {
    // Insert the order into the database
    const result = await pool.query(
      'INSERT INTO Orders (order_id, user_id, product_id, order_status, total_price) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [order_id, user_id, product_id, 'Pending', total_price]
    );

    // Update the product inventory (decrement stock_quantity by 1)
    await pool.query(
      'UPDATE Products SET stock_quantity = stock_quantity - 1 WHERE product_id = $1',
      [product_id]
    );

    res.status(201).json({ message: 'Order placed successfully', order: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error placing order' });
  }
};

// Get an order by ID
exports.getOrder = async (req, res) => {
  const { order_id } = req.params;

  try {
    const result = await pool.query('SELECT * FROM Orders WHERE order_id = $1', [order_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching order' });
  }
};
