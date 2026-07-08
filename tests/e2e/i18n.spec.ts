import { expect, test } from '@playwright/test';

test('language menu goes from FR to EN and back', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr');

  await page.getByRole('button', { name: 'Changer de langue' }).click();
  await page.getByRole('menuitem', { name: 'English' }).click();
  await expect(page).toHaveURL(/\/en\/?$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');

  await page.getByRole('button', { name: 'Change language' }).click();
  await page.getByRole('menuitem', { name: 'Français' }).click();
  await expect(page).toHaveURL(/^[^?#]*\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
});

test('language menu preserves the blog list page', async ({ page }) => {
  await page.goto('/blog/');
  await page.getByRole('button', { name: 'Changer de langue' }).click();
  await page.getByRole('menuitem', { name: 'English' }).click();
  await expect(page).toHaveURL(/\/en\/blog\/?$/);
});
