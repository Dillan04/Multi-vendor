const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors()); // Enable CORS
app.use(morgan('dev')); // Log HTTP requests
app.use(express.json()); // Parse JSON requests

// Environment Variables for Microservice URLs
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:5001';
const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:5002';
const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || 'http://localhost:5003';
const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:5004';

// Proxy Setup for Microservices
app.use(
  '/auth',
  createProxyMiddleware({
    target: AUTH_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { '^/auth': '' }, // Strip '/auth' from the forwarded path
  })
);

app.use(
  '/products',
  createProxyMiddleware({
    target: PRODUCT_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { '^/products': '' }, // Strip '/products' from the forwarded path
  })
);

app.use(
  '/orders',
  createProxyMiddleware({
    target: ORDER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { '^/orders': '' }, // Strip '/orders' from the forwarded path
  })
);

app.use(
  '/notifications',
  createProxyMiddleware({
    target: NOTIFICATION_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { '^/notifications': '' }, // Strip '/notifications' from the forwarded path
  })
);

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ message: 'API Gateway is running.' });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start the Gateway
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
