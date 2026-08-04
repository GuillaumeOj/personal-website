import { describe, expect, it } from "vitest";
import { articleAlternates } from "../../src/lib/alternates";

const ORIGIN = "https://guillaume.ojardias.info";

describe("articleAlternates", () => {
  it("pairs the translated (differing) slugs from the FR side", () => {
    expect(
      articleAlternates({
        locale: "fr",
        slug: "mon-parcours-qui-je-suis",
        siblingSlug: "my-journey-who-i-am",
      }),
    ).toEqual({
      altFrUrl: `${ORIGIN}/blog/mon-parcours-qui-je-suis/`,
      altEnUrl: `${ORIGIN}/en/blog/my-journey-who-i-am/`,
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
  it("emits no alternates when the sibling is unpublished", () => {
    expect(articleAlternates({ locale: "fr", slug: "orphelin" })).toEqual({});
  });
});
