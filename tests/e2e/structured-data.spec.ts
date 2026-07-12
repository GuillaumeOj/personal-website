import { expect, type Page, test } from "@playwright/test";

const ORIGIN = "https://guillaume.ojardias.info";

interface LdNode {
  "@type": string;
  [key: string]: unknown;
}

// Parse every JSON-LD block on the page and return the flattened list of nodes
// (each `@graph` is spread), so a test can assert a node of a given `@type`
// exists without caring how the graphs are split across <script> tags.
async function jsonLdNodes(page: Page): Promise<LdNode[]> {
  const blocks = await page
    .locator('head script[type="application/ld+json"]')
    .allTextContents();
  return blocks.flatMap((raw) => {
    const parsed = JSON.parse(raw);
    return (parsed["@graph"] ?? [parsed]) as LdNode[];
  });
}

// Find a node by `@type`, asserting it exists (so callers get a non-optional
// value and can index into it without unsafe optional chaining).
function nodeOfType(nodes: LdNode[], type: string): LdNode {
  const node = nodes.find((n) => n["@type"] === type);
  expect(node, `expected a ${type} JSON-LD node`).toBeTruthy();
  return node as LdNode;
}

/** The `@id` a node's reference property points at, e.g. `publisher`. */
const refId = (node: LdNode, key: string) =>
  (node[key] as { "@id": string })["@id"];

const metaContent = (page: Page, selector: string) =>
  page.locator(`head ${selector}`).getAttribute("content");

const PERSON_ID = `${ORIGIN}/#person`;

test("home: WebSite + Person graph, cross-referenced by @id", async ({
  page,
}) => {
  await page.goto("/");
  const nodes = await jsonLdNodes(page);
  const website = nodeOfType(nodes, "WebSite");
  const person = nodeOfType(nodes, "Person");
  // The Person owns the canonical `#person` @id reused site-wide; WebSite is
  // published by that same entity.
  expect(person["@id"]).toBe(PERSON_ID);
  expect(refId(website, "publisher")).toBe(PERSON_ID);
});

test("blog post: article og:type + BlogPosting + breadcrumb", async ({
  page,
}) => {
  await page.goto("/blog/pourquoi-astro/");
  expect(await metaContent(page, 'meta[property="og:type"]')).toBe("article");
  // article:published_time is a valid ISO date.
  const published = await metaContent(
    page,
    'meta[property="article:published_time"]',
  );
  expect(published).toBeTruthy();
  expect(Number.isNaN(Date.parse(published as string))).toBe(false);

  const nodes = await jsonLdNodes(page);
  const posting = nodeOfType(nodes, "BlogPosting");
  expect(posting.datePublished).toBe(published);
  // publisher is the shared site Person; breadcrumb is Home › Blog › post.
  expect(refId(posting, "publisher")).toBe(PERSON_ID);
  const crumbs = nodeOfType(nodes, "BreadcrumbList");
  expect((crumbs.itemListElement as unknown[]).length).toBe(3);
});

test("project detail: CreativeWork + breadcrumb, live URL as sameAs", async ({
  page,
}) => {
  await page.goto("/projects/fusily/");
  const nodes = await jsonLdNodes(page);
  const work = nodeOfType(nodes, "CreativeWork");
  expect(refId(work, "creator")).toBe(PERSON_ID);
  // Fusily is public — its live URL is linked.
  expect(work.sameAs).toBe("https://fusily.com");
  nodeOfType(nodes, "BreadcrumbList");
});

test("legal pages are noindex, follow", async ({ page }) => {
  for (const path of [
    "/legal-notice/",
    "/privacy-policy/",
    "/en/legal-notice/",
    "/en/privacy-policy/",
  ]) {
    await page.goto(path);
    expect(await metaContent(page, 'meta[name="robots"]')).toBe(
      "noindex, follow",
    );
  }
});
