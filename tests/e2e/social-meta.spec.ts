import { expect, test } from "@playwright/test";
import {
  altHref,
  expectShareCard,
  metaContent,
  ORIGIN,
  SAMPLE_ARTICLE,
  SAMPLE_PROJECT,
} from "./helpers";

const ogTitle = (page: Parameters<typeof metaContent>[0]) =>
  metaContent(page, 'meta[property="og:title"]');

// Every share card is a real landscape 1200×630 image under /og/ (the old
// 896×1195 portrait cropped into a sliver under summary_large_image). Pages
// without their own image get the locale's default card. og:title mirrors the
// page's own title with the brand stripped (og:site_name carries it); the
// <title> keeps the brand suffix. The title logic itself is unit-tested in
// tests/unit/seo.test.ts; these pin the rendered pages.
const cards: {
  path: string;
  card: string;
  ogTitle?: string;
  title?: string;
}[] = [
  {
    path: "/",
    card: "/og/default-fr.jpg",
    ogTitle: "Développeur web & mobile freelance à Lyon",
    title: "Développeur web & mobile freelance à Lyon — Guillaume Ojardias",
  },
  {
    path: "/en/",
    card: "/og/default-en.jpg",
    ogTitle: "Freelance Web & Mobile Developer in Lyon",
  },
  { path: "/about/", card: "/og/default-fr.jpg" },
  { path: "/en/about/", card: "/og/default-en.jpg" },
  {
    path: "/projects/",
    card: "/og/default-fr.jpg",
    ogTitle: "Projets et réalisations web & mobile",
    title: "Projets et réalisations web & mobile — Guillaume Ojardias",
  },
  {
    path: "/blog/",
    card: "/og/default-fr.jpg",
    ogTitle: "Blog — Développement web & mobile",
    title: "Blog — Développement web & mobile — Guillaume Ojardias",
  },
  {
    path: SAMPLE_PROJECT,
    card: "/og/project-fusily-fr.png",
    ogTitle: "Fusily — Recettes et planification de repas",
  },
];

for (const { path, card, ogTitle: expectedOg, title } of cards) {
  test(`${path}: landscape share card ${card}`, async ({ page }) => {
    await page.goto(path);
    await expectShareCard(page, card);
    if (expectedOg) expect(await ogTitle(page)).toBe(expectedOg);
    if (title) await expect(page).toHaveTitle(title);
  });
}

test("project detail: card alt and same-slug hreflang", async ({ page }) => {
  await page.goto(SAMPLE_PROJECT);
  expect(await metaContent(page, 'meta[property="og:image:alt"]')).toContain(
    "application mobile Fusily",
  );
  expect(await altHref(page, "fr")).toBe(`${ORIGIN}${SAMPLE_PROJECT}`);
  expect(await altHref(page, "en")).toBe(`${ORIGIN}/en${SAMPLE_PROJECT}`);
});

test("home: hreflang en alternate is the canonical /en/ (N12)", async ({
  page,
}) => {
  await page.goto("/");
  // The default-locale root's `en` alternate carries a trailing slash,
  // matching the canonical, so it doesn't point at a redirect.
  expect(await altHref(page, "en")).toBe(`${ORIGIN}/en/`);
});

test("blog article: hreflang pairs the translated (differing) slugs", async ({
  page,
}) => {
  await page.goto(SAMPLE_ARTICLE.fr);
  expect(await altHref(page, "fr")).toBe(`${ORIGIN}${SAMPLE_ARTICLE.fr}`);
  expect(await altHref(page, "en")).toBe(`${ORIGIN}${SAMPLE_ARTICLE.en}`);
  expect(await altHref(page, "x-default")).toBe(
    `${ORIGIN}${SAMPLE_ARTICLE.fr}`,
  );
});

// The "article with no translated sibling emits no hreflang" case has no fixture
// left: every published article is part of an FR/EN pair. It is covered instead
// by tests/unit/alternates.test.ts, against the pure `articleAlternates` helper
// that BlogPostLayout uses.

// T8 — pages that emit reciprocal hreflang also declare og:locale:alternate for
// the mirrored locale (home renders alternates on both locales).
for (const [path, locale, alternate] of [
  ["/", "fr_FR", "en_US"],
  ["/en/", "en_US", "fr_FR"],
] as const) {
  test(`${path}: og:locale ${locale}, alternate ${alternate}`, async ({
    page,
  }) => {
    await page.goto(path);
    expect(await metaContent(page, 'meta[property="og:locale"]')).toBe(locale);
    expect(
      await metaContent(page, 'meta[property="og:locale:alternate"]'),
    ).toBe(alternate);
  });
}

test("404: inherits the landscape default card", async ({ page }) => {
  const res = await page.goto("/this-page-does-not-exist/");
  expect(res?.status()).toBe(404);
  await expectShareCard(page, "/og/default-fr.jpg");
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
