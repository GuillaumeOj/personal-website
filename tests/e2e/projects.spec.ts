import { expect, test } from "@playwright/test";

// Project detail and projects-list conversion + image-SEO guards. Every path at
// peak intent must offer a same-site route to contact/services (not only
// outbound links), and the client-facing screenshots must carry real alt text.

// T2 — the project detail page ends with a same-site CTA band (contact +
// services), so a visitor at peak intent isn't only offered outbound links.
for (const path of ["/projects/fusily/", "/en/projects/fusily/"]) {
  const isFr = !path.startsWith("/en");
  test(`project detail (${path}): closing CTA links back on-site`, async ({
    page,
  }) => {
    await page.goto(path);
    const article = page.locator("article");
    // A same-site anchor to the home contact section.
    const contact = article.locator('a[href$="#contact"]');
    await expect(contact.first()).toBeVisible();
    // …and a link to the services page.
    const servicesHref = isFr ? "/services" : "/en/services";
    await expect(article.locator(`a[href="${servicesHref}"]`)).toHaveCount(1);
  });
}

// T4 — the highest-intent project screenshots (hero + grid cards) carry
// descriptive, localized alt text rather than being marked decorative.
test("project detail: hero image has a non-empty alt with the project name", async ({
  page,
}) => {
  await page.goto("/projects/fusily/");
  const alt = await page.locator("article img").first().getAttribute("alt");
  expect(alt).toBeTruthy();
  expect(alt).toContain("Fusily");
});

test("projects list: every card image has non-empty alt text", async ({
  page,
}) => {
  await page.goto("/projects/");
  const imgs = page.locator("a[data-platform] img");
  const count = await imgs.count();
  expect(count).toBeGreaterThan(0);
  for (let i = 0; i < count; i++) {
    const alt = await imgs.nth(i).getAttribute("alt");
    expect(alt?.trim()).toBeTruthy();
  }
});

// T5 — the projects list closes with a CTA back to contact, beneath the grid.
for (const path of ["/projects/", "/en/projects/"]) {
  test(`projects list (${path}): closing CTA links to contact`, async ({
    page,
  }) => {
    await page.goto(path);
    const cta = page.locator('main a[href$="#contact"]');
    await expect(cta.first()).toBeVisible();
  });
}
