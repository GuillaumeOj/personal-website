import { describe, expect, it } from "vitest";
import { localizedPath, otherLocale, t } from "../../src/i18n/ui";

describe("t", () => {
  it("returns the translation in the requested locale", () => {
    expect(t("fr", "nav.projects")).toBe("Projets");
    expect(t("en", "nav.projects")).toBe("Projects");
  });

  it("returns the same key for both locales", () => {
    expect(t("fr", "blog.title")).toBeTruthy();
    expect(t("en", "blog.title")).toBeTruthy();
  });
});

// T3 — the end-of-article blog CTA strings exist and are non-empty in both
// locales (the layout renders them under every post).
describe("blog CTA translations", () => {
  const keys = [
    "blog.cta.bio",
    "blog.cta.heading",
    "blog.cta.lead",
    "blog.cta.primary",
    "blog.cta.secondary",
  ] as const;

  for (const key of keys) {
    it(`${key} is non-empty in fr and en`, () => {
      expect(t("fr", key).trim().length).toBeGreaterThan(0);
      expect(t("en", key).trim().length).toBeGreaterThan(0);
    });
  }

  it("the author bio carries the local positioning once, in each language", () => {
    expect(t("fr", "blog.cta.bio")).toContain(
      "développeur web & mobile freelance à Lyon",
    );
    expect(t("en", "blog.cta.bio")).toContain(
      "freelance web & mobile developer in Lyon",
    );
  });
});

describe("otherLocale", () => {
  it("flips fr to en and vice versa", () => {
    expect(otherLocale("fr")).toBe("en");
    expect(otherLocale("en")).toBe("fr");
  });
});

describe("localizedPath", () => {
  it("keeps fr paths unchanged (default locale)", () => {
    expect(localizedPath("fr", "/blog")).toBe("/blog");
    expect(localizedPath("fr", "/")).toBe("/");
  });

  it("prefixes en paths with /en", () => {
    expect(localizedPath("en", "/blog")).toBe("/en/blog");
    expect(localizedPath("en", "/")).toBe("/en");
  });

  it("normalizes paths missing a leading slash", () => {
    expect(localizedPath("fr", "blog")).toBe("/blog");
    expect(localizedPath("en", "blog")).toBe("/en/blog");
  });
});
