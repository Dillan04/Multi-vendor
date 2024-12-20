const request = require('supertest');
const app = require('../app');  // Import the app (entry point of the service)

describe('Authentication Service', () => {

  describe('POST /api/auth/register', () => {
    it('should register a new user and return a token', async () => {
      const user = {
        email: 'testuser@example.com',
        password: 'password123',
        role: 'buyer',
      };

      const res = await request(app)
        .post('/api/auth/register')
        .send(user);

      // Assert that the response status is 201 (Created)
      expect(res.status).toBe(201);

      // Assert that the response contains the token and refresh token
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('refreshToken');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should log in the user and return a token', async () => {
      const user = {
        email: 'testuser@example.com',
        password: 'password123',
      };

      const res = await request(app)
        .post('/api/auth/login')
        .send(user);

      // Assert that the response status is 200 (OK)
      expect(res.status).toBe(200);

      // Assert that the response contains the token
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('refreshToken');
    });
  });

  describe('POST /api/auth/refresh-token', () => {
    it('should refresh the access token', async () => {
      const refreshToken = 'valid-refresh-token';  // You'd need to use an actual valid refresh token

      const res = await request(app)
        .post('/api/auth/refresh-token')
        .send({ refresh_token: refreshToken });

      // Assert that the response status is 200 (OK)
      expect(res.status).toBe(200);

      // Assert that the response contains the new access token
      expect(res.body).toHaveProperty('accessToken');
    });
  });

});
