import { expect, test } from "@playwright/test";

// T6 — the above-the-fold post cover is a meaningful image, not decorative: its
// alt text equals the post title (helps image search + a11y).
for (const [path, title] of [
  ["/blog/pourquoi-astro/", "Pourquoi Astro pour ce blog"],
  ["/en/blog/why-astro/", "Why Astro for this blog"],
] as const) {
  test(`blog (${path}): hero cover img has alt equal to the title`, async ({
    page,
  }) => {
    await page.goto(path);
    const cover = page.locator("article img").first();
    await expect(cover).toHaveAttribute("alt", title);
  });
}

// T3 — every article ends on a conversion block: a primary CTA to the home
// contact anchor and a secondary link to the services page (internal links that
// also help SEO), plus the visible author name reinforcing the author Person.
for (const path of ["/blog/pourquoi-astro/", "/en/blog/why-astro/"]) {
  test(`blog (${path}): article foot links to #contact and /services`, async ({
    page,
  }) => {
    await page.goto(path);
    const foot = page.locator("article footer");
    await expect(foot).toBeVisible();

    const contact = foot.locator('a[href$="#contact"]');
    await expect(contact).toBeVisible();

    const services = foot.locator('a[href$="/services"]');
    await expect(services).toBeVisible();

    // The author card names the person behind the BlogPosting author.
    await expect(foot).toContainText("Guillaume Ojardias");
  });
}
