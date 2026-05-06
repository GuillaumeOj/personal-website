import { expect, test } from '@playwright/test';

test('clicking the language switch goes from FR to EN and back', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr');

  await page.getByRole('link', { name: 'Switch to English' }).click();
  await expect(page).toHaveURL(/\/en\/?$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');

  await page.getByRole('link', { name: 'Passer en français' }).click();
  await expect(page).toHaveURL(/^[^?#]*\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
});

test('language switch preserves the blog list page', async ({ page }) => {
  await page.goto('/blog/');
  await page.getByRole('link', { name: 'Switch to English' }).click();
  await expect(page).toHaveURL(/\/en\/blog\/?$/);
});
