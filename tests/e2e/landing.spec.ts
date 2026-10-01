import { expect, test } from "@playwright/test";

test("FR landing renders main sections", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Guillaume Ojardias/);
  await expect(page.locator("html")).toHaveAttribute("lang", "fr");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "application web ou mobile",
  );
  await expect(
    page.getByRole("heading", {
      name: "Un produit web ou mobile complet, prêt pour vos utilisateurs.",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Parlons de votre projet" }),
  ).toBeVisible();
});

test("EN landing renders main sections", async ({ page }) => {
  await page.goto("/en/");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "web or mobile app",
  );
  await expect(
    page.getByRole("heading", { name: "Let’s talk about your project" }),
  ).toBeVisible();
});

test("FR services page renders", async ({ page }) => {
  await page.goto("/services/");
  await expect(page.locator("html")).toHaveAttribute("lang", "fr");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "conçue et livrée par un seul interlocuteur",
  );
  await expect(
    page.getByRole("heading", { name: "Questions fréquentes" }),
  ).toBeVisible();
});

test("EN services page renders", async ({ page }) => {
  await page.goto("/en/services/");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "designed and delivered by a single point of contact",
  );
  await expect(
    page.getByRole("heading", { name: "Frequently asked questions" }),
  ).toBeVisible();
});

test("FR blog list page renders", async ({ page }) => {
  await page.goto("/blog/");
  await expect(
    page.getByRole("heading", { name: "Blog", level: 1 }),
  ).toBeVisible();
});

// T2 — the funnel ends on the #contact CTA band (linking to /contact), not the
// soft AboutTeaser: it is the final snap section and comes after the About
// block, on both locales.
for (const path of ["/", "/en/"]) {
  test(`home (${path}): #contact is the last section, after #about`, async ({
    page,
  }) => {
    await page.goto(path);
    const ids = await page
      .locator("main > section")
      .evaluateAll((els) => els.map((el) => el.id));
    expect(ids[ids.length - 1]).toBe("contact");
    expect(ids).toContain("about");
    expect(ids.indexOf("about")).toBeLessThan(ids.indexOf("contact"));
  });

  // T4 — a visible email mailto is surfaced as a secondary channel in #contact.
  test(`home (${path}): #contact shows a visible mailto link`, async ({
    page,
  }) => {
    await page.goto(path);
    const mailto = page.locator('#contact a[href^="mailto:"]');
    await expect(mailto).toBeVisible();
    await expect(mailto).toHaveAttribute("href", /^mailto:.+@.+/);
  });

  test(`home (${path}): #contact routes to the contact page`, async ({
    page,
  }) => {
    await page.goto(path);
    const cta = page.locator("#contact a.btn-primary");
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute(
      "href",
      path === "/" ? "/contact/" : "/en/contact/",
    );
  });

  // Audit U5: the home teaser shows client work, not only own products.
  test(`home (${path}): featured projects include both client sites`, async ({
    page,
  }) => {
    await page.goto(path);
    const prefix = path.slice(0, -1); // "/" → "", "/en/" → "/en"
    const section = page.locator("#projects");
    for (const slug of ["eva-biezunski-avocate", "re-source-et-moi"]) {
      await expect(
        section.locator(`a[href="${prefix}/projects/${slug}/"]`),
      ).toHaveCount(1);
    }
  });
}

test("projects can be filtered by platform", async ({ page }) => {
  await page.goto("/projects/");

  const fusily = page.getByRole("link", { name: "Fusily" });
  const personalSite = page.getByRole("link", { name: "Site personnel" });
  await expect(fusily).toBeVisible();
  await expect(personalSite).toBeVisible();

  await page.getByRole("button", { name: "Mobile" }).click();
  await expect(fusily).toBeVisible();
  await expect(personalSite).toBeHidden();

  await page.getByRole("button", { name: "Tous" }).click();
  await expect(personalSite).toBeVisible();
});

// Audit U6: anchors land below the sticky header, not under it.
test("an anchor target clears the sticky header", async ({ page }) => {
  await page.goto("/services/#faq");
  const headerBottom = await page
    .locator("[data-header]")
    .evaluate((el) => el.getBoundingClientRect().bottom);
  await expect
    .poll(() =>
      page.locator("#faq").evaluate((el) => el.getBoundingClientRect().top),
    )
    .toBeGreaterThanOrEqual(headerBottom - 1);
});

// Audit U6: proximity snapping, so tall sections can be scrolled through.
test("home snapping is proximity, with no forced stops", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await page.mouse.wheel(0, 200);
  await expect(page.locator("html")).toHaveClass(/snap-armed/);
  const snap = await page.evaluate(() => ({
    type: getComputedStyle(document.documentElement).scrollSnapType,
    stop: getComputedStyle(document.querySelector("main > section")!)
      .scrollSnapStop,
  }));
  // `proximity` is the default strictness, so it serializes as plain "y".
  expect(snap.type).toMatch(/^y( proximity)?$/);
  expect(snap.stop).toBe("normal");
});
