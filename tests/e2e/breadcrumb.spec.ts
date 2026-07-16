import { expect, type Locator, type Page, test } from "@playwright/test";

// The visible breadcrumb `<nav>` rendered above each page's <h1>, mirroring the
// BreadcrumbList JSON-LD. Root first, current page last (aria-current="page",
// rendered as text, not a link).

const breadcrumb = (page: Page): Locator =>
  page.locator('nav[aria-label="Breadcrumb"]').first();

// The ordered crumb labels — every link plus the final aria-current span, in DOM
// order (the "/" separators are aria-hidden and excluded).
const crumbLabels = async (nav: Locator): Promise<string[]> => {
  const raw = await nav.locator('a, [aria-current="page"]').allTextContents();
  return raw.map((s) => s.trim());
};

// Shared assertions: the trail is visible, matches the expected labels in order,
// and its last crumb is the current page (a non-link with aria-current="page").
async function expectTrail(page: Page, expected: string[]) {
  const nav = breadcrumb(page);
  await expect(nav).toBeVisible();
  expect(await crumbLabels(nav)).toEqual(expected);

  const current = nav.locator('[aria-current="page"]');
  await expect(current).toHaveCount(1);
  await expect(current).toHaveText(expected[expected.length - 1]);
  // The current crumb is plain text, never a link.
  await expect(nav.locator('a[aria-current="page"]')).toHaveCount(0);
}

test("project detail: Home › Projects › {name}", async ({ page }) => {
  await page.goto("/projects/fusily/");
  await expectTrail(page, ["Accueil", "Projets", "Fusily"]);
});

test("EN project detail: Home › Projects › {name}", async ({ page }) => {
  await page.goto("/en/projects/fusily/");
  await expectTrail(page, ["Home", "Projects", "Fusily"]);
});

test("blog article: Home › Blog › {title}", async ({ page }) => {
  await page.goto("/blog/pourquoi-astro/");
  const nav = breadcrumb(page);
  await expect(nav).toBeVisible();
  const labels = await crumbLabels(nav);
  expect(labels.length).toBe(3);
  expect(labels[0]).toBe("Accueil");
  expect(labels[1]).toBe("Blog");
  // The last crumb is the current page and not a link.
  const current = nav.locator('[aria-current="page"]');
  await expect(current).toHaveCount(1);
  await expect(current).toHaveText(labels[2]);
  await expect(nav.locator('a[aria-current="page"]')).toHaveCount(0);
});

test("about (fr): Home › About", async ({ page }) => {
  await page.goto("/about/");
  await expectTrail(page, ["Accueil", "À propos"]);
});

test("about (en): Home › About", async ({ page }) => {
  await page.goto("/en/about/");
  await expectTrail(page, ["Home", "About"]);
});

// Hub / list pages carry a 2-crumb trail (Home › {Hub}) too.
const hubs = [
  { path: "/services/", trail: ["Accueil", "Prestations"] },
  { path: "/en/services/", trail: ["Home", "Services"] },
  { path: "/projects/", trail: ["Accueil", "Projets"] },
  { path: "/en/projects/", trail: ["Home", "Projects"] },
  { path: "/blog/", trail: ["Accueil", "Blog"] },
  { path: "/en/blog/", trail: ["Home", "Blog"] },
];
for (const { path, trail } of hubs) {
  test(`hub ${path}: ${trail.join(" › ")}`, async ({ page }) => {
    await page.goto(path);
    await expectTrail(page, trail);
  });
}
