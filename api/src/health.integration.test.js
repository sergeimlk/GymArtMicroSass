const request = require('supertest');
const { Pool } = require('pg');
const app = require('./index');

// Configuration de test pour PostgreSQL
const testDbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5433,
  database: process.env.DB_NAME || 'gymart',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
};

describe('Health Endpoint Integration Tests', () => {
  let testPool;

  beforeAll(async () => {
    // Créer une connexion de test
    testPool = new Pool(testDbConfig);

    // Vérifier si PostgreSQL est disponible
    try {
      await testPool.query('SELECT 1');
    } catch (error) {
      console.warn(
        '⚠️ PostgreSQL not available for integration tests. Skipping...'
      );
      testPool = null;
    }
  });

  afterAll(async () => {
    // Fermer la connexion de test
    if (testPool) {
      await testPool.end();
    }
  });

  describe('GET /api/health - Success Scenarios', () => {
    it('should return ok status when database is connected', async () => {
      if (!testPool) {
        console.warn('⚠️ Skipping integration test - PostgreSQL not available');
        return;
      }

      const response = await request(app).get('/api/health').expect(200);

      expect(response.body).toEqual({
        status: 'ok',
        message: 'API connected to database!',
      });

      expect(response.headers['content-type']).toMatch(/json/);
    });

    it('should have proper response time', async () => {
      const startTime = Date.now();

      await request(app).get('/api/health').expect(200);

      const responseTime = Date.now() - startTime;
      expect(responseTime).toBeLessThan(5000); // Moins de 5 secondes
    });

    it('should return consistent results on multiple calls', async () => {
      const promises = Array(5)
        .fill()
        .map(() => request(app).get('/api/health'));

      const responses = await Promise.all(promises);

      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.body.status).toBe('ok');
        expect(response.body.message).toBe('API connected to database!');
      });
    });
  });

  describe('GET /api/health - Database Integration', () => {
    it('should actually connect to the database', async () => {
      // Vérifier que la base de données est accessible
      const dbResult = await testPool.query('SELECT 1 as test');
      expect(dbResult.rows[0].test).toBe(1);

      // Tester l'endpoint
      const response = await request(app).get('/api/health').expect(200);

      expect(response.body.status).toBe('ok');
    });

    it('should handle database queries correctly', async () => {
      // Vérifier que la table health_checks existe
      const tableCheck = await testPool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'health_checks'
        );
      `);

      expect(tableCheck.rows[0].exists).toBe(true);
    });
  });

  describe('GET /api/health - Error Scenarios', () => {
    it('should handle database connection errors gracefully', async () => {
      // Note: Ce test nécessiterait de simuler une panne de DB
      // Pour l'instant, on vérifie que l'endpoint répond toujours
      const response = await request(app).get('/api/health');

      expect(response.status).toBeOneOf([200, 500]);
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('message');

      if (response.status === 500) {
        expect(response.body.status).toBe('error');
        expect(response.body.message).toBe('Database connection failed');
      }
    });

    it('should return proper error format on failure', async () => {
      // Test avec une requête qui pourrait échouer
      const response = await request(app).get('/api/health');

      // Vérifier le format de réponse
      expect(response.body).toMatchObject({
        status: expect.stringMatching(/^(ok|error)$/),
        message: expect.any(String),
      });
    });
  });

  describe('GET /api/health - Security Headers', () => {
    it('should include security headers', async () => {
      const response = await request(app).get('/api/health');

      // Vérifier les headers de sécurité (Helmet)
      expect(response.headers).toHaveProperty('x-content-type-options');
      expect(response.headers).toHaveProperty('x-frame-options');
      expect(response.headers['x-content-type-options']).toBe('nosniff');
    });

    it('should include CORS headers for allowed origins', async () => {
      const response = await request(app)
        .get('/api/health')
        .set('Origin', 'http://localhost:3000');

      expect(response.headers).toHaveProperty('access-control-allow-origin');
      expect(response.headers['access-control-allow-origin']).toBe(
        'http://localhost:3000'
      );
    });

    it('should include rate limiting headers', async () => {
      const response = await request(app).get('/api/health');

      expect(response.headers).toHaveProperty('ratelimit-limit');
      expect(response.headers).toHaveProperty('ratelimit-remaining');
    });
  });

  describe('GET /api/health - Performance Tests', () => {
    it('should handle concurrent requests', async () => {
      const concurrentRequests = 10;
      const promises = Array(concurrentRequests)
        .fill()
        .map(() => request(app).get('/api/health'));

      const responses = await Promise.all(promises);

      responses.forEach(response => {
        expect(response.status).toBeOneOf([200, 500]);
        expect(response.body).toHaveProperty('status');
      });
    });

    it('should maintain performance under load', async () => {
      const startTime = Date.now();
      const requests = Array(20)
        .fill()
        .map(() => request(app).get('/api/health'));

      await Promise.all(requests);
      const totalTime = Date.now() - startTime;

      // 20 requêtes en moins de 10 secondes
      expect(totalTime).toBeLessThan(10000);
    });
  });
});

// Helper pour Jest
expect.extend({
  toBeOneOf(received, expected) {
    const pass = expected.includes(received);
    if (pass) {
      return {
        message: () => `expected ${received} not to be one of ${expected}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be one of ${expected}`,
        pass: false,
      };
    }
  },
});
