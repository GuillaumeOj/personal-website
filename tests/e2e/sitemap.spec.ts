import {
  type APIRequestContext,
  expect,
  type Page,
  test,
} from "@playwright/test";
import { readPostFiles } from "../../src/lib/post-files";
import { SAMPLE_ARTICLE } from "./helpers";

const sitemapHref = (page: Page) =>
  page.locator('head link[rel="sitemap"]').getAttribute("href");

/** The child sitemap(s) the index points at, concatenated. */
async function childSitemaps(request: APIRequestContext): Promise<string> {
  const index = await request.get("/sitemap-index.xml");
  expect(index.ok()).toBe(true);
  // The chunk filename (`sitemap-0.xml`) is an entryLimit implementation detail.
  const children = [...(await index.text()).matchAll(/<loc>([^<]+)<\/loc>/g)];
  expect(children.length).toBeGreaterThan(0);
  const xml = await Promise.all(
    children.map(async ([, url]) => {
      const res = await request.get(new URL(url).pathname);
      expect(res.ok()).toBe(true);
      return res.text();
    }),
  );
  return xml.join("\n");
}

// T5 / audit E8 — <lastmod> only where a real date exists: a post's
// updatedDate or pubDate, and the newest post's date for the blog indexes.
test("sitemap emits <lastmod>, with the pubDate on a known blog URL", async ({
  request,
}) => {
  const xml = await childSitemaps(request);

  // At least one URL carries a lastmod.
  expect(xml).toContain("<lastmod>");

  // A known post carries its own date (read from the post file, as the config
  // does), not the build date.
  const post = readPostFiles().find(
    (p) => `/blog/${p.slug}/` === SAMPLE_ARTICLE.fr,
  );
  expect(post, "sample article on disk").toBeTruthy();
  const date = (post?.updatedDate ?? post?.pubDate)?.toISOString();
  const match = xml.match(
    new RegExp(
      `<loc>[^<]*${SAMPLE_ARTICLE.fr}</loc><lastmod>([^<]+)</lastmod>`,
    ),
  );
  expect(match, "sample article url with a lastmod").toBeTruthy();
  expect((match as RegExpMatchArray)[1]).toBe(date);
});

test("sitemap: no build-time lastmod on static pages", async ({ request }) => {
  const xml = await childSitemaps(request);
  // The home and services pages have no content date: no <lastmod> at all.
  for (const path of ["/", "/services/"]) {
    const entry = xml.match(
      new RegExp(
        `<url><loc>https?://[^/<]+${path.replace(/\//g, "\\/")}</loc>(.*?)</url>`,
      ),
    );
    expect(entry, path).toBeTruthy();
    expect((entry as RegExpMatchArray)[1]).not.toContain("<lastmod>");
  }
  // The blog index carries its newest post's date (not the build time).
  const blog = xml.match(/<loc>[^<]*\/blog\/<\/loc><lastmod>([^<]+)</);
  expect(blog).toBeTruthy();
  const postDates = [
    ...xml.matchAll(/<loc>[^<]*\/blog\/[^/<]+\/<\/loc><lastmod>([^<]+)</g),
  ].map((m) => m[1]);
  expect((blog as RegExpMatchArray)[1]).toBe(postDates.sort().at(-1));
});

// T1 — the on-page sitemap hint points at a file the build actually emits
// (sitemap-index.xml), not at /sitemap.xml, which only exists as a Vercel
// rewrite.
for (const path of [
  "/",
  "/en/",
  "/about/",
  "/services/",
  "/blog/",
  "/contact/",
  "/contact/quote/",
]) {
  test(`sitemap hint on ${path} points at the real index`, async ({ page }) => {
    await page.goto(path);
    expect(await sitemapHref(page)).toBe("/sitemap-index.xml");
  });
}

// `/sitemap.xml` is a Vercel rewrite to the index, which `astro preview`
// doesn't serve: `tests/unit/vercel-config.test.ts` guards that rewrite.
test("the advertised sitemap index resolves", async ({ request }) => {
  const index = await request.get("/sitemap-index.xml");
  expect(index.status()).toBe(200);
});

test("robots.txt advertises only the sitemap index", async ({ request }) => {
  const res = await request.get("/robots.txt");
  expect(res.ok()).toBe(true);
  const body = await res.text();
  expect(body).toContain("sitemap-index.xml");
  // Only the index is advertised, never a child sitemap.
  expect(body.match(/^Sitemap:/gm)?.length).toBe(1);
});

// Audit S9: a security.txt (RFC 9116) tells researchers where to report.
test("security.txt is served with a contact and a future expiry", async ({
  request,
}) => {
  const res = await request.get("/.well-known/security.txt");
  expect(res.ok()).toBe(true);
  const text = await res.text();
  expect(text).toMatch(/^Contact: mailto:\S+@\S+$/m);
  const expires = /^Expires: (.+)$/m.exec(text)?.[1];
  expect(new Date(expires ?? "").getTime()).toBeGreaterThan(Date.now());
});

// Audit E-min: sitemap hreflang codes match the HTML (fr / en).
test("sitemap alternates use the same hreflang codes as the pages", async ({
  request,
}) => {
  const xml = await childSitemaps(request);
  expect(xml).toContain('hreflang="fr"');
  expect(xml).toContain('hreflang="en"');
  expect(xml).not.toContain('hreflang="fr-FR"');
});
