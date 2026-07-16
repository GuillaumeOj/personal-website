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

// Every BlogPosting must carry a non-empty `image`, whether the post has a cover
// or not — the cover-less path resolves a landscape fallback card rather than
// dropping the key. (og:image already always falls back; the structured data now
// matches.)
for (const path of ["/blog/pourquoi-astro/", "/blog/tailwind-sans-cover/"]) {
  test(`BlogPosting (${path}) always has an image`, async ({ page }) => {
    await page.goto(path);
    const posting = nodeOfType(await jsonLdNodes(page), "BlogPosting");
    expect(typeof posting.image).toBe("string");
    expect(posting.image as string).not.toBe("");
  });
}

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
