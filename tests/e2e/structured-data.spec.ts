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
const BUSINESS_ID = `${ORIGIN}/#business`;
const WEBSITE_ID = `${ORIGIN}/#website`;
const SITE_NAME = "Guillaume Ojardias";
const EMAIL = "contact@ojardias.me";
// The Person job-title strings — semantically wrong as a ProfessionalService
// serviceType, so they must never appear there (the real service array does).
const JOB_TITLES = [
  "Développeur web & mobile freelance",
  "Freelance web & mobile developer",
];
const SERVICE_TYPES = [
  "Mobile app development",
  "Web development",
  "SaaS development",
];

/** The `url`/`item` of every crumb in a BreadcrumbList node. */
const crumbUrls = (crumbs: LdNode): string[] =>
  (crumbs.itemListElement as { item: string }[]).map((c) => c.item);

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
  await page.goto("/blog/mon-parcours-qui-je-suis/");
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

// A web project stays a CreativeWork; a shipped mobile app (Fusily) is emitted
// as SoftwareApplication instead — that branch is covered in
// `blog-jsonld-image.spec.ts`. Here we pin the CreativeWork path on dotcraft.
test("project detail: CreativeWork + breadcrumb, live URL as sameAs", async ({
  page,
}) => {
  await page.goto("/projects/dotcraft/");
  const nodes = await jsonLdNodes(page);
  const work = nodeOfType(nodes, "CreativeWork");
  expect(refId(work, "creator")).toBe(PERSON_ID);
  // dotcraft is public — its live URL is linked.
  expect(work.sameAs).toBe("https://dotcraft.fr");
  nodeOfType(nodes, "BreadcrumbList");
});

// T1 — the services ProfessionalService is the *same* canonical #business
// entity as About (shared @id, name, address, WebSite), not a second businessless
// local business competing with it.
for (const path of ["/services/", "/en/services/"]) {
  test(`services (${path}): ProfessionalService merges into #business`, async ({
    page,
  }) => {
    await page.goto(path);
    const nodes = await jsonLdNodes(page);
    const service = nodeOfType(nodes, "ProfessionalService");
    expect(service["@id"]).toBe(BUSINESS_ID);
    expect(service.name).toBe(SITE_NAME);
    const address = service.address as {
      "@type": string;
      addressLocality: string;
    };
    expect(address["@type"]).toBe("PostalAddress");
    expect(address.addressLocality).toBe("Lyon");
    expect(refId(service, "isPartOf")).toBe(WEBSITE_ID);
    // The FAQPage is also anchored to the WebSite.
    const faq = nodeOfType(nodes, "FAQPage");
    expect(refId(faq, "isPartOf")).toBe(WEBSITE_ID);
    // Exactly one ProfessionalService — no second, businessless node.
    const services = nodes.filter((n) => n["@type"] === "ProfessionalService");
    expect(services.length).toBe(1);
    // The page also carries a BreadcrumbList (Home › Services), mirroring the
    // visible trail.
    const crumbs = nodeOfType(nodes, "BreadcrumbList");
    expect((crumbs.itemListElement as unknown[]).length).toBe(2);
  });
}

// T2 — the shared #business ProfessionalService is enriched with NAP (email)
// and a coarse priceRange, and reads consistently from either page that defines
// it (About, Services). Its serviceType is the real service array, never a
// person's job-title string.
for (const path of ["/about/", "/en/about/", "/services/", "/en/services/"]) {
  test(`business (${path}): email + priceRange, correct serviceType`, async ({
    page,
  }) => {
    await page.goto(path);
    const nodes = await jsonLdNodes(page);

    // Exactly one ProfessionalService, and it's the shared #business entity.
    const services = nodes.filter((n) => n["@type"] === "ProfessionalService");
    expect(services.length).toBe(1);
    const business = services[0];
    expect(business["@id"]).toBe(BUSINESS_ID);

    // NAP + coarse price band, consistent from either page.
    expect(business.email).toBe(EMAIL);
    expect(business.priceRange).toBeTruthy();

    // serviceType is never the person's job-title marketing string.
    expect(JOB_TITLES).not.toContain(business.serviceType);
  });
}

// The correct serviceType array lives on the Services node (the About node
// carries none — a person's job title doesn't belong on a service).
for (const path of ["/services/", "/en/services/"]) {
  test(`business (${path}): serviceType is the service array`, async ({
    page,
  }) => {
    await page.goto(path);
    const service = nodeOfType(await jsonLdNodes(page), "ProfessionalService");
    expect(service.serviceType).toEqual(SERVICE_TYPES);
  });
}

// About's #business is anchored to the WebSite (parity with the Services node),
// and the Person node on the same page exposes the public email.
for (const path of ["/about/", "/en/about/"]) {
  test(`about (${path}): #business isPartOf WebSite, Person has email`, async ({
    page,
  }) => {
    await page.goto(path);
    const nodes = await jsonLdNodes(page);
    const business = nodeOfType(nodes, "ProfessionalService");
    expect(refId(business, "isPartOf")).toBe(WEBSITE_ID);
    const person = nodeOfType(nodes, "Person");
    expect(person.email).toBe(EMAIL);
  });
}

// T3 — the `#person` node is a single consolidated entity: its `url` is the
// x-default root on BOTH locales (not the per-locale `/en/`), so one `@id`
// never resolves to two different `url` values (SEO audit finding #2).
test("Person url is the x-default root, identical across locales", async ({
  page,
}) => {
  await page.goto("/");
  const frPerson = nodeOfType(await jsonLdNodes(page), "Person");
  expect(frPerson.url).toBe(`${ORIGIN}/`);
  await page.goto("/en/");
  const enPerson = nodeOfType(await jsonLdNodes(page), "Person");
  expect(enPerson.url).toBe(`${ORIGIN}/`);
});

for (const path of ["/about/", "/en/about/"]) {
  test(`about (${path}): AboutPage @id and url end with '/'`, async ({
    page,
  }) => {
    await page.goto(path);
    const about = nodeOfType(await jsonLdNodes(page), "AboutPage");
    expect(String(about["@id"]).endsWith("/")).toBe(true);
    expect(String(about.url).endsWith("/")).toBe(true);
  });
}

for (const path of ["/blog/mon-parcours-qui-je-suis/", "/projects/fusily/"]) {
  test(`breadcrumbs (${path}): every crumb URL ends with '/'`, async ({
    page,
  }) => {
    await page.goto(path);
    const crumbs = nodeOfType(await jsonLdNodes(page), "BreadcrumbList");
    for (const url of crumbUrls(crumbs)) {
      expect(url.endsWith("/"), url).toBe(true);
    }
  });
}

// T6 — the projects/blog hubs carry a minimal CollectionPage + breadcrumb.
for (const path of ["/projects/", "/blog/", "/en/projects/"]) {
  test(`hub (${path}): CollectionPage + 2-item breadcrumb`, async ({
    page,
  }) => {
    await page.goto(path);
    const nodes = await jsonLdNodes(page);
    const collection = nodeOfType(nodes, "CollectionPage");
    expect(refId(collection, "isPartOf")).toBe(WEBSITE_ID);
    const crumbs = nodeOfType(nodes, "BreadcrumbList");
    const urls = crumbUrls(crumbs);
    expect(urls.length).toBe(2);
    for (const url of urls) {
      expect(url.endsWith("/"), url).toBe(true);
    }
  });
}

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
