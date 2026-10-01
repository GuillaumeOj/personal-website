import { expect, test } from "@playwright/test";

test("language menu goes from FR to EN and back", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "fr");

  await page.getByRole("button", { name: "Changer de langue" }).click();
  await page.getByRole("menuitem", { name: "English" }).click();
  await expect(page).toHaveURL(/\/en\/?$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");

  await page.getByRole("button", { name: "Change language" }).click();
  await page.getByRole("menuitem", { name: "Français" }).click();
  await expect(page).toHaveURL(/^[^?#]*\/$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "fr");
});

test("language menu preserves the blog list page", async ({ page }) => {
  await page.goto("/blog/");
  await page.getByRole("button", { name: "Changer de langue" }).click();
  await page.getByRole("menuitem", { name: "English" }).click();
  await expect(page).toHaveURL(/\/en\/blog\/?$/);
});

// Audit U4: the switchers sit in the header, so they're reachable without
// scrolling, and in the mobile menu.
test("language switcher keeps the query string and hash", async ({ page }) => {
  await page.goto("/contact/quote/?type=mobile#contact-message");
  await page.getByRole("button", { name: "Changer de langue" }).click();
  await page.getByRole("menuitem", { name: "English" }).click();
  await expect(page).toHaveURL(
    /\/en\/contact\/quote\/\?type=mobile#contact-message$/,
  );
});

test("switchers are in the header and the mobile menu", async ({ page }) => {
  await page.goto("/");
  const header = page.locator("[data-header]");
  await expect(
    header.getByRole("button", { name: "Changer de langue" }),
  ).toBeInViewport();
  await expect(
    header.getByRole("button", { name: "Changer le thème" }),
  ).toBeInViewport();

  await page.setViewportSize({ width: 390, height: 844 });
  await header.getByRole("button", { name: "Menu" }).click();
  const panel = page.locator("[data-menu-panel]");
  await expect(
    panel.getByRole("button", { name: "Changer de langue" }),
  ).toBeVisible();
  await expect(
    panel.getByRole("button", { name: "Changer le thème" }),
  ).toBeVisible();
});
