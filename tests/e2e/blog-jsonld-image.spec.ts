import { expect, type Page, test } from "@playwright/test";

interface LdNode {
  "@type": string;
  [key: string]: unknown;
}

// Parse every JSON-LD block on the page and flatten each `@graph`, so a test can
// find a node by `@type` regardless of how graphs are split across <script>s.
async function jsonLdNodes(page: Page): Promise<LdNode[]> {
  const blocks = await page
    .locator('head script[type="application/ld+json"]')
    .allTextContents();
  return blocks.flatMap((raw) => {
    const parsed = JSON.parse(raw);
    return (parsed["@graph"] ?? [parsed]) as LdNode[];
  });
}

function nodeOfType(nodes: LdNode[], type: string): LdNode {
  const node = nodes.find((n) => n["@type"] === type);
  expect(node, `expected a ${type} JSON-LD node`).toBeTruthy();
  return node as LdNode;
}

/** Same flattening as `jsonLdNodes`, over raw HTML instead of a live page. */
function jsonLdNodesFromHtml(html: string): LdNode[] {
  const blocks = [
    ...html.matchAll(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
    ),
  ];
  return blocks.flatMap((m) => {
    const parsed = JSON.parse(m[1]);
    return (parsed["@graph"] ?? [parsed]) as LdNode[];
  });
}

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
// CreativeWork (the portfolio mixes apps and showcase sites).
test("project detail: mobile app is SoftwareApplication", async ({ page }) => {
  await page.goto("/projects/fusily/");
  nodeOfType(await jsonLdNodes(page), "SoftwareApplication");
});

test("project detail: web project is CreativeWork", async ({ page }) => {
  await page.goto("/projects/dotcraft/");
  nodeOfType(await jsonLdNodes(page), "CreativeWork");
});
