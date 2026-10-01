export const SITE = {
  name: "Guillaume Ojardias",
  url: "https://guillaume.ojardias.info",
  // Public-facing contact address, exposed on the site (the `mailto:` in the
  // contact section, the JSON-LD Person/ProfessionalService email, the legal
  // notice). `public/.well-known/security.txt` repeats it (and `url`) as a
  // static file: keep it in sync. The contact form itself delivers to a separate real inbox via
  // Brevo — see `CONTACT_TO`/`CONTACT_FROM` in `lib/contact.ts`.
  email: "contact@ojardias.me",
  // Data-protection mailbox, named in the privacy policy and the form notice.
  gdprEmail: "gdpr@ojardias.me",
  // Business registration number, quoted on the legal pages.
  siren: "993 870 955",
  defaultLocale: "fr" as const,
  locales: ["fr", "en"] as const,
  social: {
    github: "https://github.com/GuillaumeOj",
    linkedin: "https://www.linkedin.com/in/guillaume-o/",
    malt: "https://www.malt.fr/profile/guillaumeojardias",
    fiverr: "https://www.fiverr.com/sellers/guillaume_oj/",
  },
};

export type Locale = (typeof SITE.locales)[number];

/** A string in every locale. */
export type Localized = Record<Locale, string>;

/** BCP 47 tag per locale: JSON-LD `inLanguage`, date formatting, `og:locale`. */
export const LOCALE_TAG: Record<Locale, string> = {
  fr: "fr-FR",
  en: "en-US",
};

export const isLocale = (value: string): value is Locale =>
  (SITE.locales as readonly string[]).includes(value);
