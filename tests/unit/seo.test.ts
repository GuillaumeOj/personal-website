import { describe, expect, it } from "vitest";
import { SITE } from "../../src/config";
import { pageTitles, socialImage, TITLE_MAX } from "../../src/lib/seo";

describe("pageTitles", () => {
  it("appends the brand when it fits, and strips it for the social card", () => {
    expect(pageTitles("Services")).toEqual({
      full: `Services — ${SITE.name}`,
      social: "Services",
    });
  });

  it("keeps a long title's own words instead of the brand", () => {
    const long = "x".repeat(TITLE_MAX);
    expect(pageTitles(long)).toEqual({ full: long, social: long });
  });

  it("uses a raw title verbatim but strips a brand prefix for the card", () => {
    expect(pageTitles(`${SITE.name} — Freelance`, true)).toEqual({
      full: `${SITE.name} — Freelance`,
      social: "Freelance",
    });
  });
});

describe("socialImage", () => {
  it("falls back to the locale's 1200×630 default card", () => {
    expect(socialImage("en")).toEqual({
      url: `${SITE.url}/og/default-en.jpg`,
      width: 1200,
      height: 630,
    });
  });

  it("makes a page's own image absolute and keeps its dimensions", () => {
    expect(
      socialImage("fr", { url: "/_astro/c.jpg", width: 800, height: 420 }),
    ).toEqual({ url: `${SITE.url}/_astro/c.jpg`, width: 800, height: 420 });
  });
});
