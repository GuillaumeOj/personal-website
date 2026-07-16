import { expect, test } from "@playwright/test";

const FR_DEFAULT = "concentré sur votre métier";
const EN_DEFAULT = "focused on your business";

test("hero closing line is complete server-side (no-JS friendly)", async ({
  page,
}) => {
  await page.goto("/");
  // A full, static sentence is exposed to assistive tech / crawlers…
  await expect(page.locator(".hero-closing .sr-only")).toHaveText(
    `Pendant ce temps, vous restez ${FR_DEFAULT}`,
  );
  // …and the rotating word ships with its localized phrase list + safe default.
  const rotate = page.locator("[data-hero-rotate]");
  const phrases = await rotate.getAttribute("data-phrases");
  expect(phrases).toContain(FR_DEFAULT);
  expect(phrases).toContain("propriétaire de votre produit");
});

test("EN hero uses the localized phrase list", async ({ page }) => {
  await page.goto("/en/");
  await expect(page.locator(".hero-closing .sr-only")).toHaveText(
    `Meanwhile, you stay ${EN_DEFAULT}`,
  );
  expect(
    await page.locator("[data-hero-rotate]").getAttribute("data-phrases"),
  ).toContain(EN_DEFAULT);
});

// T8 — the hero names its target audience (PME/associations/porteurs de projet)
// and carries the "Lyon" local keyword on the first screen.
test("hero surfaces the audience + Lyon local intent (FR)", async ({
  page,
}) => {
  await page.goto("/");
  const audience = page.locator("[data-hero-audience]");
  await expect(audience).toHaveText(
    "Pour les PME, associations et porteurs de projet, à Lyon et partout en France.",
  );
  await expect(audience).toContainText("Lyon");
});

test("hero surfaces the audience + Lyon local intent (EN)", async ({
  page,
}) => {
  await page.goto("/en/");
  const audience = page.locator("[data-hero-audience]");
  await expect(audience).toHaveText(
    "For SMEs, non-profits and project owners, in Lyon and across France.",
  );
  await expect(audience).toContainText("Lyon");
});

// T1 — the credibility proof strip (shared with the /services hero) shows
// above the fold on the home hero, before any scroll to AboutTeaser.
test("hero shows the credibility proof strip above the fold (FR)", async ({
  page,
}) => {
  await page.goto("/");
  const credibility = page.locator("[data-hero-credibility]");
  await expect(credibility).toBeVisible();
  await expect(credibility).toContainText("Sketchfab");
  await expect(credibility).toContainText("Lyon");
});

test("hero shows the credibility proof strip above the fold (EN)", async ({
  page,
}) => {
  await page.goto("/en/");
  const credibility = page.locator("[data-hero-credibility]");
  await expect(credibility).toBeVisible();
  await expect(credibility).toContainText("Sketchfab");
  await expect(credibility).toContainText("Lyon");
});

test("reduced motion: hero shows the static default phrase, no animation", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const rotate = page.locator("[data-hero-rotate]");
  await expect(rotate).toHaveText(FR_DEFAULT);
  // Give the loop a chance to run — under reduced motion it must not.
  await page.waitForTimeout(600);
  await expect(rotate).toHaveText(FR_DEFAULT);
});
