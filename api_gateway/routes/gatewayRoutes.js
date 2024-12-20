const express = require('express');
const router = express.Router();

router.use('/orders', require('../order_service/routes/orderRoutes'));
router.use('/products', require('../product_service/routes/productRoutes'));
router.use('/auth', require('../auth_service/routes/authRoutes'));
router.use('/notifications', require('../notification_service/routes/notificationRoutes'));

module.exports = router;
