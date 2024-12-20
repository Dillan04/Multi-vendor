const request = require('supertest');
const app = require('../app');  // Import the app for the order service

describe('Order Service', () => {

  describe('POST /api/orders', () => {
    it('should create a new order', async () => {
      const order = {
        user_id: 1,
        product_id: 1,
        total_price: 99.99
      };

      const res = await request(app)
        .post('/api/orders')
        .send(order);

      // Assert that the response status is 201 (Created)
      expect(res.status).toBe(201);

      // Assert that the order is returned in the response
      expect(res.body.order).toHaveProperty('order_status', 'Pending');
    });
  });

});
