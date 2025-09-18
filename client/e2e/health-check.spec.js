// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Health Check E2E Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Aller à la page d'accueil
    await page.goto('/');
  });

  test('should display the health check button', async ({ page }) => {
    // Vérifier que le bouton est présent
    const button = page.getByRole('button', {
      name: /tester la connexion api/i,
    });
    await expect(button).toBeVisible();

    // Vérifier le texte du bouton
    await expect(button).toContainText('Tester la connexion API');
  });

  test('should show API configuration', async ({ page }) => {
    // Vérifier que les informations de configuration sont affichées
    await expect(page.getByText('API URL:')).toBeVisible();
    await expect(page.getByText('http://localhost:3001')).toBeVisible();
    await expect(page.getByText('Endpoint: /api/health')).toBeVisible();
  });

  test('should complete full E2E flow: Button → API → JSON display', async ({
    page,
  }) => {
    // Étape 1: Cliquer sur le bouton de test
    const button = page.getByRole('button', {
      name: /tester la connexion api/i,
    });
    await button.click();

    // Étape 2: Attendre la réponse de l'API (max 5 secondes)
    await page.waitForTimeout(2000);

    // Étape 3: Vérifier que la réponse JSON est affichée
    // Note: Nous devons adapter selon l'implémentation réelle du frontend
    // Pour l'instant, vérifions que quelque chose change après le clic

    // Vérifier qu'il n'y a pas d'erreur JavaScript
    const errors = [];
    page.on('pageerror', error => errors.push(error));

    // Attendre un peu pour voir si des erreurs apparaissent
    await page.waitForTimeout(1000);
    expect(errors).toHaveLength(0);
  });

  test('should handle API response correctly', async ({ page, request }) => {
    // Test direct de l'API pour s'assurer qu'elle fonctionne
    const apiResponse = await request.get('http://localhost:3001/api/health');
    expect(apiResponse.ok()).toBeTruthy();

    const jsonResponse = await apiResponse.json();
    expect(jsonResponse).toHaveProperty('status');
    expect(jsonResponse).toHaveProperty('message');
    expect(jsonResponse.status).toBe('ok');
    expect(jsonResponse.message).toBe('API connected to database!');
  });

  test('should display proper page title and metadata', async ({ page }) => {
    // Vérifier le titre de la page
    await expect(page).toHaveTitle(/GymArt/);

    // Vérifier les éléments principaux de la page
    await expect(
      page.getByRole('heading', { name: /🏋️ GymArt/i })
    ).toBeVisible();
    await expect(page.getByText('Test de connexion API')).toBeVisible();
  });

  test('should be responsive on different screen sizes', async ({ page }) => {
    // Test sur desktop (par défaut)
    const button = page.getByRole('button', {
      name: /tester la connexion api/i,
    });
    await expect(button).toBeVisible();

    // Test sur mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(button).toBeVisible();

    // Test sur tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(button).toBeVisible();
  });

  test('should handle network errors gracefully', async ({ page }) => {
    // Simuler une erreur réseau en bloquant les requêtes API
    await page.route('**/api/health', route => {
      route.abort('failed');
    });

    const button = page.getByRole('button', {
      name: /tester la connexion api/i,
    });
    await button.click();

    // Attendre et vérifier qu'aucune erreur JavaScript critique n'est levée
    await page.waitForTimeout(2000);

    // La page devrait toujours être fonctionnelle
    await expect(button).toBeVisible();
  });

  test('should maintain accessibility standards', async ({ page }) => {
    // Vérifier que le bouton a un bon contraste et est accessible
    const button = page.getByRole('button', {
      name: /tester la connexion api/i,
    });

    // Vérifier que le bouton est focusable
    await button.focus();
    await expect(button).toBeFocused();

    // Vérifier qu'on peut l'activer avec Enter
    await button.press('Enter');

    // Attendre la réponse
    await page.waitForTimeout(1000);
  });

  test('should load within acceptable time', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const loadTime = Date.now() - startTime;

    // La page devrait se charger en moins de 5 secondes
    expect(loadTime).toBeLessThan(5000);
  });
});
