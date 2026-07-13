import { expect, test } from "@playwright/test";

// T3 — a privacy/consent line sits at the point of submission (the reused
// #contact form), with the trailing fragment linking to the privacy policy.
// Contact.astro is shared by Home and /services, so it must ship on both and
// their /en mirrors.

const FR = {
  copy: "vous acceptez que vos informations",
  linkName: "politique de confidentialité",
  privacyHref: /^\/privacy-policy\/?$/,
};
const EN = {
  copy: "you agree that your information",
  linkName: "privacy policy",
  privacyHref: /^\/en\/privacy-policy\/?$/,
};

for (const path of ["/", "/services/"]) {
  test(`FR contact (${path}): consent copy + privacy-policy link`, async ({
    page,
  }) => {
    await page.goto(path);
    const contact = page.locator("#contact");
    await expect(contact).toContainText(FR.copy);
    const link = contact.getByRole("link", { name: FR.linkName });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", FR.privacyHref);
  });
}

for (const path of ["/en/", "/en/services/"]) {
  test(`EN contact (${path}): consent copy + privacy-policy link`, async ({
    page,
  }) => {
    await page.goto(path);
    const contact = page.locator("#contact");
    await expect(contact).toContainText(EN.copy);
    const link = contact.getByRole("link", { name: EN.linkName });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", EN.privacyHref);
  });
}
