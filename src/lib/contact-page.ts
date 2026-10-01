import { type Locale, SITE } from "../config";
import {
  contactPath,
  localizedPath,
  quotePath,
  type TranslationKey,
  t,
} from "../i18n/ui";
import type {
  Budget,
  ContactOutcome,
  Intent,
  ProjectType,
  Timeline,
} from "./contact";
import { contact } from "./home";
import { BUSINESS_ID, type Crumb, webPageJsonLd } from "./schema";
import { contactNote, cost } from "./services";

type L = Record<Locale, string>;

/** The two contact pages: the general form and the quote-request form. */
export type ContactMode = "general" | "quote";

/** Field copy shared by both contact pages. */
export const form = {
  name: { fr: "Nom", en: "Name" },
  email: { fr: "E-mail", en: "Email" },
  projectType: { fr: "Type de projet", en: "Project type" },
  projectTypeOptions: [
    {
      value: "web",
      label: { fr: "Site / application web", en: "Web site / app" },
    },
    { value: "saas", label: { fr: "SaaS", en: "SaaS" } },
    {
      value: "mobile",
      label: { fr: "Application mobile", en: "Mobile app" },
    },
    { value: "other", label: { fr: "Autre", en: "Other" } },
  ] satisfies { value: ProjectType; label: L }[],
  message: { fr: "Votre projet", en: "Your project" },
  // GDPR art. 13 information notice under the submit button (not a consent
  // request: the processing rests on pre-contractual steps and legitimate
  // interest). `privacyNoticeRights` precedes a mailto link to the GDPR
  // address and `privacyNoticeMore` a link to the privacy policy — see
  // ContactForm.astro.
  privacyNotice: {
    fr: "Vos données (nom, e-mail, message) sont traitées par Guillaume Ojardias EI uniquement pour répondre à votre demande et, le cas échéant, établir un devis. Elles ne sont ni cédées ni utilisées à des fins de prospection.",
    en: "Your data (name, email, message) is processed by Guillaume Ojardias EI solely to answer your request and, where relevant, prepare a quote. It is never shared or used for marketing.",
  },
  privacyNoticeRights: {
    fr: "Vous pouvez exercer vos droits à ",
    en: "Exercise your rights at ",
  },
  privacyNoticeMore: { fr: "En savoir plus : ", en: "Learn more: " },
  privacyNoticeLink: {
    fr: "politique de confidentialité",
    en: "privacy policy",
  },
  // Quote form only: points to the general terms of service. `termsNotice`
  // precedes the link — see ContactForm.astro.
  termsNotice: {
    fr: "Les prestations sont régies par les ",
    en: "Services are governed by the ",
  },
  termsLink: {
    fr: "conditions générales de prestation",
    en: "general terms of service",
  },
  sending: { fr: "Envoi…", en: "Sending…" },
  // Legend for the `*` after required labels.
  requiredLegend: {
    fr: "Les champs marqués d’un astérisque (*) sont obligatoires.",
    en: "Fields marked with an asterisk (*) are required.",
  },
  // Shown next to the field, keyed by the API's `invalid <field>` errors.
  fieldErrors: {
    name: { fr: "Indiquez votre nom.", en: "Please enter your name." },
    email: {
      fr: "Indiquez une adresse e-mail valide, par exemple nom@domaine.fr.",
      en: "Enter a valid email address, for example name@example.com.",
    },
    message: {
      fr: "Décrivez votre projet en quelques lignes.",
      en: "Describe your project in a few lines.",
    },
  } satisfies Record<"name" | "email" | "message", L>,
  successTitle: { fr: "Message envoyé", en: "Message sent" },
  success: {
    fr: "Merci ! Votre message a bien été envoyé, je vous réponds sous 24 h.",
    en: "Thanks! Your message is on its way — you’ll get a reply within 24 h.",
  },
  // Followed by a mailto link to SITE.email, pre-filled with the message.
  error: {
    fr: "Votre message n’a pas pu être envoyé. Réessayez dans un instant, ou écrivez-moi directement à ",
    en: "Your message couldn’t be sent. Try again in a moment, or email me directly at ",
  },
  mailtoSubject: { fr: "Demande de contact", en: "Contact request" },
};

/** The optional budget/timeline fields, rendered only on the quote form. */
export const qualifying = {
  optional: { fr: "facultatif", en: "optional" },
  budget: { fr: "Budget envisagé", en: "Estimated budget" },
  budgetOptions: [
    { value: "lt5k", label: { fr: "Moins de 5 k€", en: "Under €5k" } },
    { value: "5-15k", label: { fr: "5 – 15 k€", en: "€5k – €15k" } },
    { value: "15-40k", label: { fr: "15 – 40 k€", en: "€15k – €40k" } },
    { value: "gt40k", label: { fr: "Plus de 40 k€", en: "Over €40k" } },
    {
      value: "unknown",
      label: { fr: "Je ne sais pas encore", en: "Not sure yet" },
    },
  ] satisfies { value: Budget; label: L }[],
  timeline: { fr: "Délai souhaité", en: "Desired timeline" },
  timelineOptions: [
    {
      value: "asap",
      label: { fr: "Dès que possible", en: "As soon as possible" },
    },
    {
      value: "1-3m",
      label: { fr: "D’ici 1 à 3 mois", en: "Within 1–3 months" },
    },
    {
      value: "3-6m",
      label: { fr: "D’ici 3 à 6 mois", en: "Within 3–6 months" },
    },
    { value: "flexible", label: { fr: "Flexible", en: "Flexible" } },
  ] satisfies { value: Timeline; label: L }[],
};

/** Cross-link from the general /contact page to the quote form. */
export const quoteCrossLink = {
  fr: "Vous avez un projet précis ? Demandez un devis gratuit",
  en: "Have a specific project? Request a free quote",
};

interface ContactModeConfig {
  path: (locale: Locale) => string;
  /** Breadcrumb label for this page. */
  crumb: TranslationKey;
  /**
   * `<title>` segment (the layout appends ` — {SITE.name}` while the result
   * fits BaseLayout's TITLE_MAX) and description.
   */
  meta: { title: L; description: L };
  eyebrow: L;
  title: L;
  lead: L;
  submit: L;
  messagePlaceholder: L;
  /** Posted with the form; the server flags quote requests (`[Devis]`). */
  intent?: Intent;
  /** Copy for the `ContactCta` band that links to this page. */
  band: { lead: L; cta: L };
}

/**
 * Everything that differs between /contact and /contact/quote. Those two pages
 * are the only places the contact form lives; every other page links to one of
 * them through a `ContactCta` band or a CTA button.
 */
export const contactModes: Record<ContactMode, ContactModeConfig> = {
  general: {
    path: contactPath,
    crumb: "nav.contact",
    meta: {
      title: { fr: "Contact", en: "Contact" },
      description: {
        fr: "Contactez un développeur web & mobile freelance à Lyon : décrivez votre projet en quelques lignes, réponse sous 24 h, devis gratuit et sans engagement.",
        en: "Get in touch with a freelance web & mobile developer in Lyon: describe your project in a few lines, reply within 24 h, free quote, no commitment.",
      },
    },
    // Deliberately the same heading as the Home band that links here.
    eyebrow: contact.eyebrow,
    title: contact.title,
    lead: contact.lead,
    submit: { fr: "Envoyer", en: "Send" },
    messagePlaceholder: {
      fr: "En quelques lignes : ce que vous voulez construire, pour qui, et sous quel délai.",
      en: "In a few lines: what you want to build, for whom, and by when.",
    },
    band: { lead: contact.lead, cta: contact.cta },
  },
  // Linked from the services page. Owns the "devis" query cluster, leaving
  // /contact the generic one.
  quote: {
    path: quotePath,
    crumb: "nav.quote",
    meta: {
      title: { fr: "Demande de devis gratuit", en: "Request a Free Quote" },
      description: {
        fr: "Demandez un devis gratuit pour votre application web, mobile ou SaaS : quelques lignes sur votre projet, un budget et un délai indicatifs, réponse sous 24 h.",
        en: "Request a free quote for your web, mobile or SaaS app: a few lines about your project, an indicative budget and timeline, reply within 24 h.",
      },
    },
    eyebrow: { fr: "Devis gratuit", en: "Free quote" },
    title: {
      fr: "Demandez votre estimation gratuite",
      en: "Request your free estimate",
    },
    // Not `contact.lead`: the quote note says the same, plus "free quote".
    lead: contactNote,
    submit: cost.cta,
    messagePlaceholder: {
      fr: "Les fonctionnalités clés, qui va l’utiliser, et ce qui existe déjà (maquettes, site actuel, cahier des charges…).",
      en: "The key features, who will use it, and what already exists (mockups, current site, specs…).",
    },
    intent: "quote",
    band: { lead: contactNote, cta: cost.cta },
  },
};

/**
 * Home › Contact (› Quote) — shared by the visible breadcrumb and the JSON-LD.
 * The last crumb is the current page.
 */
export const contactCrumbs = (locale: Locale, mode: ContactMode): Crumb[] => {
  const crumb = (key: TranslationKey, path: string): Crumb => ({
    name: t(locale, key),
    url: new URL(path, SITE.url).toString(),
  });
  const { general } = contactModes;
  const crumbs = [
    crumb("nav.home", localizedPath(locale, "/")),
    crumb(general.crumb, general.path(locale)),
  ];
  if (mode !== "general") {
    const cfg = contactModes[mode];
    crumbs.push(crumb(cfg.crumb, cfg.path(locale)));
  }
  return crumbs;
};

/**
 * schema.org JSON-LD for a contact page: a `ContactPage` about the canonical
 * `#business` entity (referenced by `@id`, never redefined), plus breadcrumbs.
 */
export const contactJsonLd = (locale: Locale, mode: ContactMode) => {
  const { meta } = contactModes[mode];
  const breadcrumbs = contactCrumbs(locale, mode);
  return webPageJsonLd(locale, {
    type: "ContactPage",
    url: breadcrumbs[breadcrumbs.length - 1].url,
    name: meta.title[locale],
    description: meta.description[locale],
    breadcrumbs,
    extra: { about: { "@id": BUSINESS_ID } },
  });
};

/**
 * The static pages a no-JS form post lands on (`303` from /api/contact):
 * /contact/thanks/ and /contact/error/ (+ /en mirrors). Not indexed.
 */
export const contactOutcomes = {
  // Same copy as the in-place (JS) success panel, so the reply-time promise
  // lives in one place.
  thanks: {
    title: { fr: "Message envoyé", en: "Message sent" },
    lead: {
      fr: "Merci ! Votre message a bien été envoyé, je vous réponds sous 24 h.",
      en: "Thanks! Your message has been sent. I’ll reply within 24 hours.",
    },
    back: { fr: "Retour à l’accueil", en: "Back to the home page" },
  },
  error: {
    title: {
      fr: "Votre message n’a pas pu être envoyé",
      en: "Your message couldn’t be sent",
    },
    lead: {
      fr: "Un champ était peut-être incomplet, ou l’envoi a échoué de mon côté. Revenez au formulaire pour réessayer, ou écrivez-moi directement à ",
      en: "A field may have been incomplete, or sending failed on my side. Go back to the form to try again, or email me directly at ",
    },
    back: { fr: "Revenir au formulaire", en: "Back to the form" },
  },
} satisfies Record<ContactOutcome, { title: L; lead: L; back: L }>;
