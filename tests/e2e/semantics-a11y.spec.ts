import { expect, type Page, test } from "@playwright/test";

// Semantic-HTML / accessibility guards for the SEO round-2 audit: correct
// heading outlines on the list pages (card titles promoted h3 → h2), labelled
// header nav landmarks, an announced filter empty-state, real `<time>` +
// heading semantics on the About experience timeline, and the blog grid as a
// true list. These assert structure, not copy.

/** Heading levels (1-6) in document order, scoped to a selector. */
async function headingLevels(page: Page, scope = "main"): Promise<number[]> {
  return page.$$eval(
    `${scope} h1, ${scope} h2, ${scope} h3, ${scope} h4, ${scope} h5, ${scope} h6`,
    (els) => els.map((el) => Number(el.tagName[1])),
  );
}

// The list hubs must expose a single H1, at least one H2, and never skip a
// level on the way down (no <h3> before an <h2>) — the round-2 "H2-skip on list
// pages" cross-cutting finding. Card titles are now <h2>, so the outline holds.
for (const path of ["/projects/", "/blog/", "/en/projects/", "/en/blog/"]) {
  test(`list outline (${path}): one H1, has H2, no level skips`, async ({
    page,
  }) => {
    await page.goto(path);

    expect(await page.locator("main h1").count()).toBe(1);
    expect(await page.locator("main h2").count()).toBeGreaterThan(0);
    // Card titles must not be H3 (they were promoted to H2).
    expect(await page.locator("main h3").count()).toBe(0);

    // No heading skips more than one level below the deepest seen so far.
    const levels = await headingLevels(page);
    let deepest = 0;
    for (const level of levels) {
      if (deepest > 0) expect(level).toBeLessThanOrEqual(deepest + 1);
      deepest = Math.max(deepest, level);
    }
  });
}

// Both header nav landmarks (desktop + mobile menu) carry an aria-label, so
// assistive tech can distinguish them from the footer navs.
for (const path of ["/", "/en/"]) {
  test(`header navs (${path}) are labelled landmarks`, async ({ page }) => {
    await page.goto(path);
    const navs = page.locator("header nav");
    const count = await navs.count();
    expect(count).toBeGreaterThanOrEqual(2);
    for (let i = 0; i < count; i++) {
      const label = await navs.nth(i).getAttribute("aria-label");
      expect(label?.trim()).toBeTruthy();
    }
  });
}

// The projects filter empty-state is an ARIA live region, so screen readers
// announce "no results" when a filter empties the grid.
for (const path of ["/projects/", "/en/projects/"]) {
  test(`projects empty-state (${path}) is a live region`, async ({ page }) => {
    await page.goto(path);
    const empty = page.locator("[data-projects-empty]");
    await expect(empty).toHaveAttribute("aria-live", "polite");
    await expect(empty).toHaveAttribute("role", "status");
  });
}

// The About experience timeline uses <h3> role headings (under the section
// <h2>) and wraps each date range in <time datetime="…">.
for (const path of ["/about/", "/en/about/"]) {
  test(`about experience (${path}): H3 roles + <time> ranges`, async ({
    page,
  }) => {
    await page.goto(path);
    const section = page.locator("section", { hasText: /2024/ });
    expect(await page.locator("main h3").count()).toBeGreaterThan(0);

    const times = page.locator("main time[datetime]");
    const timeCount = await times.count();
    expect(timeCount).toBeGreaterThan(0);
    // Every experience datetime is at least a valid year.
    for (let i = 0; i < timeCount; i++) {
      const dt = await times.nth(i).getAttribute("datetime");
      expect(dt).toMatch(/^\d{4}/);
    }
    await expect(section.first()).toBeVisible();
  });
}

// The blog post grid is a real list (<ul>/<li>), not a bare <div>, so the
// collection is navigable as a list by assistive tech.
for (const path of ["/blog/", "/en/blog/"]) {
  test(`blog grid (${path}) is a <ul>/<li> list`, async ({ page }) => {
    await page.goto(path);
    // The article cards live inside <li> items of a <ul> in the main content.
    const items = page.locator("main ul li a[aria-label]");
    expect(await items.count()).toBeGreaterThan(0);
  });
}

// Author avatars carry explicit width/height to prevent layout shift. Guarded:
// only posts with an author avatar render one (build-dependent), but any that
// do must be dimensioned.
for (const path of ["/blog/", "/en/blog/"]) {
  test(`blog author avatars (${path}) have width/height`, async ({ page }) => {
    await page.goto(path);
    const avatars = page.locator("main a[aria-label] img.rounded-full");
    const count = await avatars.count();
    for (let i = 0; i < count; i++) {
      await expect(avatars.nth(i)).toHaveAttribute("width", "20");
      await expect(avatars.nth(i)).toHaveAttribute("height", "20");
    }
  });
}
