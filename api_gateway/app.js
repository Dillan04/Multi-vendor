const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

// Forward requests to the Authentication Service
app.use('/api/auth', createProxyMiddleware({
    target: 'http://auth_service:5001', // Service name and port from Docker Compose
    changeOrigin: true,
    pathRewrite: {
        '^/api/auth': '', // Remove '/api/auth' prefix before forwarding
    }
}));

// Forward requests to the Product Service
app.use('/api/products', createProxyMiddleware({
    target: 'http://product_service:5002', // Service name and port from Docker Compose
    changeOrigin: true,
    pathRewrite: {
        '^/api/products': '', // Remove '/api/products' prefix before forwarding
    }
}));

// Forward requests to the Order Service
app.use('/api/orders', createProxyMiddleware({
    target: 'http://order_service:5003', // Service name and port from Docker Compose
    changeOrigin: true,
    pathRewrite: {
        '^/api/orders': '', // Remove '/api/orders' prefix before forwarding
    }
}));

// Forward requests to the Notification Service
app.use('/api/notifications', createProxyMiddleware({
    target: 'http://notification_service:5004', // Service name and port from Docker Compose
    changeOrigin: true,
    pathRewrite: {
        '^/api/notifications': '', // Remove '/api/notifications' prefix before forwarding
    }
}));

// Handle any unmatched routes (404)
app.use((req, res) => {
    res.status(404).json({ message: 'API Gateway: Endpoint not found' });
});

const PORT = 5000; // API Gateway port
app.listen(PORT, () => {
    console.log(`API Gateway is running on port ${PORT}`);
});
