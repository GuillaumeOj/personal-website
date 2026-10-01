import { expect, test } from "@playwright/test";
import { BUSINESS_ID, PERSON_ID, WEBSITE_ID } from "../../src/lib/schema";
import {
  HUBS,
  jsonLdNodes,
  type LdNode,
  metaContent,
  nodeOfType,
  ORIGIN,
  SAMPLE_ARTICLE,
} from "./helpers";

// Wiring only: each page renders the right graph and its nodes reference the
// shared entities by @id. The node properties themselves (offers, email,
// priceRange, Person url, dropped LocalBusiness keys…) are unit-tested against
// the builders in tests/unit/schema-graph.test.ts. Each page loads once.

/** The `@id` a node's reference property points at, e.g. `publisher`. */
const refId = (node: LdNode, key: string) =>
  (node[key] as { "@id": string })["@id"];

/** The `item` URL of every crumb in a BreadcrumbList node. */
const crumbUrls = (crumbs: LdNode): string[] =>
  (crumbs.itemListElement as { item: string }[]).map((c) => c.item);

/** A breadcrumb trail of `length` crumbs, every URL in canonical slash form. */
function expectCrumbs(nodes: LdNode[], length: number) {
  const urls = crumbUrls(nodeOfType(nodes, "BreadcrumbList"));
  expect(urls.length).toBe(length);
  for (const url of urls) expect(url.endsWith("/"), url).toBe(true);
}

/**
 * Exactly one ProfessionalService, and it is the shared #business entity
 * founded by the Person (never a second, businessless local business).
 */
function expectSharedBusiness(nodes: LdNode[]) {
  const services = nodes.filter((n) => n["@type"] === "ProfessionalService");
  expect(services.length).toBe(1);
  expect(services[0]["@id"]).toBe(BUSINESS_ID);
  expect(refId(services[0], "founder")).toBe(PERSON_ID);
}

for (const path of ["/", "/en/"]) {
  test(`home (${path}): WebSite + Person + #business by @id`, async ({
    page,
  }) => {
    await page.goto(path);
    const nodes = await jsonLdNodes(page);
    expect(nodeOfType(nodes, "Person")["@id"]).toBe(PERSON_ID);
    expect(refId(nodeOfType(nodes, "WebSite"), "publisher")).toBe(PERSON_ID);
    expectSharedBusiness(nodes);
  });
}

for (const path of ["/services/", "/en/services/"]) {
  test(`services (${path}): #business, FAQPage and Home › Services`, async ({
    page,
  }) => {
    await page.goto(path);
    const nodes = await jsonLdNodes(page);
    expectSharedBusiness(nodes);
    expect(refId(nodeOfType(nodes, "FAQPage"), "isPartOf")).toBe(WEBSITE_ID);
    expectCrumbs(nodes, 2);
  });
}

for (const path of ["/about/", "/en/about/"]) {
  test(`about (${path}): AboutPage, Person, #business and Home › About`, async ({
    page,
  }) => {
    await page.goto(path);
    const nodes = await jsonLdNodes(page);
    expectSharedBusiness(nodes);
    nodeOfType(nodes, "Person");
    const about = nodeOfType(nodes, "AboutPage");
    expect(about.url).toBe(`${ORIGIN}${path}`);
    expect(refId(about, "about")).toBe(PERSON_ID);
    expectCrumbs(nodes, 2);
  });
}

// T6 — the section indexes carry a minimal CollectionPage + breadcrumb.
for (const { path } of HUBS.filter((h) => !h.path.includes("services"))) {
  test(`hub (${path}): CollectionPage + Home › Hub`, async ({ page }) => {
    await page.goto(path);
    const nodes = await jsonLdNodes(page);
    expect(refId(nodeOfType(nodes, "CollectionPage"), "isPartOf")).toBe(
      WEBSITE_ID,
    );
    expectCrumbs(nodes, 2);
  });
}

test("blog post: article og:type + BlogPosting + breadcrumb", async ({
  page,
}) => {
  await page.goto(SAMPLE_ARTICLE.fr);
  expect(await metaContent(page, 'meta[property="og:type"]')).toBe("article");
  const published = await metaContent(
    page,
    'meta[property="article:published_time"]',
  );
  expect(Number.isNaN(Date.parse(published ?? ""))).toBe(false);

  const nodes = await jsonLdNodes(page);
  const posting = nodeOfType(nodes, "BlogPosting");
  expect(posting.datePublished).toBe(published);
  expect(refId(posting, "publisher")).toBe(PERSON_ID);
  expectCrumbs(nodes, 3);
});

// A web project stays a CreativeWork; a shipped mobile app (Fusily) is emitted
// as SoftwareApplication instead — that branch is covered in
// `blog-jsonld-image.spec.ts`.
test("project detail: CreativeWork + breadcrumb, live URL as sameAs", async ({
  page,
}) => {
  await page.goto("/projects/dotcraft/");
  const nodes = await jsonLdNodes(page);
  const work = nodeOfType(nodes, "CreativeWork");
  expect(refId(work, "creator")).toBe(PERSON_ID);
  expect(work.sameAs).toBe("https://dotcraft.fr");
  expectCrumbs(nodes, 3);
});

test("legal pages are noindex, follow", async ({ page }) => {
  for (const path of [
    "/legal-notice/",
    "/privacy-policy/",
    "/terms-of-service/",
    "/en/legal-notice/",
    "/en/privacy-policy/",
    "/en/terms-of-service/",
    "/accessibility/",
    "/en/accessibility/",
  ]) {
    await page.goto(path);
    expect(await metaContent(page, 'meta[name="robots"]')).toBe(
      "noindex, follow",
    );
  }
});

test("English legal pages state that the French version prevails", async ({
  page,
}) => {
  const notice = "the French version prevails";
  for (const path of [
    "/en/legal-notice/",
    "/en/privacy-policy/",
    "/en/terms-of-service/",
  ]) {
    await page.goto(path);
    await expect(page.locator("main")).toContainText(notice);
  }
  for (const path of [
    "/legal-notice/",
    "/privacy-policy/",
    "/terms-of-service/",
    "/en/accessibility/",
  ]) {
    await page.goto(path);
    await expect(page.locator("main")).not.toContainText(notice);
  }
});

test("legal notice links to the localized privacy policy", async ({ page }) => {
  for (const [path, privacy] of [
    ["/legal-notice/", "/privacy-policy/"],
    ["/en/legal-notice/", "/en/privacy-policy/"],
  ]) {
    await page.goto(path);
    await page.locator(`main a[href="${privacy}"]`).click();
    await expect(page).toHaveURL(new RegExp(`${privacy}$`));
  }
});

// Audit L12: a voluntary accessibility statement, linked from every footer.
for (const [path, from, heading] of [
  ["/accessibility/", "/", "Déclaration d’accessibilité"],
  ["/en/accessibility/", "/en/", "Accessibility statement"],
] as const) {
  test(`${path}: accessibility statement, linked from the footer`, async ({
    page,
  }) => {
    await page.goto(from);
    await page.locator(`footer a[href="${path}"]`).click();
    await expect(page).toHaveURL(new RegExp(`${path}$`));
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(heading);
    await expect(page.getByText("WCAG 2.2")).toBeVisible();
  });
}
