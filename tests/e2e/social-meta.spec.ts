import { expect, type Page, test } from "@playwright/test";

const ORIGIN = "https://guillaume.ojardias.info";

const attr = (page: Page, selector: string) =>
  page.locator(`head ${selector}`).getAttribute("content");
const ogImage = (page: Page) => attr(page, 'meta[property="og:image"]');
const ogImageAlt = (page: Page) => attr(page, 'meta[property="og:image:alt"]');
const ogTitle = (page: Page) => attr(page, 'meta[property="og:title"]');
const twitterImage = (page: Page) => attr(page, 'meta[name="twitter:image"]');

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

test("home: portrait card + branded title, per-page <title>", async ({
  page,
}) => {
  await page.goto("/");
  await checkImage(page, "/portrait");
  expect(await ogImage(page)).toContain(".jpeg");
  expect(await ogTitle(page)).toBe(
    "Guillaume Ojardias — Développeur web & mobile freelance",
  );
  // The <title> tag stays page-specific for SEO (not the branded card title).
  await expect(page).toHaveTitle("Guillaume Ojardias");
});

test("EN home: localized branded title", async ({ page }) => {
  await page.goto("/en/");
  await checkImage(page, "/portrait");
  expect(await ogTitle(page)).toBe(
    "Guillaume Ojardias — Freelance web & mobile developer",
  );
});

test("projects list: inherits the portrait card", async ({ page }) => {
  await page.goto("/projects/");
  await checkImage(page, "/portrait");
  expect(await ogTitle(page)).toBe(
    "Guillaume Ojardias — Développeur web & mobile freelance",
  );
  // Regression guard: the site name must not be doubled in <title>.
  await expect(page).toHaveTitle("Projets — Guillaume Ojardias");
});

test("project detail: previews its own screenshot + name", async ({ page }) => {
  await page.goto("/projects/fusily/");
  const img = await checkImage(page, "fusily-fr");
  expect(img).toContain(".jpeg");
  // Not the portrait, not the memoji.
  expect(img).not.toContain("/portrait");
  expect(img).not.toContain("memoji");
  expect(await ogTitle(page)).toBe("Fusily — Guillaume Ojardias");
  expect(await ogImageAlt(page)).toBe("Fusily");
});

test("blog is excluded: list keeps the memoji + its own title", async ({
  page,
}) => {
  await page.goto("/blog/");
  const img = await ogImage(page);
  expect(img).toBe(`${ORIGIN}/memoji.png`);
  expect(img).not.toContain("/portrait");
  // Blog opts out of the branded card title, and <title> is not doubled.
  expect(await ogTitle(page)).toBe("Blog — Guillaume Ojardias");
  await expect(page).toHaveTitle("Blog — Guillaume Ojardias");
});

test("404: inherits the portrait card", async ({ page }) => {
  const res = await page.goto("/this-page-does-not-exist/");
  expect(res?.status()).toBe(404);
  await checkImage(page, "/portrait");
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
