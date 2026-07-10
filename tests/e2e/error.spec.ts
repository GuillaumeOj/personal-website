import { expect, test } from "@playwright/test";

test("FR 404 page renders the witty lead", async ({ page }) => {
  const response = await page.goto("/this-page-does-not-exist/");
  expect(response?.status()).toBe(404);
  await expect(page.locator("html")).toHaveAttribute("lang", "fr");
  await expect(page.getByText("Cette page a pris un café")).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Retour à l’accueil" }),
  ).toBeVisible();
});

test("EN 404 page swaps to the English lead via JS", async ({ page }) => {
  const response = await page.goto("/en/this-page-does-not-exist/");
  expect(response?.status()).toBe(404);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByText("This page took a coffee break")).toBeVisible();
  await expect(page.getByRole("link", { name: "Back to home" })).toBeVisible();
});
