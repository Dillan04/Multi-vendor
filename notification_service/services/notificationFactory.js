const emailService = require('./emailService');

const notificationFactory = {
  email: async (data) => {
    const { to, subject, message } = data;
    await emailService.sendEmail(to, subject, message);
  },
  sms: async () => {
    // Placeholder for SMS functionality
    console.log('SMS notifications not implemented yet.');
  },
  push: async () => {
    // Placeholder for push notifications
    console.log('Push notifications not implemented yet.');
  },
};

const sendNotification = async (type, data) => {
  if (!notificationFactory[type]) {
    throw new Error(`Notification type ${type} is not supported`);
  }
  await notificationFactory[type](data);
};

module.exports = { sendNotification };
