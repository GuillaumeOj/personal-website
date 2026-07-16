import { expect, type Page, test } from "@playwright/test";

const sitemapHref = (page: Page) =>
  page.locator('head link[rel="sitemap"]').getAttribute("href");

// T5 — the sitemap ships a <lastmod> freshness signal on every URL: the
// article's pubDate for blog posts, the build date for everything else.
test("sitemap emits <lastmod>, with the pubDate on a known blog URL", async ({
  request,
}) => {
  // The index points at the child sitemap; fetch the child directly.
  const index = await request.get("/sitemap-index.xml");
  expect(index.ok()).toBe(true);
  expect(await index.text()).toContain("sitemap-0.xml");

  const res = await request.get("/sitemap-0.xml");
  expect(res.ok()).toBe(true);
  const xml = await res.text();

  // At least one URL carries a lastmod.
  expect(xml).toContain("<lastmod>");

  // The known FR post "pourquoi-astro" (pubDate 2026-04-15) carries that date.
  const match = xml.match(
    /<loc>[^<]*\/blog\/pourquoi-astro\/<\/loc><lastmod>([^<]+)<\/lastmod>/,
  );
  expect(match, "pourquoi-astro url with a lastmod").toBeTruthy();
  expect((match as RegExpMatchArray)[1]).toContain("2026-04-15");
});

// T1 — the on-page sitemap hint points at a file that actually exists. The
// build emits sitemap-index.xml (+ sitemap-0.xml), never /sitemap.xml, so the
// old href advertised a dead location. Assert the hint resolves and no page
// advertises the 404 path.
for (const path of ["/", "/en/", "/about/", "/services/", "/blog/"]) {
  test(`sitemap hint on ${path} points at the real index`, async ({ page }) => {
    await page.goto(path);
    expect(await sitemapHref(page)).toBe("/sitemap-index.xml");
  });
}

test("the advertised sitemap index resolves, and /sitemap.xml is a 404", async ({
  request,
}) => {
  const index = await request.get("/sitemap-index.xml");
  expect(index.status()).toBe(200);

  const dead = await request.get("/sitemap.xml");
  expect(dead.status()).toBe(404);
});

test("robots.txt advertises only the sitemap index", async ({ request }) => {
  const res = await request.get("/robots.txt");
  expect(res.ok()).toBe(true);
  const body = await res.text();
  expect(body).toContain("sitemap-index.xml");
  // The redundant child-sitemap Sitemap: line is gone — only the index is
  // advertised.
  expect(body).not.toContain("sitemap-0.xml");
});
