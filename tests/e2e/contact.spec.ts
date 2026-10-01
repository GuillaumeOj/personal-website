import { expect, type Page, test } from "@playwright/test";

// The contact form lives only on /contact and /contact/quote (plus their /en
// mirrors); every other page links there. T3 — a GDPR information notice (not a
// consent request) sits at the point of submission, naming the controller and
// linking the GDPR address and the privacy policy.

const LOCALES = [
  {
    path: "/contact/",
    quotePath: "/contact/quote/",
    copy: "traitées par Guillaume Ojardias EI",
    linkName: "politique de confidentialité",
    privacyHref: /^\/privacy-policy\/?$/,
    termsHref: "/terms-of-service/",
    estimate: "Demander une estimation gratuite",
    note: "devis gratuit, aucun engagement",
  },
  {
    path: "/en/contact/",
    quotePath: "/en/contact/quote/",
    copy: "processed by Guillaume Ojardias EI",
    linkName: "privacy policy",
    privacyHref: /^\/en\/privacy-policy\/?$/,
    termsHref: "/en/terms-of-service/",
    estimate: "Request a free estimate",
    note: "free quote, no commitment",
  },
];

for (const l of LOCALES) {
  for (const path of [l.path, l.quotePath]) {
    test(`contact (${path}): form with privacy notice + GDPR and privacy-policy links`, async ({
      page,
    }) => {
      await page.goto(path);
      const form = page.locator("[data-contact-form]");
      await expect(form).toBeVisible();
      await expect(form).toContainText(l.copy);
      const link = form.getByRole("link", { name: l.linkName });
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute("href", l.privacyHref);
      await expect(
        form.getByRole("link", { name: "gdpr@ojardias.me" }),
      ).toHaveAttribute("href", "mailto:gdpr@ojardias.me");
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

  // Audit L7: the quote form points to the general terms of service; the
  // general contact form doesn't.
  test(`contact (${l.quotePath}): quote form links the terms of service`, async ({
    page,
  }) => {
    const terms = `[data-contact-form] a[href="${l.termsHref}"]`;
    await page.goto(l.quotePath);
    await expect(page.locator(terms)).toBeVisible();
    await page.goto(l.path);
    await expect(page.locator(terms)).toHaveCount(0);
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
  await page.route("**/api/contact/", async (route) => {
    body = route.request().postDataJSON();
    await route.fulfill({ status: 200, json: { ok: true } });
  });

  await page.goto(path);
  await page.fill('input[name="name"]', "Jane");
  await page.fill('input[name="email"]', "jane@example.com");
  await page.fill('textarea[name="message"]', "A booking app.");
  await fillExtra?.();
  await page.locator("[data-contact-form] button[type=submit]").click();

  const success = page.locator("[data-contact-success]");
  await expect(success).toContainText("Merci");
  await expect(success).toBeFocused();
  await expect(page.locator("[data-contact-form]")).toBeHidden();
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

// Audit U1: without JS the browser posts the form itself (never a GET that
// leaks fields into the URL) and lands on a static thank-you page.
test("contact: form posts to /api/contact without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  let posted: string | undefined;
  await page.route("**/api/contact/", async (route) => {
    posted = route.request().method();
    await route.fulfill({
      status: 303,
      headers: { location: "/en/contact/thanks/" },
    });
  });
  await page.goto("/en/contact/");
  await page.fill('input[name="name"]', "Jane");
  await page.fill('input[name="email"]', "jane@example.com");
  await page.fill('textarea[name="message"]', "A booking app.");
  await page.locator("[data-contact-form] button[type=submit]").click();
  await expect(page).toHaveURL(/\/en\/contact\/thanks\/$/);
  expect(posted).toBe("POST");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Message sent",
  );
  await context.close();
});

test("contact: empty required fields are flagged inline", async ({ page }) => {
  await page.goto("/contact/");
  await page.locator("[data-contact-form] button[type=submit]").click();
  const name = page.locator('input[name="name"]');
  await expect(name).toHaveAttribute("aria-invalid", "true");
  await expect(name).toBeFocused();
  await expect(page.locator("#contact-name-error")).toHaveText(
    "Indiquez votre nom.",
  );
  await expect(page.locator('textarea[name="message"]')).toHaveAttribute(
    "aria-invalid",
    "true",
  );
  await page.fill('input[name="name"]', "Jane");
  await expect(name).not.toHaveAttribute("aria-invalid");
});

test("contact: a server-side field error points at the field", async ({
  page,
}) => {
  await page.route("**/api/contact/", (route) =>
    route.fulfill({ status: 400, json: { ok: false, error: "invalid email" } }),
  );
  await page.goto("/en/contact/");
  await page.fill('input[name="name"]', "Jane");
  await page.fill('input[name="email"]', "jane@example.com");
  await page.fill('textarea[name="message"]', "A booking app.");
  await page.locator("[data-contact-form] button[type=submit]").click();
  await expect(page.locator('input[name="email"]')).toHaveAttribute(
    "aria-invalid",
    "true",
  );
  await expect(page.locator("#contact-email-error")).toContainText(
    "valid email",
  );
});

test("contact: a send failure offers a pre-filled mailto", async ({ page }) => {
  await page.route("**/api/contact/", (route) =>
    route.fulfill({ status: 502, json: { ok: false, error: "send failed" } }),
  );
  await page.goto("/contact/");
  await page.fill('input[name="name"]', "Jane");
  await page.fill('input[name="email"]', "jane@example.com");
  await page.fill('textarea[name="message"]', "Une appli de réservation.");
  await page.locator("[data-contact-form] button[type=submit]").click();
  const status = page.locator("[data-contact-status]");
  await expect(status).toContainText("n’a pas pu être envoyé");
  const mailto = status.getByRole("link", { name: "contact@ojardias.me" });
  await expect(mailto).toHaveAttribute(
    "href",
    /^mailto:contact@ojardias\.me\?subject=.+&body=Une%20appli/,
  );
  await expect(page.locator("[data-contact-form]")).toBeVisible();
});

for (const path of ["/contact/thanks/", "/en/contact/error/"]) {
  test(`${path}: outcome page is noindex`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/,
    );
  });
}
