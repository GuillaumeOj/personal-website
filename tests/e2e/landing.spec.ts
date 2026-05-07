import { expect, test } from '@playwright/test';

test('FR landing renders main sections', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Guillaume Ojardias/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Guillaume',
  );
  await expect(
    page.getByRole('heading', { name: 'Me contacter' }),
  ).toBeVisible();
  await expect(page.getByRole('link', { name: /Lire le blog/ })).toBeVisible();
});

test('EN landing renders main sections', async ({ page }) => {
  await page.goto('/en/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(
    page.getByRole('heading', { name: 'Get in touch' }),
  ).toBeVisible();
});

test('FR blog list page renders', async ({ page }) => {
  await page.goto('/blog/');
  await expect(
    page.getByRole('heading', { name: 'Blog', level: 1 }),
  ).toBeVisible();
});
