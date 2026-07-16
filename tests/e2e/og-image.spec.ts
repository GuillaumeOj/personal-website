import { expect, type Page, test } from "@playwright/test";

const ORIGIN = "https://guillaume.ojardias.info";

const attr = (page: Page, selector: string) =>
  page.locator(`head ${selector}`).getAttribute("content");
const ogImage = (page: Page) => attr(page, 'meta[property="og:image"]');
const ogWidth = (page: Page) => attr(page, 'meta[property="og:image:width"]');
const ogHeight = (page: Page) => attr(page, 'meta[property="og:image:height"]');
const twitterImage = (page: Page) => attr(page, 'meta[name="twitter:image"]');

// Every non-content page now ships a real landscape 1200×630 share card under
// /og/, replacing the old 896×1195 portrait — so LinkedIn/Slack/Twitter shares
// stop cropping a vertical sliver under twitter:card=summary_large_image.
async function expectLandscapeCard(page: Page, urlContains: string) {
  const img = await ogImage(page);
  expect(img).toContain(ORIGIN);
  expect(img).toContain(urlContains);
  // Explicit 1.91:1 dimensions are always present.
  expect(await ogWidth(page)).toBe("1200");
  expect(await ogHeight(page)).toBe("630");
  // twitter:image mirrors og:image.
  expect(await twitterImage(page)).toBe(img);
}

// The per-locale default card covers home, /about, the projects hub and the
// blog list (none pass their own ogImage).
const defaultCardPages: Array<{ path: string; card: string }> = [
  { path: "/", card: "/og/default-fr.png" },
  { path: "/en/", card: "/og/default-en.png" },
  { path: "/about/", card: "/og/default-fr.png" },
  { path: "/projects/", card: "/og/default-fr.png" },
  { path: "/blog/", card: "/og/default-fr.png" },
];

for (const { path, card } of defaultCardPages) {
  test(`${path} ships the landscape default card (${card})`, async ({
    page,
  }) => {
    await page.goto(path);
    await expectLandscapeCard(page, card);
    expect(await ogImage(page)).toContain(card);
  });
}

test("project detail ships its own landscape 1200×630 card", async ({
  page,
}) => {
  await page.goto("/projects/fusily/");
  await expectLandscapeCard(page, "/og/");
  const img = await ogImage(page);
  // The dedicated per-project card, not the portrait or a raw screenshot.
  expect(img).toContain("/og/project-fusily-fr.png");
  expect(img).not.toContain("/portrait");
});
