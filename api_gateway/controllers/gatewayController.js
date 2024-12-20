const { createProxyMiddleware } = require('http-proxy-middleware');

// Define your service endpoints and their respective targets
const apiGatewayController = (app) => {
    // Proxy all requests to the respective services
    app.use('/api/auth', createProxyMiddleware({
        target: 'http://auth_service:5001',
        changeOrigin: true,
        pathRewrite: { '^/api/auth': '/api/auth' }
    }));

    app.use('/api/products', createProxyMiddleware({
        target: 'http://product_service:5002',
        changeOrigin: true,
        pathRewrite: { '^/api/products': '/api/products' }
    }));

    app.use('/api/orders', createProxyMiddleware({
        target: 'http://order_service:5003',
        changeOrigin: true,
        pathRewrite: { '^/api/orders': '/api/orders' }
    }));

    app.use('/api/notifications', createProxyMiddleware({
        target: 'http://notification_service:5004',
        changeOrigin: true,
        pathRewrite: { '^/api/notifications': '/api/notifications' }
    }));

    app.use('/api', (req, res) => {
        res.status(404).json({ message: 'API Gateway: Endpoint not found' });
    });
};

module.exports = apiGatewayController;
