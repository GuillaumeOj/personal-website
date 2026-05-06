import { expect, test } from '@playwright/test';

test('theme toggle cycles through system / light / dark and persists', async ({
  page,
}) => {
  await page.goto('/');
  const html = page.locator('html');

  await expect(html).toHaveAttribute('data-theme-mode', 'system');

  const toggle = page.getByRole('button', { name: 'Changer le thème' });

  await toggle.click();
  await expect(html).toHaveAttribute('data-theme-mode', 'light');
  await expect(html).not.toHaveClass(/(^|\s)dark(\s|$)/);

  await toggle.click();
  await expect(html).toHaveAttribute('data-theme-mode', 'dark');
  await expect(html).toHaveClass(/(^|\s)dark(\s|$)/);

  await page.reload();
  await expect(html).toHaveAttribute('data-theme-mode', 'dark');
  await expect(html).toHaveClass(/(^|\s)dark(\s|$)/);

  await toggle.click();
  await expect(html).toHaveAttribute('data-theme-mode', 'system');
});
