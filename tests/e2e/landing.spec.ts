import { expect, test } from '@playwright/test';

test('FR landing renders main sections', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Guillaume Ojardias/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'applications web et mobiles',
  );
  await expect(
    page.getByRole('heading', { name: 'Ce que je peux construire pour vous' }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Parlons de votre projet' }),
  ).toBeVisible();
});

test('EN landing renders main sections', async ({ page }) => {
  await page.goto('/en/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'web & mobile apps',
  );
  await expect(
    page.getByRole('heading', { name: 'Let’s talk about your project' }),
  ).toBeVisible();
});

test('FR blog list page renders', async ({ page }) => {
  await page.goto('/blog/');
  await expect(
    page.getByRole('heading', { name: 'Blog', level: 1 }),
  ).toBeVisible();
});

test('projects can be filtered by platform', async ({ page }) => {
  await page.goto('/projects/');

  const fusily = page.getByRole('link', { name: 'Fusily' });
  const personalSite = page.getByRole('link', { name: 'Site personnel' });
  await expect(fusily).toBeVisible();
  await expect(personalSite).toBeVisible();

  await page.getByRole('button', { name: 'Mobile' }).click();
  await expect(fusily).toBeVisible();
  await expect(personalSite).toBeHidden();

  await page.getByRole('button', { name: 'Tous' }).click();
  await expect(personalSite).toBeVisible();
});
