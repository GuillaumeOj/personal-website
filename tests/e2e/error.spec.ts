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

// T9 — the visible locale block has a single top-level h1 (the lead), and it
// precedes the "recent articles" h2, so the heading outline isn't broken.
for (const path of [
  "/this-page-does-not-exist/",
  "/en/this-page-does-not-exist/",
]) {
  test(`404 (${path}): visible block has one h1, before its h2`, async ({
    page,
  }) => {
    await page.goto(path);
    const block = page.locator(".locale-block:not(.hidden)");
    await expect(block.locator("h1")).toHaveCount(1);
    // Within the visible block, the h1 precedes the h2 in document order.
    const tags = await block
      .locator("h1, h2")
      .evaluateAll((els) => els.map((el) => el.tagName));
    expect(tags.filter((tag) => tag === "H1").length).toBe(1);
    expect(tags.indexOf("H1")).toBeLessThan(tags.indexOf("H2"));
  });
}
