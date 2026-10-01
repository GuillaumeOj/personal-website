import { describe, expect, it } from "vitest";
import { type LegalDoc, legalNotice } from "../../src/lib/legal";

// Flatten a legal doc to its visible text plus link targets, so assertions read
// like "the page says X" regardless of how paragraphs are split into runs.
const flatten = (doc: LegalDoc) =>
  doc.sections
    .flatMap((s) => [s.h, ...s.body])
    .flatMap((p) => (typeof p === "string" ? [p] : p))
    .map((run) => (typeof run === "string" ? run : `${run.text} <${run.href}>`))
    .join("\n");

const contact = {
  address: "1 rue Exemple, 69000 Lyon, France",
  phone: "+33 6 00 00 00 00",
};

describe("legalNotice", () => {
  for (const locale of ["fr", "en"] as const) {
    describe(locale, () => {
      const text = flatten(legalNotice(locale, contact));

      it("injects the env-provided address and phone", () => {
        expect(text).toContain(contact.address);
        expect(text).toContain(contact.phone);
      });

      it("carries the mandatory publisher details", () => {
        expect(text).toContain("993 870 955");
        expect(text).toContain("EI");
        expect(text).toContain("293 B");
        expect(text).toContain("<mailto:contact@ojardias.me>");
      });

      it("names the current Vercel address, without a phone number", () => {
        expect(text).toContain("440 N Barranca Avenue #4133, Covina, CA 91723");
        expect(text).not.toMatch(/\+1[\s\d]/);
      });

      it("states the MIT licence and links the repo", () => {
        expect(text).toContain("MIT");
        expect(text).toContain(
          "<https://github.com/GuillaumeOj/personal-website>",
        );
      });
    });
  }

  it("links the localized privacy policy", () => {
    expect(flatten(legalNotice("fr", contact))).toContain("</privacy-policy/>");
    expect(flatten(legalNotice("en", contact))).toContain(
      "</en/privacy-policy/>",
    );
  });

  it("renders a visible placeholder when the env vars are missing", () => {
    expect(flatten(legalNotice("fr", {}))).toContain("[non renseigné]");
    expect(flatten(legalNotice("en", {}))).toContain("[not provided]");
  });
});
