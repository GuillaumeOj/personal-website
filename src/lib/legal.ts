import { type Locale, SITE } from "../config";
import { ensureTrailingSlash, localizedPath } from "../i18n/ui";

/** A run of text inside a paragraph, optionally a link. */
export type LegalInline = string | { text: string; href: string };

/** A paragraph: plain text, or a sequence of text/link runs. */
export type LegalParagraph = string | LegalInline[];

export interface LegalSection {
  h: string;
  body: LegalParagraph[];
}

export interface LegalDoc {
  title: string;
  /** One-sentence `<meta name="description">` (the pages are also `noindex`). */
  metaDescription: string;
  updated: string;
  sections: LegalSection[];
}

/**
 * Publisher contact details the law requires on the legal notice but that stay
 * out of the public repo: they come from the `LEGAL_ADDRESS` / `LEGAL_PHONE`
 * build-time env vars (see `astro.config.mjs`). A missing value renders as a
 * visible placeholder; production builds refuse to run without them.
 */
export interface LegalContact {
  address?: string;
  phone?: string;
}

const REPO_URL = `${SITE.social.github}/personal-website`;

const link = (text: string, href: string): LegalInline => ({ text, href });
const mail = (address: string) => link(address, `mailto:${address}`);

export function legalNotice(locale: Locale, contact: LegalContact): LegalDoc {
  const privacyHref = ensureTrailingSlash(
    localizedPath(locale, "/privacy-policy"),
  );
  const repoLink = link("github.com/GuillaumeOj/personal-website", REPO_URL);
  const hostLinks: LegalInline[] = [
    link("vercel.com", "https://vercel.com"),
    " — ",
    mail("privacy@vercel.com"),
    ".",
  ];

  if (locale === "fr") {
    const missing = "[non renseigné]";
    return {
      title: "Mentions légales",
      metaDescription:
        "Mentions légales du site de Guillaume Ojardias : éditeur, directeur de la publication, hébergement et propriété intellectuelle.",
      updated: "Dernière mise à jour : 1er octobre 2026",
      sections: [
        {
          h: "Éditeur du site",
          body: [
            "Guillaume Ojardias, entrepreneur individuel (EI), exerçant sous le régime de la micro-entreprise.",
            `Adresse : ${contact.address ?? missing}.`,
            "SIREN : 993 870 955 — immatriculé au Registre national des entreprises (RNE).",
            "TVA non applicable, art. 293 B du CGI.",
            [
              `Téléphone : ${contact.phone ?? missing} — E-mail : `,
              mail(SITE.email),
              ".",
            ],
          ],
        },
        { h: "Directeur de la publication", body: ["Guillaume Ojardias."] },
        {
          h: "Hébergement",
          body: [
            [
              "Vercel Inc., 440 N Barranca Avenue #4133, Covina, CA 91723, États-Unis — ",
              ...hostLinks,
            ],
          ],
        },
        {
          h: "Propriété intellectuelle",
          body: [
            "Sauf mention contraire, les textes, photographies personnelles et éléments graphiques de ce site sont la propriété de Guillaume Ojardias et ne peuvent être reproduits sans autorisation (art. L.122-4 du Code de la propriété intellectuelle). Certaines illustrations proviennent de banques d’images et restent soumises aux licences de leurs auteurs. Les captures d’écran de projets clients sont reproduites avec l’accord des clients concernés.",
            [
              "Le code source du site est publié sur GitHub (",
              repoLink,
              ") sous licence MIT ; cette licence ne couvre pas le contenu éditorial. Les marques citées appartiennent à leurs titulaires respectifs.",
            ],
          ],
        },
        {
          h: "Données personnelles",
          body: [
            [
              "Voir la ",
              link("politique de confidentialité", privacyHref),
              ".",
            ],
          ],
        },
      ],
    };
  }

  const missing = "[not provided]";
  return {
    title: "Legal notice",
    metaDescription:
      "Legal notice for Guillaume Ojardias's website: publisher, publication director, hosting and intellectual property.",
    updated: "Last updated: October 1, 2026",
    sections: [
      {
        h: "Site publisher",
        body: [
          "Guillaume Ojardias, sole trader (entrepreneur individuel, EI) operating under the French micro-enterprise scheme.",
          `Address: ${contact.address ?? missing}.`,
          "Business ID (SIREN): 993 870 955 — registered with the French National Business Register (RNE).",
          "VAT not applicable, article 293 B of the French General Tax Code (CGI).",
          [
            `Phone: ${contact.phone ?? missing} — Email: `,
            mail(SITE.email),
            ".",
          ],
        ],
      },
      { h: "Publication director", body: ["Guillaume Ojardias."] },
      {
        h: "Hosting",
        body: [
          [
            "Vercel Inc., 440 N Barranca Avenue #4133, Covina, CA 91723, USA — ",
            ...hostLinks,
          ],
        ],
      },
      {
        h: "Intellectual property",
        body: [
          "Unless stated otherwise, the texts, personal photographs and graphic elements of this site are the property of Guillaume Ojardias and may not be reproduced without permission (article L.122-4 of the French Intellectual Property Code). Some illustrations come from stock image libraries and remain subject to their authors’ licences. Screenshots of client projects are reproduced with the agreement of the clients concerned.",
          [
            "The site’s source code is published on GitHub (",
            repoLink,
            ") under the MIT licence; this licence does not cover the editorial content. Trademarks mentioned belong to their respective owners.",
          ],
        ],
      },
      {
        h: "Personal data",
        body: [["See the ", link("privacy policy", privacyHref), "."]],
      },
    ],
  };
}

export const privacyPolicy: Record<Locale, LegalDoc> = {
  fr: {
    title: "Politique de confidentialité",
    metaDescription:
      "Politique de confidentialité du site de Guillaume Ojardias : quelles données le formulaire de contact collecte, leur usage, leur conservation et vos droits RGPD.",
    updated: "Dernière mise à jour : 29 septembre 2026",
    sections: [
      {
        h: "Introduction",
        body: [
          "Cette politique explique quelles données personnelles sont collectées sur ce site et comment elles sont utilisées.",
        ],
      },
      {
        h: "Données collectées",
        body: [
          "Le formulaire de contact recueille votre nom, votre adresse e-mail, le type de projet et votre message, ainsi que, si vous les renseignez lors d’une demande de devis, votre budget et votre délai envisagés. Ces informations servent uniquement à répondre à votre demande.",
        ],
      },
      {
        h: "Finalité et base légale",
        body: [
          "Vos données sont traitées dans le seul but de répondre à votre demande, sur la base de votre consentement.",
        ],
      },
      {
        h: "Durée de conservation",
        body: [
          "Vos messages sont conservés le temps nécessaire au traitement de votre demande, puis supprimés.",
        ],
      },
      {
        h: "Cookies et mesure d’audience",
        body: [
          "Ce site n’utilise pas de cookies de suivi ni d’outil de mesure d’audience.",
        ],
      },
      {
        h: "Vos droits",
        body: [
          "Conformément au RGPD, vous disposez d’un droit d’accès, de rectification et de suppression de vos données. Pour l’exercer, contactez : gdpr@ojardias.me.",
        ],
      },
    ],
  },
  en: {
    title: "Privacy policy",
    metaDescription:
      "Privacy policy for Guillaume Ojardias's website: what data the contact form collects, how it is used and retained, and your GDPR rights.",
    updated: "Last updated: September 29, 2026",
    sections: [
      {
        h: "Introduction",
        body: [
          "This policy explains what personal data is collected on this site and how it is used.",
        ],
      },
      {
        h: "Data collected",
        body: [
          "The contact form collects your name, email address, project type and message, plus, if you provide them with a quote request, your estimated budget and timeline. This information is used solely to respond to your request.",
        ],
      },
      {
        h: "Purpose and legal basis",
        body: [
          "Your data is processed for the sole purpose of responding to your request, on the basis of your consent.",
        ],
      },
      {
        h: "Retention period",
        body: [
          "Your messages are kept for as long as needed to handle your request, then deleted.",
        ],
      },
      {
        h: "Cookies and analytics",
        body: [
          "This site does not use tracking cookies or any analytics tool.",
        ],
      },
      {
        h: "Your rights",
        body: [
          "Under the GDPR, you have the right to access, rectify and erase your data. To exercise it, contact: gdpr@ojardias.me.",
        ],
      },
    ],
  },
};
