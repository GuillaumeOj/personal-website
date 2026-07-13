export const SITE = {
  name: "Guillaume Ojardias",
  url: "https://guillaume.ojardias.info",
  // Public inbox surfaced as a secondary contact channel — the same address the
  // contact form delivers to (see `CONTACT_TO` in `lib/contact.ts`).
  email: "contact@ojardias.me",
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

export const isLocale = (value: string): value is Locale =>
  (SITE.locales as readonly string[]).includes(value);
