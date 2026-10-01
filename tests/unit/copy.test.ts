import { describe, expect, it } from "vitest";
import { t } from "../../src/i18n/ui";
import { faq, servicesMeta } from "../../src/lib/services";

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

describe("services FAQ states the B2B scope (audit L6)", () => {
  const [first] = faq.items;

  it("opens with who the services are for", () => {
    expect(first.a.fr).toContain("professionnels");
    expect(first.a.fr).toContain("dans le cadre de leur activité");
    expect(first.a.en).toContain("businesses");
  });
});

// Audit E7: the services page targets the local query in both languages.
describe("services meta (local intent)", () => {
  for (const locale of ["fr", "en"] as const) {
    it(`${locale}: title ≤ 60 with Lyon + freelance, description with Lyon`, () => {
      const { title, description } = servicesMeta;
      expect(title[locale].length).toBeLessThanOrEqual(60);
      expect(title[locale]).toMatch(/Lyon/);
      expect(title[locale].toLowerCase()).toContain("freelance");
      expect(description[locale]).toMatch(/Lyon/);
      expect(description[locale].length).toBeLessThanOrEqual(160);
    });
  }
});
