import { describe, expect, it } from "vitest";
import { SITE } from "../../src/config";
import { aboutJsonLd } from "../../src/lib/about";
import {
  BUSINESS_ID,
  blogPostJsonLd,
  type Crumb,
  homeJsonLd,
  PERSON_ID,
  personNode,
  professionalServiceNode,
  projectJsonLd,
  WEBSITE_ID,
  websiteNode,
} from "../../src/lib/schema";

const IMG = "https://guillaume.ojardias.info/portrait.jpg";

/** Find the first node of a given @type in a JSON-LD `@graph`. */
// biome-ignore lint/suspicious/noExplicitAny: JSON-LD nodes are heterogeneous.
const nodeOfType = (graph: any[], type: string) =>
  // biome-ignore lint/suspicious/noExplicitAny: see above.
  graph.find((n: any) => n["@type"] === type);

/** The first node of a graph (BlogPosting / CreativeWork), typed loosely so
 *  tests can read the heterogeneous JSON-LD without union narrowing. */
// biome-ignore lint/suspicious/noExplicitAny: JSON-LD nodes are heterogeneous.
const firstNode = (jsonLd: { "@graph": any[] }): any => jsonLd["@graph"][0];

const crumbs: Crumb[] = [
  { name: "Home", url: `${SITE.url}/` },
  { name: "Blog", url: `${SITE.url}/blog/` },
];

// Finding 1 — one `@id` must resolve to one `url`.
describe("personNode.url (x-default consolidation)", () => {
  it("is identical across fr and en", () => {
    expect(personNode("fr", IMG).url).toBe(personNode("en", IMG).url);
  });

  it("is pinned to the canonical root (never the /en/ variant)", () => {
    expect(personNode("en", IMG).url).toBe(`${SITE.url}/`);
    expect(personNode("en", IMG).url.endsWith("/en/")).toBe(false);
  });

  it("keeps jobTitle locale-varying", () => {
    expect(personNode("fr", IMG).jobTitle).not.toBe(
      personNode("en", IMG).jobTitle,
    );
  });
});

// Finding 2 — WebSite.url must be the canonical trailing-slash form.
describe("websiteNode.url", () => {
  it("ends with a trailing slash", () => {
    expect(websiteNode("fr").url.endsWith("/")).toBe(true);
    expect(websiteNode("en").url.endsWith("/")).toBe(true);
  });

  it("is the canonical root, not the bare SITE.url", () => {
    expect(websiteNode("fr").url).toBe(`${SITE.url}/`);
    expect(websiteNode("fr").url).not.toBe(SITE.url);
  });
});

// Finding 3 — the home graph must carry the local-business entity.
describe("homeJsonLd graph", () => {
  it("contains a ProfessionalService node with BUSINESS_ID", () => {
    const service = nodeOfType(
      homeJsonLd("fr", IMG)["@graph"],
      "ProfessionalService",
    );
    expect(service).toBeDefined();
    expect(service["@id"]).toBe(BUSINESS_ID);
    expect(service.provider["@id"]).toBe(PERSON_ID);
  });

  it("still carries WebSite + Person (no regression)", () => {
    const graph = homeJsonLd("en", IMG)["@graph"];
    expect(nodeOfType(graph, "WebSite")["@id"]).toBe(WEBSITE_ID);
    expect(nodeOfType(graph, "Person")["@id"]).toBe(PERSON_ID);
  });
});

// Finding 4 — publisher/author must resolve a name off the home page.
describe("blogPostJsonLd publisher & author", () => {
  const base = {
    url: `${SITE.url}/blog/post/`,
    title: "T",
    description: "D",
    datePublished: "2025-01-01",
    breadcrumbs: crumbs,
  };

  it("publisher inlines a named Person", () => {
    const posting = firstNode(blogPostJsonLd("fr", base));
    expect(posting.publisher["@type"]).toBe("Person");
    expect(posting.publisher["@id"]).toBe(PERSON_ID);
    expect(posting.publisher.name).toBe(SITE.name);
  });

  it("author falls back to a named Person when authorName is omitted", () => {
    const posting = firstNode(blogPostJsonLd("fr", base));
    expect(posting.author["@type"]).toBe("Person");
    expect(posting.author["@id"]).toBe(PERSON_ID);
    expect(posting.author.name).toBe(SITE.name);
  });

  it("uses the explicit authorName when provided", () => {
    const posting = firstNode(
      blogPostJsonLd("fr", { ...base, authorName: "Jane Doe" }),
    );
    expect(posting.author.name).toBe("Jane Doe");
  });
});

// Finding 5 — mobile apps are SoftwareApplication; brochure sites stay CreativeWork.
describe("projectJsonLd type & datePublished", () => {
  const base = {
    url: `${SITE.url}/projects/x/`,
    name: "X",
    description: "D",
    image: IMG,
    keywords: ["Django"],
    breadcrumbs: crumbs,
  };

  it("emits SoftwareApplication when platform includes 'mobile'", () => {
    const work = firstNode(
      projectJsonLd("fr", {
        ...base,
        platform: ["mobile"],
        datePublished: "2024-01-01",
      }),
    );
    expect(work["@type"]).toBe("SoftwareApplication");
    expect(work.operatingSystem).toBe("iOS, Android");
    expect(work.applicationCategory).toBeTruthy();
    expect(work.datePublished).toBe("2024-01-01");
    // Keeps the CreativeWork properties.
    expect(work.creator["@id"]).toBe(PERSON_ID);
    expect(work.keywords).toEqual(["Django"]);
  });

  it("emits CreativeWork by default (no platform)", () => {
    const work = firstNode(projectJsonLd("fr", base));
    expect(work["@type"]).toBe("CreativeWork");
  });

  it("emits CreativeWork for a non-mobile platform", () => {
    const work = firstNode(projectJsonLd("fr", { ...base, platform: ["web"] }));
    expect(work["@type"]).toBe("CreativeWork");
  });

  it("omits datePublished when not passed", () => {
    const work = firstNode(projectJsonLd("fr", base));
    expect("datePublished" in work).toBe(false);
  });

  it("does not fabricate an aggregateRating", () => {
    const work = firstNode(
      projectJsonLd("fr", { ...base, platform: ["mobile"] }),
    );
    expect("aggregateRating" in work).toBe(false);
  });
});

// Finding 6 — About was the last content page missing a breadcrumb.
describe("aboutJsonLd graph", () => {
  it("includes a BreadcrumbList (Home › About)", () => {
    const bc = nodeOfType(aboutJsonLd("fr", IMG)["@graph"], "BreadcrumbList");
    expect(bc).toBeDefined();
    expect(bc.itemListElement).toHaveLength(2);
    expect(
      bc.itemListElement.map((i: { position: number }) => i.position),
    ).toEqual([1, 2]);
  });

  it("still carries Person, ProfessionalService and AboutPage", () => {
    const graph = aboutJsonLd("en", IMG)["@graph"];
    expect(nodeOfType(graph, "Person")).toBeDefined();
    expect(nodeOfType(graph, "ProfessionalService")).toBeDefined();
    expect(nodeOfType(graph, "AboutPage")).toBeDefined();
  });
});

// Finding 7 — knowsAbout is a Person property; the service must not duplicate it.
describe("knowsAbout deduplication", () => {
  it("is absent from the shared ProfessionalService node", () => {
    expect("knowsAbout" in professionalServiceNode()).toBe(false);
  });

  it("is absent from the About ProfessionalService node", () => {
    const service = nodeOfType(
      aboutJsonLd("fr", IMG)["@graph"],
      "ProfessionalService",
    );
    expect("knowsAbout" in service).toBe(false);
  });

  it("remains on the Person node", () => {
    expect(Array.isArray(personNode("fr", IMG).knowsAbout)).toBe(true);
    expect(personNode("fr", IMG).knowsAbout.length).toBeGreaterThan(0);
  });
});

// Finding 8 — the experience timeline gets a structured-data view.
describe("Person.hasOccupation", () => {
  it("is a non-empty array of Occupation nodes", () => {
    const occ = personNode("fr", IMG).hasOccupation;
    expect(Array.isArray(occ)).toBe(true);
    expect(occ.length).toBeGreaterThan(0);
    for (const o of occ) {
      expect(o["@type"]).toBe("Occupation");
      expect(o.name).toBeTruthy();
    }
  });

  it("carries ISO start/end dates for a past role", () => {
    const occ = personNode("en", IMG).hasOccupation;
    const dated = occ.find((o: { startDate?: string }) => o.startDate);
    expect(dated).toBeDefined();
    expect(dated?.startDate).toMatch(/^\d{4}-\d{2}$/);
  });

  it("localizes the occupation name", () => {
    expect(personNode("fr", IMG).hasOccupation[0].name).not.toBe(
      personNode("en", IMG).hasOccupation[0].name,
    );
  });
});

// Already-solid — the @id consolidation must not regress.
describe("@id consolidation (regression guard)", () => {
  it("PERSON_ID / BUSINESS_ID / WEBSITE_ID are stable absolute IRIs", () => {
    expect(PERSON_ID).toBe(`${SITE.url}/#person`);
    expect(BUSINESS_ID).toBe(`${SITE.url}/#business`);
    expect(WEBSITE_ID).toBe(`${SITE.url}/#website`);
  });

  it("every reference points at the same Person @id", () => {
    expect(personNode("fr", IMG)["@id"]).toBe(PERSON_ID);
    expect(personNode("en", IMG)["@id"]).toBe(PERSON_ID);
    expect(websiteNode("fr").publisher["@id"]).toBe(PERSON_ID);
    expect(professionalServiceNode().provider["@id"]).toBe(PERSON_ID);
  });
});
