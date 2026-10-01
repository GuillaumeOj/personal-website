import { describe, expect, it } from "vitest";
import { articleAlternates, prefixAlternates } from "../../src/lib/alternates";

describe("articleAlternates", () => {
  it("pairs the translated (differing) slugs from the FR side", () => {
    expect(
      articleAlternates({
        locale: "fr",
        slug: "mon-parcours-qui-je-suis",
        siblingSlug: "my-journey-who-i-am",
      }),
    ).toEqual({
      alternates: {
        fr: "/blog/mon-parcours-qui-je-suis/",
        en: "/en/blog/my-journey-who-i-am/",
      },
      paired: true,
    });
  });

  it("produces the same pair from the EN side", () => {
    const fromEn = articleAlternates({
      locale: "en",
      slug: "my-journey-who-i-am",
      siblingSlug: "mon-parcours-qui-je-suis",
    });
    const fromFr = articleAlternates({
      locale: "fr",
      slug: "mon-parcours-qui-je-suis",
      siblingSlug: "my-journey-who-i-am",
    });
    // hreflang must be symmetric, or the two pages disagree about each other.
    expect(fromEn).toEqual(fromFr);
  });

  /**
   * No published article is currently sibling-less, so this branch has no
   * fixture in the built site — it used to be covered by a mock post and is
   * asserted here instead.
   */
  it("is unpaired, switching to the other blog index, without a sibling", () => {
    expect(articleAlternates({ locale: "fr", slug: "orphelin" })).toEqual({
      alternates: { fr: "/blog/orphelin/", en: "/en/blog/" },
      paired: false,
    });
  });
});

describe("prefixAlternates", () => {
  it("swaps the /en prefix on same-slug pages", () => {
    const pair = { fr: "/services/", en: "/en/services/" };
    expect(prefixAlternates("fr", "/services/")).toEqual(pair);
    expect(prefixAlternates("en", "/en/services/")).toEqual(pair);
    expect(prefixAlternates("en", "/en/")).toEqual({ fr: "/", en: "/en/" });
  });

  it("only strips a whole /en segment", () => {
    expect(prefixAlternates("fr", "/engagement/").en).toBe("/en/engagement/");
  });
});
