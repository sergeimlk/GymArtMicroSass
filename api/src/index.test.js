const request = require('supertest');
const app = require('./index');

describe('API Endpoints', () => {
  describe('GET /', () => {
    it('should return API information', async () => {
      const response = await request(app).get('/').expect(200);

      expect(response.body).toHaveProperty('name', 'GymArt API');
      expect(response.body).toHaveProperty('status', 'running');
      expect(response.body).toHaveProperty('endpoints');
    });
  });

  describe('GET /api/test', () => {
    it('should return success status', async () => {
      const response = await request(app).get('/api/test').expect(200);

      expect(response.body).toHaveProperty('status', 'success');
      expect(response.body).toHaveProperty(
        'message',
        'API is working correctly'
      );
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/api/health');

      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('database');

      // Status should be either 'ok' or 'error'
      expect(['ok', 'error']).toContain(response.body.status);
    });
  });

  describe('GET /nonexistent', () => {
    it('should return 404 for unknown endpoints', async () => {
      const response = await request(app).get('/nonexistent').expect(404);

      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message', 'Endpoint not found');
    });
  });
});
