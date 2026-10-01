import { describe, expect, it } from "vitest";
import {
  type LegalDoc,
  legalNotice,
  privacyPolicy,
  termsOfService,
} from "../../src/lib/legal";

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

// General terms of service for professional buyers (audit finding L7): the
// mandatory invoicing mentions (L.441-9 / L.441-10, 293 B CGI), the payment
// terms, IP assignment on full payment and the reference clause (L5).
describe("termsOfService", () => {
  const cases = {
    fr: {
      scope: "et non aux consommateurs",
      vat: "TVA non applicable, art. 293 B du CGI",
      deposit: "acompte de 30 %",
      due: "30 jours à compter de la date d’émission de la facture",
      discount: "Aucun escompte",
      penalty: "majoré de 10 points",
      fee: "40 €",
      ip: "Sous réserve du paiement intégral du prix",
      reference: "à titre de référence commerciale, sauf opposition écrite",
    },
    en: {
      scope: "not for consumers",
      vat: "VAT not applicable, article 293 B",
      deposit: "deposit of 30%",
      due: "within 30 days of the invoice date",
      discount: "No discount",
      penalty: "plus 10 percentage points",
      fee: "€40",
      ip: "Subject to full payment of the price",
      reference:
        "as a commercial reference, unless the client objects in writing",
    },
  } as const;

  for (const locale of ["fr", "en"] as const) {
    describe(locale, () => {
      const text = flatten(termsOfService(locale, contact));
      const c = cases[locale];

      it("identifies the provider with the env-provided address", () => {
        expect(text).toContain("Guillaume Ojardias");
        expect(text).toContain(contact.address);
        expect(text).toContain("993 870 955");
      });

      it("is limited to professional clients", () => {
        expect(text).toContain(c.scope);
      });

      it("carries the mandatory invoicing mentions", () => {
        expect(text).toContain(c.vat);
        expect(text).toContain(c.discount);
        expect(text).toContain(c.penalty);
        expect(text).toContain("L.441-10");
        expect(text).toContain(c.fee);
        expect(text).toContain("D.441-5");
      });

      it("sets a 30% deposit and 30-day payment terms", () => {
        expect(text).toContain(c.deposit);
        expect(text).toContain(c.due);
      });

      it("assigns IP on full payment and allows client references", () => {
        expect(text).toContain(c.ip);
        expect(text).toContain("L.131-3");
        expect(text).toContain(c.reference);
      });
    });
  }

  it("links the localized privacy policy", () => {
    expect(flatten(termsOfService("fr", contact))).toContain(
      "</privacy-policy/>",
    );
    expect(flatten(termsOfService("en", contact))).toContain(
      "</en/privacy-policy/>",
    );
  });

  it("renders a visible placeholder when the address is missing", () => {
    expect(flatten(termsOfService("fr", {}))).toContain("[non renseigné]");
    expect(flatten(termsOfService("en", {}))).toContain("[not provided]");
  });
});
