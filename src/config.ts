export const SITE = {
  name: 'Guillaume Ojardias',
  url: 'https://guillaume-ojardias.vercel.app',
  defaultLocale: 'fr' as const,
  locales: ['fr', 'en'] as const,
  social: {
    github: 'https://github.com/GuillaumeOj',
    linkedin: 'https://www.linkedin.com/in/guillaume-o/',
  },
};

export type Locale = (typeof SITE.locales)[number];

export const isLocale = (value: string): value is Locale =>
  (SITE.locales as readonly string[]).includes(value);
