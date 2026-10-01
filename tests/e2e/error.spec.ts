import { expect, test } from "@playwright/test";

// One 404.html serves both locales: French by default, English swapped in by
// script for /en/… URLs (audit U7).

test("FR 404 page renders the witty lead", async ({ page }) => {
  const response = await page.goto("/this-page-does-not-exist/");
  expect(response?.status()).toBe(404);
  await expect(page.locator("html")).toHaveAttribute("lang", "fr");
  await expect(page).toHaveTitle("Page introuvable — Guillaume Ojardias");
  await expect(page.getByText("Cette page a pris un café")).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Retour à l’accueil" }),
  ).toBeVisible();
});

test("EN 404 page is English throughout", async ({ page }) => {
  const response = await page.goto("/en/this-page-does-not-exist/");
  expect(response?.status()).toBe(404);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page).toHaveTitle("Page not found — Guillaume Ojardias");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    /[A-Za-z]/,
  );
  await expect(page.getByText("This page took a coffee break")).toBeVisible();
  await expect(page.getByRole("link", { name: "Back to home" })).toBeVisible();
  // No French chrome left behind.
  await expect(page.getByText("Prestations")).toHaveCount(0);
  await expect(page.locator("[data-home-link]")).toHaveAttribute(
    "href",
    "/en/",
  );
});

for (const [path, services, contact] of [
  ["/this-page-does-not-exist/", "/services/", "/contact/"],
  ["/en/this-page-does-not-exist/", "/en/services/", "/en/contact/"],
]) {
  test(`404 (${path}): one h1, links to services and contact`, async ({
    page,
  }) => {
    await page.goto(path);
    await expect(page.locator("h1")).toHaveCount(1);
    const tags = await page
      .locator("main h1, main h2")
      .evaluateAll((els) => els.map((el) => el.tagName));
    expect(tags.indexOf("H1")).toBeLessThan(tags.indexOf("H2"));
    await expect(page.locator(`main a[href="${services}"]`)).toBeVisible();
    await expect(page.locator(`main a[href="${contact}"]`)).toBeVisible();
  });
}

test("404 has no canonical, is noindex, and links no /en/404/", async ({
  page,
}) => {
  await page.goto("/this-page-does-not-exist/");
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  await expect(page.locator('meta[property="og:url"]')).toHaveCount(0);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/,
  );
  await expect(page.locator('a[href*="404"]')).toHaveCount(0);
});

test("404 numeral doesn't wobble under reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/this-page-does-not-exist/");
  const animation = await page
    .locator("main p[aria-hidden='true']")
    .first()
    .evaluate((el) => getComputedStyle(el).animationName);
  expect(animation).toBe("none");
});
