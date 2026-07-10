import { expect, test } from "@playwright/test";

test("theme menu sets light / dark / system and persists", async ({ page }) => {
  await page.goto("/");
  const html = page.locator("html");

  await expect(html).toHaveAttribute("data-theme-mode", "system");

  const trigger = page.getByRole("button", { name: "Changer le thème" });

  await trigger.click();
  await page.getByRole("menuitem", { name: "Clair" }).click();
  await expect(html).toHaveAttribute("data-theme-mode", "light");
  await expect(html).not.toHaveClass(/(^|\s)dark(\s|$)/);

  await trigger.click();
  await page.getByRole("menuitem", { name: "Sombre" }).click();
  await expect(html).toHaveAttribute("data-theme-mode", "dark");
  await expect(html).toHaveClass(/(^|\s)dark(\s|$)/);

  await page.reload();
  await expect(html).toHaveAttribute("data-theme-mode", "dark");
  await expect(html).toHaveClass(/(^|\s)dark(\s|$)/);

  await trigger.click();
  await page.getByRole("menuitem", { name: "Système" }).click();
  await expect(html).toHaveAttribute("data-theme-mode", "system");
});
