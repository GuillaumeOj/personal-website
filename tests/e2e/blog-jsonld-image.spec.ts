import { expect, test } from "@playwright/test";
import { jsonLdNodes, jsonLdNodesFromHtml, nodeOfType } from "./helpers";

// Every BlogPosting must carry a non-empty `image`. Rather than pinning a couple
// of slugs, sweep every article the sitemap advertises, so the check covers new
// posts automatically. `cover` is required by the content schema, so this is the
// guard that a cover always survives all the way into the structured data.
//
// Fetched rather than driven through a browser: the assertion reads a <script>
// out of static HTML, and `page.goto` would download each article's hero image
// (up to ~200 kB) 14 times for nothing.
test("every BlogPosting has a non-empty image", async ({ request }) => {
  const index = await request.get("/sitemap-index.xml");
  expect(index.ok()).toBe(true);
  // The chunk filename (`sitemap-0.xml`) is an entryLimit implementation detail.
  const chunks = [...(await index.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (m) => new URL(m[1]).pathname,
  );
  expect(chunks.length).toBeGreaterThan(0);

  const paths: string[] = [];
  for (const chunk of chunks) {
    const xml = await (await request.get(chunk)).text();
    paths.push(
      ...[...xml.matchAll(/<loc>([^<]*\/blog\/[^<]+\/)<\/loc>/g)]
        .map((m) => new URL(m[1]).pathname)
        // Drop the two listing pages; only article details carry a BlogPosting.
        .filter((p) => !/\/blog\/$/.test(p)),
    );
  }
  // Guards against the regex silently matching nothing; the exact inventory is
  // owned by tests/unit/post-files.test.ts so publishing doesn't turn this red.
  expect(paths.length, "article URLs in the sitemap").toBeGreaterThan(0);

  for (const path of paths) {
    const html = await (await request.get(path)).text();
    const posting = nodeOfType(jsonLdNodesFromHtml(html), "BlogPosting");
    expect(typeof posting.image, path).toBe("string");
    expect(posting.image as string, path).not.toBe("");
  }
});

// A live mobile app is a SoftwareApplication; a web project stays a generic
// CreativeWork (the portfolio mixes apps and showcase sites). Audit E3: the app
// node carries a free offer (app rich results also need a rating, which we
// don't fabricate) and project dates aren't invented (year only).
test("project detail: mobile app is SoftwareApplication with a free offer and a year date", async ({
  page,
}) => {
  await page.goto("/projects/fusily/");
  const app = nodeOfType(await jsonLdNodes(page), "SoftwareApplication");
  expect(app.offers).toMatchObject({ price: 0, priceCurrency: "EUR" });
  expect(app.datePublished).toMatch(/^\d{4}$/);
});
