import { describe, expect, it } from "vitest";
import { type LegalDoc, legalNotice, privacyPolicy } from "../../src/lib/legal";

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

// GDPR art. 13: who the controller is, why and on what basis data is
// processed, who receives it, where it goes, how long it is kept, and how to
// exercise rights or complain (audit finding L2).
describe("privacyPolicy", () => {
  const cases = {
    fr: { retention: "3 ans", complaint: "réclamation à la CNIL" },
    en: { retention: "3 years", complaint: "complaint with the CNIL" },
  } as const;

  for (const locale of ["fr", "en"] as const) {
    describe(locale, () => {
      const text = flatten(privacyPolicy(locale, contact));

      it("names the controller with the env-provided address", () => {
        expect(text).toContain("Guillaume Ojardias");
        expect(text).toContain("EI");
        expect(text).toContain(contact.address);
        expect(text).toContain("993 870 955");
      });

      it("rests on pre-contractual steps and legitimate interest, not consent", () => {
        expect(text).toContain("6.1.b");
        expect(text).toContain("6.1.f");
        expect(text).not.toMatch(
          /(base|basis) of your consent|votre consentement/,
        );
      });

      it("lists the processors and the US transfer safeguards", () => {
        for (const name of ["Vercel Inc.", "Brevo", "Proton AG"]) {
          expect(text).toContain(name);
        }
        expect(text).toContain("Data Privacy Framework");
      });

      it("gives concrete retention periods", () => {
        expect(text).toContain(cases[locale].retention);
        expect(text).toContain("L.123-22");
      });

      it("explains rights, the GDPR address and the CNIL complaint", () => {
        expect(text).toContain("<mailto:gdpr@ojardias.me>");
        expect(text).toContain(cases[locale].complaint);
        expect(text).toContain("<https://www.cnil.fr>");
      });

      it("discloses the theme preference in local storage", () => {
        expect(text).toMatch(/stockage local|local storage/);
      });
    });
  }

  it("links the localized legal notice", () => {
    expect(flatten(privacyPolicy("fr", contact))).toContain("</legal-notice/>");
    expect(flatten(privacyPolicy("en", contact))).toContain(
      "</en/legal-notice/>",
    );
  });

  it("renders a visible placeholder when the address is missing", () => {
    expect(flatten(privacyPolicy("fr", {}))).toContain("[non renseigné]");
    expect(flatten(privacyPolicy("en", {}))).toContain("[not provided]");
  });
});
