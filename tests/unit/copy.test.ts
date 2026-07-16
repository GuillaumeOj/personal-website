import { describe, expect, it } from "vitest";
import { t } from "../../src/i18n/ui";

// SEO copy guards for the fixes in the round-2 audit: a broken FR projects
// sentence, stack-list meta descriptions, and missing local intent ("Lyon").

describe("meta.projectsDescription (FR broken-sentence fix)", () => {
  const fr = t("fr", "meta.projectsDescription");

  it("does not trail off on an ellipsis", () => {
    expect(fr.endsWith("…")).toBe(false);
    expect(fr.endsWith("...")).toBe(false);
  });

  it("ends on sentence-final punctuation", () => {
    expect(/[.!?]$/.test(fr.trim())).toBe(true);
  });
});

describe("hub meta descriptions (benefit-led + local intent)", () => {
  const homeAndBlog = ["meta.homeDescription", "meta.blogDescription"] as const;

  for (const locale of ["fr", "en"] as const) {
    for (const key of homeAndBlog) {
      it(`${key} (${locale}) mentions Lyon and is ≤160 chars`, () => {
        const value = t(locale, key);
        expect(value).toContain("Lyon");
        expect(value.length).toBeLessThanOrEqual(160);
      });
    }
  }
});

describe("visible hub subtitles carry local intent", () => {
  for (const locale of ["fr", "en"] as const) {
    it(`projects.subtitle (${locale}) mentions Lyon`, () => {
      expect(t(locale, "projects.subtitle")).toContain("Lyon");
    });
    it(`blog.subtitle (${locale}) mentions Lyon`, () => {
      expect(t(locale, "blog.subtitle")).toContain("Lyon");
    });
  }
});

describe("nav aria-label key", () => {
  it("nav.mainNav is defined in both locales", () => {
    expect(t("fr", "nav.mainNav")).toBe("Navigation principale");
    expect(t("en", "nav.mainNav")).toBe("Main navigation");
  });
});
