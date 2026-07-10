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
