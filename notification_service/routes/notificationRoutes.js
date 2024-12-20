const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// POST /api/notifications/send-notification
router.post('/api/notifications/send-notification', (req, res) => {
    const { message, email } = req.body;

    console.log(`Notification sent to ${email}: ${message}`);
    res.status(200).json({
        success: true,
        message: 'Notification sent successfully!',
    });
});

router.get('/api/notifications', notificationController.getNotifications);

module.exports = router;
