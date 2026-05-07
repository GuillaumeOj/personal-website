import type { Locale } from '../config';

const dictionaries = {
  fr: {
    'nav.home': 'Accueil',
    'nav.blog': 'Blog',
    'nav.skipToContent': 'Aller au contenu',
    'home.tagline':
      'Développeur backend Django/DRF • Fondateur & fullstack chez Fusily',
    'home.intro.title': 'Salut, moi c’est Guillaume.',
    'home.cta.blog': 'Lire le blog',
    'home.experience.title': 'Parcours',
    'home.contact.title': 'Me contacter',
    'home.contact.github': 'GitHub',
    'home.contact.linkedin': 'LinkedIn',
    'blog.title': 'Blog',
    'blog.subtitle': 'Notes, retours d’expérience, projets.',
    'blog.empty': 'Aucun article pour le moment.',
    'blog.published': 'Publié le',
    'blog.backToList': '← Tous les articles',
    'theme.toggle': 'Changer le thème',
    'theme.light': 'Thème clair',
    'theme.dark': 'Thème sombre',
    'theme.system': 'Thème système',
    'lang.switch': 'Switch to English',
    'footer.builtWith': 'Construit avec Astro, déployé sur Vercel.',
  },
  en: {
    'nav.home': 'Home',
    'nav.blog': 'Blog',
    'nav.skipToContent': 'Skip to content',
    'home.tagline':
      'Django/DRF backend developer • Founder & fullstack at Fusily',
    'home.intro.title': 'Hi, I’m Guillaume.',
    'home.cta.blog': 'Read the blog',
    'home.experience.title': 'Experience',
    'home.contact.title': 'Get in touch',
    'home.contact.github': 'GitHub',
    'home.contact.linkedin': 'LinkedIn',
    'blog.title': 'Blog',
    'blog.subtitle': 'Notes, retrospectives, projects.',
    'blog.empty': 'No posts yet.',
    'blog.published': 'Published on',
    'blog.backToList': '← All posts',
    'theme.toggle': 'Toggle theme',
    'theme.light': 'Light theme',
    'theme.dark': 'Dark theme',
    'theme.system': 'System theme',
    'lang.switch': 'Passer en français',
    'footer.builtWith': 'Built with Astro, deployed on Vercel.',
  },
} as const satisfies Record<Locale, Record<string, string>>;

export type TranslationKey = keyof (typeof dictionaries)['fr'];

export const t = (locale: Locale, key: TranslationKey): string => {
  const entry = dictionaries[locale]?.[key];
  if (entry) return entry;
  return dictionaries.fr[key] ?? key;
};

export const formatDate = (date: Date, locale: Locale): string =>
  date.toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

export const otherLocale = (locale: Locale): Locale =>
  locale === 'fr' ? 'en' : 'fr';

export const localizedPath = (locale: Locale, path: string): string => {
  const cleaned = path.startsWith('/') ? path : `/${path}`;
  if (locale === 'fr') return cleaned;
  return `/en${cleaned === '/' ? '' : cleaned}`;
};
