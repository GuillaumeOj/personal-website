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

// Audit E-min: each feed's channel links its own blog index and itself.
for (const [feed, index] of [
  ["/rss.xml", "/blog/"],
  ["/en/rss.xml", "/en/blog/"],
] as const) {
  test(`${feed}: channel link and atom:self`, async ({ request }) => {
    const xml = await (await request.get(feed)).text();
    expect(xml).toContain(`<channel><title>`);
    expect(xml).toMatch(
      new RegExp(`<link>https://guillaume\\.ojardias\\.info${index}</link>`),
    );
    expect(xml).toContain(
      `<atom:link href="https://guillaume.ojardias.info${feed}" rel="self"`,
    );
  });
}
