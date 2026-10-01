import { describe, expect, it } from "vitest";
import { SITE } from "../../src/config";
import { isIndexable, lastmodByPath } from "../../src/lib/sitemap";

describe("isIndexable", () => {
  it("drops the noindex legal pages and contact outcomes", () => {
    for (const path of [
      "/legal-notice/",
      "/en/privacy-policy/",
      "/terms-of-service/",
      "/en/accessibility/",
      "/contact/thanks/",
      "/en/contact/error/",
    ]) {
      expect(isIndexable(`${SITE.url}${path}`), path).toBe(false);
    }
  });

  it("keeps content pages, the contact forms included", () => {
    for (const path of ["/", "/services/", "/contact/", "/contact/quote/"]) {
      expect(isIndexable(`${SITE.url}${path}`), path).toBe(true);
    }
  });
});

describe("lastmodByPath", () => {
  const lastmods = lastmodByPath([
    { lang: "fr", slug: "ancien", pubDate: new Date("2026-01-01") },
    {
      lang: "fr",
      slug: "mis-a-jour",
      pubDate: new Date("2026-02-01"),
      updatedDate: new Date("2026-04-01"),
    },
    { lang: "en", slug: "only", pubDate: new Date("2026-03-01") },
  ]);

  it("dates each article by its update, else its publication", () => {
    expect(lastmods.get("/blog/ancien/")).toBe("2026-01-01T00:00:00.000Z");
    expect(lastmods.get("/blog/mis-a-jour/")).toBe("2026-04-01T00:00:00.000Z");
    expect(lastmods.get("/en/blog/only/")).toBe("2026-03-01T00:00:00.000Z");
  });

  it("dates each blog index by its newest post, per locale", () => {
    expect(lastmods.get("/blog/")).toBe("2026-04-01T00:00:00.000Z");
    expect(lastmods.get("/en/blog/")).toBe("2026-03-01T00:00:00.000Z");
  });

  it("gives other pages no date", () => {
    expect(lastmods.has("/")).toBe(false);
    expect(lastmods.has("/services/")).toBe(false);
  });
});
