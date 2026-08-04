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

// Every BlogPosting must carry a non-empty `image`. Rather than pinning a couple
// of slugs, sweep every article the sitemap advertises: the check then covers new
// posts automatically and fails loudly if one ever ships without a resolvable
// cover. The cover-less *fallback* itself is unit-tested (`articleSocialImage` in
// tests/unit/og.test.ts) — no published article lacks a cover, so there is no
// integration fixture for it.
test("every BlogPosting has a non-empty image", async ({ page, request }) => {
  const res = await request.get("/sitemap-0.xml");
  expect(res.ok()).toBe(true);
  const xml = await res.text();

  const paths = [...xml.matchAll(/<loc>([^<]*\/blog\/[^<]+\/)<\/loc>/g)]
    .map((m) => new URL(m[1]).pathname)
    // Drop the two listing pages; only article details carry a BlogPosting.
    .filter((p) => !/\/blog\/$/.test(p));
  expect(paths.length, "article URLs in the sitemap").toBe(14);

  for (const path of paths) {
    await page.goto(path);
    const posting = nodeOfType(await jsonLdNodes(page), "BlogPosting");
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
