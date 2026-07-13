import { expect, test } from "@playwright/test";

// T7 — each RSS feed declares its language.
for (const [path, language] of [
  ["/rss.xml", "fr-FR"],
  ["/en/rss.xml", "en-US"],
] as const) {
  test(`rss (${path}): declares <language>${language}</language>`, async ({
    request,
  }) => {
    const res = await request.get(path);
    expect(res.ok()).toBe(true);
    const xml = await res.text();
    expect(xml).toContain(`<language>${language}</language>`);
  });
}
