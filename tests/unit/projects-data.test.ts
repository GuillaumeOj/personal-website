import { describe, expect, it } from "vitest";
import { getProjectBySlug } from "../../src/lib/projects";

// Eva Biezunski's site went live in June 2026 — guard the date across every
// place it surfaces (the year drives `datePublished`, the result line and the
// long description are visible copy).
describe("eva-biezunski-avocate online date", () => {
  const eva = getProjectBySlug("eva-biezunski-avocate");

  it("is live since June 2026", () => {
    expect(eva).toBeDefined();
    expect(eva?.year).toBe(2026);
    expect(eva?.result?.fr).toContain("juin 2026");
    expect(eva?.result?.en).toContain("June 2026");
    expect(eva?.content.fr.longDescription).toContain("juin 2026");
    expect(eva?.content.en.longDescription).toContain("June 2026");
  });

  it("no longer claims 2024", () => {
    expect(eva?.result?.fr).not.toContain("2024");
    expect(eva?.result?.en).not.toContain("2024");
  });
});
