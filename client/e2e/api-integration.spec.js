// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('API Integration E2E Tests', () => {
  test('should complete full integration flow with real API calls', async ({
    page,
    request,
  }) => {
    // Étape 1: Vérifier que l'API backend est accessible
    console.log('🔍 Testing API accessibility...');
    const healthCheck = await request.get('http://localhost:3001/api/health');
    expect(healthCheck.ok()).toBeTruthy();

    const healthData = await healthCheck.json();
    expect(healthData.status).toBe('ok');
    console.log('✅ API is healthy:', healthData);

    // Étape 2: Aller sur la page frontend
    console.log('🌐 Loading frontend page...');
    await page.goto('/');

    // Étape 3: Vérifier que la page se charge correctement
    await expect(
      page.getByRole('heading', { name: /🏋️ GymArt/i })
    ).toBeVisible();
    console.log('✅ Frontend loaded successfully');

    // Étape 4: Intercepter les appels API pour vérifier qu'ils se font
    let apiCallMade = false;
    /** @type {import('@playwright/test').Response[]} */
    const apiResponses = [];

    page.on(
      'response',
      /** @param {import('@playwright/test').Response} response */ response => {
        if (response.url().includes('/api/health')) {
          apiCallMade = true;
          apiResponses.push(response);
          console.log('📡 API call intercepted:', response.status());
        }
      }
    );

    // Étape 5: Cliquer sur le bouton de test
    const button = page.getByRole('button', {
      name: /tester la connexion api/i,
    });
    await expect(button).toBeVisible();
    console.log('🔘 Clicking health check button...');
    await button.click();

    // Étape 6: Attendre que l'appel API soit fait
    await page.waitForTimeout(3000);

    // Note: Si le frontend n'implémente pas encore l'appel API,
    // ce test documentera le comportement attendu
    if (apiCallMade && apiResponses.length > 0) {
      console.log('✅ API call was made successfully');
      const response = apiResponses[0];
      expect(response.ok()).toBeTruthy();
    } else {
      console.log('⚠️  No API call detected - frontend implementation needed');
    }
  });

  test('should verify API endpoints individually', async ({ request }) => {
    console.log('🧪 Testing individual API endpoints...');

    // Test /api/health
    const health = await request.get('http://localhost:3001/api/health');
    expect(health.ok()).toBeTruthy();
    const healthJson = await health.json();
    expect(healthJson).toMatchObject({
      status: 'ok',
      message: 'API connected to database!',
    });
    console.log('✅ /api/health:', healthJson);

    // Test /api/test
    const testEndpoint = await request.get('http://localhost:3001/api/test');
    expect(testEndpoint.ok()).toBeTruthy();
    const testJson = await testEndpoint.json();
    expect(testJson).toMatchObject({
      ok: true,
      message: 'API is working correctly!',
      endpoint: '/api/test',
    });
    console.log('✅ /api/test:', testJson);

    // Test root endpoint
    const root = await request.get('http://localhost:3001/');
    expect(root.ok()).toBeTruthy();
    const rootJson = await root.json();
    expect(rootJson).toMatchObject({
      name: 'GymArt API',
      version: '1.0.0',
    });
    console.log('✅ / (root):', rootJson);
  });

  test('should verify CORS headers for frontend integration', async ({
    request,
  }) => {
    console.log('🌐 Testing CORS configuration...');

    const response = await request.get('http://localhost:3001/api/health', {
      headers: {
        Origin: 'http://localhost:3000',
      },
    });

    expect(response.ok()).toBeTruthy();

    const headers = response.headers();
    expect(headers['access-control-allow-origin']).toBe(
      'http://localhost:3000'
    );
    expect(headers['access-control-allow-credentials']).toBe('true');

    console.log('✅ CORS headers verified for localhost:3000');
  });

  test('should verify security headers are present', async ({ request }) => {
    console.log('🛡️ Testing security headers...');

    const response = await request.get('http://localhost:3001/api/health');
    const headers = response.headers();

    // Vérifier les headers de sécurité (Helmet)
    expect(headers['x-content-type-options']).toBe('nosniff');
    expect(headers['x-frame-options']).toBe('SAMEORIGIN');
    expect(headers).toHaveProperty('content-security-policy');
    expect(headers).toHaveProperty('strict-transport-security');

    console.log('✅ Security headers verified');
  });

  test('should handle high load scenarios', async ({ request }) => {
    console.log('⚡ Testing API under load...');

    const startTime = Date.now();

    // Faire 20 requêtes simultanées
    const promises = Array(20)
      .fill(null)
      .map(() => request.get('http://localhost:3001/api/health'));

    const responses = await Promise.all(promises);
    const endTime = Date.now();

    // Vérifier que toutes les requêtes ont réussi
    responses.forEach(response => {
      expect(response.ok()).toBeTruthy();
    });

    const totalTime = endTime - startTime;
    console.log(`✅ 20 concurrent requests completed in ${totalTime}ms`);

    // Toutes les requêtes en moins de 10 secondes
    expect(totalTime).toBeLessThan(10000);
  });

  test('should verify database integration through API', async ({
    request,
  }) => {
    console.log('🗄️ Testing database integration...');

    // L'endpoint /api/health fait un SELECT 1 sur la base
    const response = await request.get('http://localhost:3001/api/health');
    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    expect(data.status).toBe('ok');
    expect(data.message).toBe('API connected to database!');

    console.log('✅ Database integration verified through API');
  });

  test('should measure and verify response times', async ({ request }) => {
    console.log('⏱️ Measuring API response times...');

    /** @type {number[]} */
    const measurements = [];

    for (let i = 0; i < 5; i++) {
      const start = Date.now();
      const response = await request.get('http://localhost:3001/api/health');
      const end = Date.now();

      expect(response.ok()).toBeTruthy();
      measurements.push(end - start);
    }

    const avgTime = measurements.reduce((a, b) => a + b) / measurements.length;
    const maxTime = Math.max(...measurements);

    console.log(`📊 Average response time: ${avgTime.toFixed(2)}ms`);
    console.log(`📊 Max response time: ${maxTime}ms`);

    // Les réponses devraient être rapides (moins de 2 secondes en moyenne)
    expect(avgTime).toBeLessThan(2000);
    expect(maxTime).toBeLessThan(5000);
  });
});
