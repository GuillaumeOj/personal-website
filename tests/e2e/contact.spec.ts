import { expect, type Page, test } from "@playwright/test";

// The contact form lives only on /contact and /contact/quote (plus their /en
// mirrors); every other page links there. T3 — a privacy/consent line sits at
// the point of submission, with the trailing fragment linking to the privacy
// policy.

const LOCALES = [
  {
    path: "/contact/",
    quotePath: "/contact/quote/",
    copy: "vous acceptez que vos informations",
    linkName: "politique de confidentialité",
    privacyHref: /^\/privacy-policy\/?$/,
    estimate: "Demander une estimation gratuite",
    note: "devis gratuit, aucun engagement",
  },
  {
    path: "/en/contact/",
    quotePath: "/en/contact/quote/",
    copy: "you agree that your information",
    linkName: "privacy policy",
    privacyHref: /^\/en\/privacy-policy\/?$/,
    estimate: "Request a free estimate",
    note: "free quote, no commitment",
  },
];

for (const l of LOCALES) {
  for (const path of [l.path, l.quotePath]) {
    test(`contact (${path}): form with consent copy + privacy-policy link`, async ({
      page,
    }) => {
      await page.goto(path);
      const form = page.locator("[data-contact-form]");
      await expect(form).toBeVisible();
      await expect(form).toContainText(l.copy);
      const link = form.getByRole("link", { name: l.linkName });
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute("href", l.privacyHref);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    });
  }

  test(`contact (${l.path}): general form has no quote fields, links to the quote form`, async ({
    page,
  }) => {
    await page.goto(l.path);
    await expect(page.locator('select[name="budget"]')).toHaveCount(0);
    await expect(page.locator('select[name="timeline"]')).toHaveCount(0);
    await expect(page.getByText(l.note)).toHaveCount(0);
    await expect(page.locator(`main a[href="${l.quotePath}"]`)).toBeVisible();
  });

  test(`contact (${l.quotePath}?type=mobile): preselects the project type`, async ({
    page,
  }) => {
    await page.goto(`${l.quotePath}?type=mobile`);
    await expect(page.locator('select[name="projectType"]')).toHaveValue(
      "mobile",
    );
  });

  // The quote form is rendered at build time, so it works without JavaScript.
  test(`contact (${l.quotePath}): quote form works without JavaScript`, async ({
    browser,
  }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto(l.quotePath);
    await expect(page.locator('select[name="budget"]')).toBeVisible();
    await expect(page.locator('select[name="timeline"]')).toBeVisible();
    await expect(page.getByText(l.note)).toBeVisible();
    await expect(
      page.locator("[data-contact-form] button[type=submit]"),
    ).toHaveText(l.estimate);
    await context.close();
  });
}

/**
 * Submit the form at `path` against a mocked `/api/contact` and return the
 * posted JSON. `fillExtra` sets any mode-specific fields before submitting.
 */
async function submitForm(
  page: Page,
  path: string,
  fillExtra?: () => Promise<void>,
): Promise<Record<string, string>> {
  let body: Record<string, string> | undefined;
  await page.route("**/api/contact", async (route) => {
    body = route.request().postDataJSON();
    await route.fulfill({ status: 200, json: { ok: true } });
  });

  await page.goto(path);
  await page.fill('input[name="name"]', "Jane");
  await page.fill('input[name="email"]', "jane@example.com");
  await page.fill('textarea[name="message"]', "A booking app.");
  await fillExtra?.();
  await page.locator("[data-contact-form] button[type=submit]").click();

  await expect(page.locator("[data-contact-status]")).toContainText("Merci");
  expect(body).toBeDefined();
  return body as Record<string, string>;
}

test("contact: quote form posts budget, timeline and intent", async ({
  page,
}) => {
  const body = await submitForm(page, "/contact/quote/", async () => {
    await page.selectOption('select[name="budget"]', "15-40k");
    await page.selectOption('select[name="timeline"]', "1-3m");
  });
  expect(body).toMatchObject({
    name: "Jane",
    budget: "15-40k",
    timeline: "1-3m",
    intent: "quote",
  });
});

test("contact: general form does not post quote fields", async ({ page }) => {
  const body = await submitForm(page, "/contact/");
  expect(body).not.toHaveProperty("budget");
  expect(body).not.toHaveProperty("intent");
});

// No other page embeds the form: they link to /contact instead.
for (const path of ["/", "/en/", "/about/", "/en/about/"]) {
  test(`${path}: no embedded form, links to /contact`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator("[data-contact-form]")).toHaveCount(0);
    const expected = path.startsWith("/en")
      ? /^\/en\/contact\//
      : /^\/contact\//;
    const links = page.locator('main a[href*="/contact/"]');
    await expect(links.first()).toHaveAttribute("href", expected);
  });
}

// Services embeds no form; its CTAs open the quote-request form.
for (const path of ["/services/", "/en/services/"]) {
  test(`${path}: CTAs link to the quote form`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator("[data-contact-form]")).toHaveCount(0);
    const quote = path.startsWith("/en")
      ? "/en/contact/quote/"
      : "/contact/quote/";
    const ctas = page.locator('main a[href*="/contact/"]');
    const count = await ctas.count();
    expect(count).toBeGreaterThanOrEqual(3);
    for (let i = 0; i < count; i++) {
      await expect(ctas.nth(i)).toHaveAttribute("href", quote);
    }
  });
}
