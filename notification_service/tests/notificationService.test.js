const request = require('supertest');
const app = require('../app');  // Import the app for the notification service

describe('Notification Service', () => {

  describe('POST /api/notifications/send-notification', () => {
    it('should send a notification', async () => {
      const notification = {
        user_id: 1,
        message: 'Your order #123 has been placed!',
        notification_type: 'email'
      };

      const res = await request(app)
        .post('/api/notifications/send-notification')
        .send(notification);

      // Assert that the response status is 200 (OK)
      expect(res.status).toBe(200);

      // Assert that the notification response has an ID
      expect(res.body).toHaveProperty('notification_id');
    });
  });

});
