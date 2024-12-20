const request = require('supertest');
const app = require('../app');  // Import the app for the product service

describe('Product Service', () => {

  describe('POST /api/products', () => {
    it('should create a new product', async () => {
      const product = {
        title: 'Sample Product',
        description: 'A great product',
        price: 99.99,
        stock_quantity: 10,
        image_url: 'https://example.com/product.jpg',
        category: 'Electronics',
        seller_id: 1
      };

      const res = await request(app)
        .post('/api/products')
        .send(product);

      // Assert that the response status is 201 (Created)
      expect(res.status).toBe(201);

      // Assert that the product is returned in the response
      expect(res.body.product).toHaveProperty('title', 'Sample Product');
    });
  });

  describe('GET /api/products', () => {
    it('should retrieve all products', async () => {
      const res = await request(app)
        .get('/api/products');

      // Assert that the response status is 200 (OK)
      expect(res.status).toBe(200);

      // Assert that the products are returned in the response
      expect(res.body).toBeInstanceOf(Array);
    });
  });

});
