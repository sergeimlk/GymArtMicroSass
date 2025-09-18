const request = require('supertest');
const app = require('./index');

describe('API Endpoints', () => {
  describe('GET /', () => {
    it('should return API information', async () => {
      const response = await request(app).get('/').expect(200);

      expect(response.body).toHaveProperty('name', 'GymArt API');
      expect(response.body).toHaveProperty('version', '1.0.0');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('endpoints');
    });
  });

  describe('GET /api/test', () => {
    it('should return success status', async () => {
      const response = await request(app).get('/api/test').expect(200);

      expect(response.body).toHaveProperty('ok', true);
      expect(response.body).toHaveProperty(
        'message',
        'API is working correctly!'
      );
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('endpoint', '/api/test');
    });
  });

  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/api/health');

      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('message');

      // Status should be either 'ok' or 'error'
      expect(['ok', 'error']).toContain(response.body.status);
    });
  });

  describe('GET /nonexistent', () => {
    it('should return 404 for unknown endpoints', async () => {
      const response = await request(app).get('/nonexistent').expect(404);

      expect(response.body).toHaveProperty('error', 'Route non trouvée');
      expect(response.body).toHaveProperty('path', '/nonexistent');
      expect(response.body).toHaveProperty('timestamp');
    });
  });
});
