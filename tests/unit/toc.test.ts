import type { MarkdownHeading } from "astro";
import { describe, expect, it } from "vitest";
import { tocFromHeadings } from "../../src/lib/toc";

const h = (depth: number, slug: string, text: string): MarkdownHeading => ({
  depth,
  slug,
  text,
});

describe("tocFromHeadings", () => {
  it("keeps only h2, in document order, mapping slug → id", () => {
    expect(
      tocFromHeadings([
        h(2, "premier", "Premier"),
        h(3, "sous-section", "Sous-section"),
        h(2, "second", "Second"),
        h(4, "detail", "Détail"),
      ]),
    ).toEqual([
      { id: "premier", text: "Premier" },
      { id: "second", text: "Second" },
    ]);
  });

  it("returns an empty list when an article has no h2", () => {
    expect(tocFromHeadings([])).toEqual([]);
    expect(tocFromHeadings([h(3, "only-h3", "Only h3")])).toEqual([]);
  });

  it("preserves accented slugs verbatim", () => {
    // Astro slugs with github-slugger, which keeps diacritics. The rail links to
    // `#cote-serveur…` only if we pass the slug straight through.
    expect(tocFromHeadings([h(2, "côté-serveur", "Côté serveur")])).toEqual([
      { id: "côté-serveur", text: "Côté serveur" },
    ]);
  });
});
