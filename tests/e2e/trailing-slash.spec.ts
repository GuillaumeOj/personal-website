import { expect, test } from "@playwright/test";

// Audit E1: every page has one URL, the trailing-slash form (Vercel redirects
// the bare form). Internal links must use it so crawlers never hit a redirect.
const PAGES = [
  "/",
  "/en/",
  "/services/",
  "/en/about/",
  "/projects/",
  "/projects/fusily/",
  "/en/blog/",
  "/blog/mon-parcours-qui-je-suis/",
  "/contact/",
  "/legal-notice/",
];

for (const path of PAGES) {
  test(`${path}: internal links end with a slash`, async ({ page }) => {
    await page.goto(path);
    const hrefs = await page
      .locator("a[href^='/']")
      .evaluateAll((links) => links.map((a) => a.getAttribute("href") ?? ""));
    const offenders = hrefs.filter((href) => {
      const pathname = href.split(/[?#]/)[0];
      const last = pathname.slice(pathname.lastIndexOf("/") + 1);
      return !pathname.endsWith("/") && !last.includes(".");
    });
    expect(offenders).toEqual([]);
  });
}
