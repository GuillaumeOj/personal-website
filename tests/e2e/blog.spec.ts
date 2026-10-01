import { expect, test } from "@playwright/test";

// T6 — the above-the-fold post cover is a meaningful image, not decorative: its
// alt text equals the post title (helps image search + a11y). Read the title off
// the page rather than hardcoding it, so the assertion survives a copy edit and
// still holds if a post ever sets an explicit `coverAlt`.
for (const path of [
  "/blog/mon-parcours-qui-je-suis/",
  "/en/blog/my-journey-who-i-am/",
]) {
  test(`blog (${path}): hero cover img has alt equal to the title`, async ({
    page,
  }) => {
    await page.goto(path);
    const title = (await page.locator("article h1").textContent())?.trim();
    expect(title).toBeTruthy();
    const cover = page.locator("article img").first();
    await expect(cover).toHaveAttribute("alt", title as string);
  });
}

// Covers are Unsplash stock, not the site's own work: each hero carries a
// visible credit linking the photographer and the photo, with the referral
// params Unsplash's attribution guidelines ask for.
for (const [path, by] of [
  ["/blog/mon-parcours-qui-je-suis/", "Photo\u00a0:"],
  ["/en/blog/my-journey-who-i-am/", "Photo by"],
]) {
  test(`blog (${path}): hero cover credits its Unsplash photographer`, async ({
    page,
  }) => {
    await page.goto(path);
    const caption = page.locator("article figure figcaption").first();
    await expect(caption).toContainText(by);
    const links = caption.locator("a");
    await expect(links).toHaveCount(2);
    await expect(links.nth(0)).toHaveAttribute(
      "href",
      /^https:\/\/unsplash\.com\/@[^?]+\?utm_source=guillaume_ojardias&utm_medium=referral$/,
    );
    await expect(links.nth(1)).toHaveAttribute(
      "href",
      /^https:\/\/unsplash\.com\/photos\/[^?]+\?utm_source=guillaume_ojardias&utm_medium=referral$/,
    );
  });
}

// T3 — every article ends on a conversion block: a primary CTA to the home
// contact page and a secondary link to the services page (internal links that
// also help SEO), plus the visible author name reinforcing the author Person.
for (const path of [
  "/blog/mon-parcours-qui-je-suis/",
  "/en/blog/my-journey-who-i-am/",
]) {
  test(`blog (${path}): article foot links to /contact and /services`, async ({
    page,
  }) => {
    await page.goto(path);
    const foot = page.locator("article footer");
    await expect(foot).toBeVisible();

    const contact = foot.locator('a[href$="/contact/"]');
    await expect(contact).toBeVisible();

    const services = foot.locator('a[href$="/services"]');
    await expect(services).toBeVisible();

    // The author card names the person behind the BlogPosting author.
    await expect(foot).toContainText("Guillaume Ojardias");
  });
}
