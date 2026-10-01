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
            "Sauf mention contraire, les textes, photographies personnelles et éléments graphiques de ce site sont la propriété de Guillaume Ojardias et ne peuvent être reproduits sans autorisation (art. L.122-4 du Code de la propriété intellectuelle). Les photos de couverture des articles proviennent d’Unsplash, restent soumises à la licence Unsplash et sont créditées sous chaque image. Les captures d’écran de projets clients sont reproduites avec l’accord des clients concernés.",
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
          "Unless stated otherwise, the texts, personal photographs and graphic elements of this site are the property of Guillaume Ojardias and may not be reproduced without permission (article L.122-4 of the French Intellectual Property Code). Blog cover photos come from Unsplash, remain subject to the Unsplash licence and are credited under each image. Screenshots of client projects are reproduced with the agreement of the clients concerned.",
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

/** Address for exercising GDPR rights (privacy policy + form notice). */
export const GDPR_EMAIL = "gdpr@ojardias.me";

/**
 * Privacy policy: the GDPR art. 13 information for the contact form and the
 * host's technical logs. The controller's postal address is the same
 * env-provided value as on the legal notice.
 */
export function privacyPolicy(
  locale: Locale,
  contact: Pick<LegalContact, "address">,
): LegalDoc {
  const legalNoticeHref = ensureTrailingSlash(
    localizedPath(locale, "/legal-notice"),
  );
  const gdprLink = mail(GDPR_EMAIL);
  const cnilLink = link("www.cnil.fr", "https://www.cnil.fr");

  if (locale === "fr") {
    const missing = "[non renseigné]";
    return {
      title: "Politique de confidentialité",
      metaDescription:
        "Politique de confidentialité du site de Guillaume Ojardias : responsable du traitement, données du formulaire de contact, bases légales, destinataires, durées de conservation et droits RGPD.",
      updated: "Dernière mise à jour : 1er octobre 2026",
      sections: [
        {
          h: "Responsable du traitement",
          body: [
            [
              `Guillaume Ojardias, entrepreneur individuel (EI), ${contact.address ?? missing}, SIREN 993 870 955 — `,
              gdprLink,
              ". Voir aussi les ",
              link("mentions légales", legalNoticeHref),
              ".",
            ],
          ],
        },
        {
          h: "Données collectées et finalités",
          body: [
            "Formulaire de contact : nom, adresse e-mail, type de projet, message et, si vous les indiquez lors d’une demande de devis, budget et délai envisagés. Finalité : répondre à votre demande et, le cas échéant, établir un devis. Base légale : mesures précontractuelles prises à votre demande (art. 6.1.b du RGPD) et intérêt légitime à répondre aux messages reçus (art. 6.1.f). Le nom, l’e-mail et le message sont nécessaires pour vous répondre ; sans eux, la demande ne peut pas être traitée.",
            "Journaux techniques : lors de chaque visite, l’hébergeur enregistre des données techniques (adresse IP, date, page demandée, navigateur) pour assurer la sécurité et le bon fonctionnement du site. Base légale : intérêt légitime (art. 6.1.f).",
            "Vos données ne sont ni vendues, ni cédées, ni utilisées à des fins de prospection.",
          ],
        },
        {
          h: "Destinataires",
          body: [
            "Vos données sont destinées à Guillaume Ojardias uniquement. Elles transitent par les sous-traitants suivants :",
            "Vercel Inc. (États-Unis) : hébergement du site et exécution du formulaire, dans la région de Paris ;",
            "Brevo / Sendinblue SAS (France) : acheminement de l’e-mail de notification ;",
            "Proton AG (Suisse) : messagerie de réception.",
          ],
        },
        {
          h: "Transferts hors Union européenne",
          body: [
            "Le formulaire est exécuté dans la région de Paris, mais Vercel Inc. est une société américaine. Elle est certifiée au titre du cadre de protection des données UE–États-Unis (Data Privacy Framework, décision d’adéquation de la Commission européenne du 10 juillet 2023) ; son accord de traitement prévoit en outre les clauses contractuelles types de la Commission européenne.",
            "La Suisse bénéficie d’une décision d’adéquation de la Commission européenne.",
          ],
        },
        {
          h: "Durées de conservation",
          body: [
            "Demandes de contact sans suite : 3 ans à compter du dernier échange, puis suppression.",
            "Si une prestation est conclue : durée de la relation, puis 5 ans (prescription) ; les factures sont conservées 10 ans (art. L.123-22 du Code de commerce).",
            "Journaux techniques : durée courte fixée par la politique de l’hébergeur, puis suppression automatique.",
          ],
        },
        {
          h: "Cookies et stockage local",
          body: [
            "Ce site ne dépose aucun cookie et n’utilise aucun outil de mesure d’audience ni de publicité.",
            "Seule votre préférence d’affichage (thème clair ou sombre), si vous la choisissez, est enregistrée dans le stockage local de votre navigateur ; elle n’est jamais transmise et vous pouvez l’effacer à tout moment via les réglages de votre navigateur. Ce stockage, strictement nécessaire à la fonctionnalité demandée, est exempté de consentement (art. 82 de la loi Informatique et Libertés).",
          ],
        },
        {
          h: "Vos droits",
          body: [
            [
              "Vous disposez d’un droit d’accès, de rectification, d’effacement, de limitation, d’opposition et, le cas échéant, de portabilité de vos données, ainsi que du droit de définir des directives relatives à leur sort après votre décès. Pour les exercer : ",
              gdprLink,
              ". Une réponse vous est apportée dans un délai d’un mois.",
            ],
            [
              "Si vous estimez, après nous avoir contactés, que vos droits ne sont pas respectés, vous pouvez adresser une réclamation à la CNIL (",
              cnilLink,
              ", 3 place de Fontenoy, TSA 80715, 75334 Paris Cedex 07).",
            ],
          ],
        },
        {
          h: "Délégué à la protection des données",
          body: [
            "Aucun délégué à la protection des données n’a été désigné, cette désignation n’étant pas obligatoire (art. 37 du RGPD).",
          ],
        },
      ],
    };
  }

  const missing = "[not provided]";
  return {
    title: "Privacy policy",
    metaDescription:
      "Privacy policy for Guillaume Ojardias's website: data controller, contact-form data, legal bases, recipients, retention periods and your GDPR rights.",
    updated: "Last updated: October 1, 2026",
    sections: [
      {
        h: "Data controller",
        body: [
          [
            `Guillaume Ojardias, sole trader (entrepreneur individuel, EI), ${contact.address ?? missing}, SIREN 993 870 955 — `,
            gdprLink,
            ". See also the ",
            link("legal notice", legalNoticeHref),
            ".",
          ],
        ],
      },
      {
        h: "Data collected and purposes",
        body: [
          "Contact form: name, email address, project type, message and, if you provide them with a quote request, estimated budget and timeline. Purpose: to answer your request and, where relevant, prepare a quote. Legal basis: steps taken at your request prior to entering into a contract (GDPR art. 6.1.b) and legitimate interest in answering the messages received (art. 6.1.f). Your name, email and message are needed to reply; without them, the request cannot be handled.",
          "Technical logs: on each visit, the host records technical data (IP address, date, requested page, browser) to keep the site secure and working. Legal basis: legitimate interest (art. 6.1.f).",
          "Your data is never sold, shared or used for marketing.",
        ],
      },
      {
        h: "Recipients",
        body: [
          "Your data is intended for Guillaume Ojardias only. It passes through the following processors:",
          "Vercel Inc. (United States): site hosting and running the form, in the Paris region;",
          "Brevo / Sendinblue SAS (France): delivery of the notification email;",
          "Proton AG (Switzerland): receiving mailbox.",
        ],
      },
      {
        h: "Transfers outside the European Union",
        body: [
          "The form runs in the Paris region, but Vercel Inc. is a US company. It is certified under the EU–US Data Privacy Framework (European Commission adequacy decision of 10 July 2023), and its data processing agreement also includes the European Commission’s standard contractual clauses.",
          "Switzerland benefits from a European Commission adequacy decision.",
        ],
      },
      {
        h: "Retention periods",
        body: [
          "Contact requests that lead nowhere: 3 years from the last exchange, then deleted.",
          "If a contract is concluded: the length of the relationship, then 5 years (limitation period); invoices are kept for 10 years (article L.123-22 of the French Commercial Code).",
          "Technical logs: a short period set by the host’s policy, then deleted automatically.",
        ],
      },
      {
        h: "Cookies and local storage",
        body: [
          "This site sets no cookies and uses no analytics or advertising tools.",
          "Only your display preference (light or dark theme), if you choose one, is saved in your browser’s local storage; it is never transmitted and you can clear it at any time in your browser settings. This storage is strictly necessary for the feature you requested, so it is exempt from consent (article 82 of the French Data Protection Act).",
        ],
      },
      {
        h: "Your rights",
        body: [
          [
            "You have the right to access, rectify, erase, restrict and object to the processing of your data, the right to data portability where applicable, and the right to set instructions for what happens to your data after your death. To exercise them: ",
            gdprLink,
            ". You will receive an answer within one month.",
          ],
          [
            "If, after contacting us, you believe your rights are not being respected, you can lodge a complaint with the CNIL, the French data protection authority (",
            cnilLink,
            ", 3 place de Fontenoy, TSA 80715, 75334 Paris Cedex 07, France).",
          ],
        ],
      },
      {
        h: "Data protection officer",
        body: [
          "No data protection officer has been appointed, as this is not mandatory (GDPR art. 37).",
        ],
      },
    ],
  };
}
