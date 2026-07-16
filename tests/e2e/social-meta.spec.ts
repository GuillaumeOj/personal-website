import { expect, type Page, test } from "@playwright/test";

const ORIGIN = "https://guillaume.ojardias.info";

const attr = (page: Page, selector: string) =>
  page.locator(`head ${selector}`).getAttribute("content");
const ogImage = (page: Page) => attr(page, 'meta[property="og:image"]');
const ogImageAlt = (page: Page) => attr(page, 'meta[property="og:image:alt"]');
const ogTitle = (page: Page) => attr(page, 'meta[property="og:title"]');
const twitterImage = (page: Page) => attr(page, 'meta[name="twitter:image"]');

// hreflang alternate href for a given language (fr/en/x-default).
const altHref = (page: Page, lang: string) =>
  page
    .locator(`head link[rel="alternate"][hreflang="${lang}"]`)
    .getAttribute("href");
// Count of hreflang alternates (the RSS `rel="alternate"` link has no hreflang,
// so it's excluded).
const altCount = (page: Page) =>
  page.locator('head link[rel="alternate"][hreflang]').count();

// og:image is always an absolute URL on the production origin, and og/twitter
// stay in sync. Asserted on every page below via checkImage().
async function checkImage(page: Page, mustContain: string) {
  const img = await ogImage(page);
  expect(img).toContain(ORIGIN);
  expect(img).toContain(mustContain);
  // twitter:image mirrors og:image.
  expect(await twitterImage(page)).toBe(img);
  return img;
}

// og:title mirrors each page's own descriptive title with the brand stripped
// (og:site_name carries "Guillaume Ojardias" on the card); the <title> tag keeps
// the brand suffix for SEO. These tests pin both.

test("home: landscape card, og mirrors the page title, per-page <title>", async ({
  page,
}) => {
  await page.goto("/");
  await checkImage(page, "/og/default-fr.png");
  expect(await ogTitle(page)).toBe("Développeur web & mobile freelance à Lyon");
  await expect(page).toHaveTitle(
    "Développeur web & mobile freelance à Lyon — Guillaume Ojardias",
  );
  // Regression guard (N12): the default-locale root's `en` alternate carries a
  // trailing slash, matching the canonical, so it doesn't point at a redirect.
  expect(await altHref(page, "en")).toBe(`${ORIGIN}/en/`);
});

test("EN home: localized og title", async ({ page }) => {
  await page.goto("/en/");
  await checkImage(page, "/og/default-en.png");
  expect(await ogTitle(page)).toBe("Freelance Web & Mobile Developer in Lyon");
});

test("projects list: inherits the landscape default card, brand not doubled", async ({
  page,
}) => {
  await page.goto("/projects/");
  await checkImage(page, "/og/default-fr.png");
  expect(await ogTitle(page)).toBe("Projets & réalisations web");
  await expect(page).toHaveTitle(
    "Projets & réalisations web — Guillaume Ojardias",
  );
});

test("project detail: own landscape card, descriptor title, same-slug hreflang", async ({
  page,
}) => {
  await page.goto("/projects/fusily/");
  const img = await checkImage(page, "/og/project-fusily-fr.png");
  expect(img).toContain(".png");
  // The dedicated landscape card, not the raw portrait or the memoji.
  expect(img).not.toContain("/portrait");
  expect(img).not.toContain("memoji");
  expect(await ogTitle(page)).toBe("Fusily — Application mobile de repas");
  expect(await ogImageAlt(page)).toContain("application mobile Fusily");
  // Same slug across locales — reciprocal hreflang.
  expect(await altHref(page, "fr")).toBe(`${ORIGIN}/projects/fusily/`);
  expect(await altHref(page, "en")).toBe(`${ORIGIN}/en/projects/fusily/`);
});

test("blog list: inherits the landscape default card, brand not doubled", async ({
  page,
}) => {
  await page.goto("/blog/");
  const img = await checkImage(page, "/og/default-fr.png");
  expect(img).not.toContain("memoji");
  expect(await ogTitle(page)).toBe("Blog — Développement web & mobile");
  await expect(page).toHaveTitle(
    "Blog — Développement web & mobile — Guillaume Ojardias",
  );
});

test("blog article: hreflang pairs the translated (differing) slugs", async ({
  page,
}) => {
  await page.goto("/blog/pourquoi-astro/");
  expect(await altHref(page, "fr")).toBe(`${ORIGIN}/blog/pourquoi-astro/`);
  expect(await altHref(page, "en")).toBe(`${ORIGIN}/en/blog/why-astro/`);
  expect(await altHref(page, "x-default")).toBe(
    `${ORIGIN}/blog/pourquoi-astro/`,
  );
});

test("blog article without a translation emits no hreflang", async ({
  page,
}) => {
  await page.goto("/blog/sans-auteur/");
  expect(await altCount(page)).toBe(0);
  // canonical is still present.
  await expect(page.locator('head link[rel="canonical"]')).toHaveCount(1);
});

// T7 — the About portrait card ships og:image:width/height (like home and the
// project cards), so scrapers can render it without a fetch round-trip.
for (const path of ["/about/", "/en/about/"]) {
  test(`about (${path}): og:image dimensions are present and numeric`, async ({
    page,
  }) => {
    await page.goto(path);
    const width = await attr(page, 'meta[property="og:image:width"]');
    const height = await attr(page, 'meta[property="og:image:height"]');
    expect(width).toBeTruthy();
    expect(height).toBeTruthy();
    expect(Number.isNaN(Number(width))).toBe(false);
    expect(Number.isNaN(Number(height))).toBe(false);
    expect(Number(width)).toBeGreaterThan(0);
    expect(Number(height)).toBeGreaterThan(0);
  });
}

// T8 — pages that emit reciprocal hreflang also declare og:locale:alternate for
// the mirrored locale (home renders alternates on both locales).
test("home: og:locale + og:locale:alternate mirror the two locales", async ({
  page,
}) => {
  await page.goto("/");
  expect(await attr(page, 'meta[property="og:locale"]')).toBe("fr_FR");
  expect(await attr(page, 'meta[property="og:locale:alternate"]')).toBe(
    "en_US",
  );
  await page.goto("/en/");
  expect(await attr(page, 'meta[property="og:locale"]')).toBe("en_US");
  expect(await attr(page, 'meta[property="og:locale:alternate"]')).toBe(
    "fr_FR",
  );
});

test("404: inherits the landscape default card", async ({ page }) => {
  const res = await page.goto("/this-page-does-not-exist/");
  expect(res?.status()).toBe(404);
  await checkImage(page, "/og/default-fr.png");
});

test("apple-touch-icon is served at the well-known root paths", async ({
  request,
}) => {
  for (const path of [
    "/apple-touch-icon.png",
    "/apple-touch-icon-precomposed.png",
  ]) {
    const res = await request.get(path);
    expect(res.status(), path).toBe(200);
    expect(res.headers()["content-type"]).toContain("image/png");
  }
});
