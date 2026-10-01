import { expect, test } from "@playwright/test";

test("theme menu sets light / dark / system and persists", async ({ page }) => {
  await page.goto("/");
  const html = page.locator("html");

  await expect(html).toHaveAttribute("data-theme-mode", "system");

  const trigger = page.getByRole("button", { name: "Changer le thème" });

  await trigger.click();
  await page.getByRole("button", { name: "Clair" }).click();
  await expect(html).toHaveAttribute("data-theme-mode", "light");
  await expect(html).not.toHaveClass(/(^|\s)dark(\s|$)/);

  await trigger.click();
  await page.getByRole("button", { name: "Sombre" }).click();
  await expect(html).toHaveAttribute("data-theme-mode", "dark");
  await expect(html).toHaveClass(/(^|\s)dark(\s|$)/);

  await page.reload();
  await expect(html).toHaveAttribute("data-theme-mode", "dark");
  await expect(html).toHaveClass(/(^|\s)dark(\s|$)/);

  await trigger.click();
  await page.getByRole("button", { name: "Système" }).click();
  await expect(html).toHaveAttribute("data-theme-mode", "system");
});

// Audit U9: disclosure pattern, not an ARIA menu without menu keyboard support.
test("switchers are disclosures: no menu roles, Escape returns focus", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator('[role="menu"], [role="menuitem"]')).toHaveCount(0);

  const trigger = page.getByRole("button", { name: "Changer le thème" });
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  const light = page.getByRole("button", { name: "Clair" });
  await light.focus();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");

  await trigger.click();
  await light.click();
  // The panel closes on choice: read the (now hidden) buttons by attribute.
  const option = (mode: string) =>
    page.locator(`[data-header] [data-theme-option="${mode}"]`).first();
  await expect(option("light")).toHaveAttribute("aria-pressed", "true");
  await expect(option("dark")).toHaveAttribute("aria-pressed", "false");
});

test("tabbing out of a switcher closes it", async ({ page }) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Changer de langue" });
  await trigger.click();
  const current = page.getByRole("link", { name: "Français" });
  await expect(current).toHaveAttribute("aria-current", "true");
  await current.focus();
  await page.keyboard.press("Tab"); // English
  await page.keyboard.press("Tab"); // out of the dropdown
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
});
