const pool = require('../models/notificationModel');
const { sendNotification } = require('../services/notificationFactory');

exports.sendNotification = async (req, res) => {
  const { user_id, message, notification_type, email } = req.body;

  // Validate input
  if (!user_id || !message || !notification_type || !email) {
    return res.status(400).json({
      success: false,
      message: 'All fields (user_id, message, notification_type, email) are required.',
    });
  }

  try {
    // Send the notification
    await sendNotification(notification_type, {
      to: email,
      subject: 'Notification from MultiVendor',
      message,
    });

    // Save the notification in the database
    const result = await pool.query(
      'INSERT INTO Notifications (user_id, message, notification_type, email) VALUES ($1, $2, $3, $4) RETURNING *',
      [user_id, message, notification_type, email]
    );

    res.status(201).json({
      success: true,
      message: 'Notification sent and saved successfully',
      notification: result.rows[0],
    });
  } catch (err) {
    console.error('Error sending notification:', err);
    res.status(500).json({
      success: false,
      message: 'An error occurred while sending the notification.',
    });
  }
};

// Get all notifications
exports.getNotifications = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Notifications ORDER BY created_at DESC');

    res.status(200).json({
      success: true,
      notifications: result.rows,
    });
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching notifications.',
    });
  }
};

// Get notification by ID
exports.getNotificationById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('SELECT * FROM Notifications WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
    }

    res.status(200).json({
      success: true,
      notification: result.rows[0],
    });
  } catch (err) {
    console.error('Error fetching notification by ID:', err);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching the notification.',
    });
  }
};
