import type { Locale } from '../config';

const dictionaries = {
  fr: {
    'nav.blog': 'Blog',
    'nav.projects': 'Projets',
    'nav.services': 'Services',
    'nav.contact': 'Contact',
    'nav.skipToContent': 'Aller au contenu',
    'home.contact.github': 'GitHub',
    'home.contact.linkedin': 'LinkedIn',
    'home.contact.malt': 'Malt',
    'home.contact.fiverr': 'Fiverr',
    'blog.title': 'Blog',
    'blog.subtitle': 'Notes, retours d’expérience, projets.',
    'blog.empty': 'Aucun article pour le moment.',
    'blog.published': 'Publié le',
    'blog.backToList': '← Tous les articles',
    'blog.tocLabel': 'Sommaire',
    'projects.title': 'Projets',
    'projects.subtitle':
      'Une sélection de projets web et mobiles que j’ai réalisés.',
    'projects.empty': 'Aucun projet pour le moment.',
    'projects.filter.all': 'Tous',
    'projects.filter.web': 'Web',
    'projects.filter.saas': 'SaaS',
    'projects.filter.mobile': 'Mobile',
    'projects.filter.label': 'Filtrer par type',
    'projects.filter.none': 'Aucun projet pour ce filtre.',
    'projects.visit': 'Visiter le projet',
    'projects.viewSource': 'Voir le code source',
    'projects.aim': 'Objectif',
    'projects.stack': 'Stack technique',
    'projects.backToList': '← Tous les projets',
    'projects.context.personal': 'Personnel',
    'projects.context.client': 'Client',
    'projects.context.side': 'Projet perso',
    'projects.context.oss': 'Open source',
    'theme.toggle': 'Changer le thème',
    'theme.light': 'Thème clair',
    'theme.dark': 'Thème sombre',
    'theme.system': 'Thème système',
    'lang.switch': 'Switch to English',
    'footer.builtWith': 'Construit avec Astro, déployé sur Vercel.',
    'footer.rss': 'Flux RSS',
    'footer.nav': 'Navigation',
    'footer.legal': 'Légal',
    'footer.legalNotice': 'Mentions légales',
    'footer.privacy': 'Politique de confidentialité',
    'error.404.title': '404',
    'error.404.lead': 'Cette page a pris un café…',
    'error.404.message':
      'Elle n’existe pas (ou plus). Voici les derniers articles du blog en attendant.',
    'error.recentArticles': 'Derniers articles',
    'error.backHome': 'Retour à l’accueil',
  },
  en: {
    'nav.blog': 'Blog',
    'nav.projects': 'Projects',
    'nav.services': 'Services',
    'nav.contact': 'Contact',
    'nav.skipToContent': 'Skip to content',
    'home.contact.github': 'GitHub',
    'home.contact.linkedin': 'LinkedIn',
    'home.contact.malt': 'Malt',
    'home.contact.fiverr': 'Fiverr',
    'blog.title': 'Blog',
    'blog.subtitle': 'Notes, retrospectives, projects.',
    'blog.empty': 'No posts yet.',
    'blog.published': 'Published on',
    'blog.backToList': '← All posts',
    'blog.tocLabel': 'On this page',
    'projects.title': 'Projects',
    'projects.subtitle': 'A selection of web and mobile projects I have built.',
    'projects.empty': 'No projects yet.',
    'projects.filter.all': 'All',
    'projects.filter.web': 'Web',
    'projects.filter.saas': 'SaaS',
    'projects.filter.mobile': 'Mobile',
    'projects.filter.label': 'Filter by type',
    'projects.filter.none': 'No projects for this filter.',
    'projects.visit': 'Visit project',
    'projects.viewSource': 'View source code',
    'projects.aim': 'Goal',
    'projects.stack': 'Tech stack',
    'projects.backToList': '← All projects',
    'projects.context.personal': 'Personal',
    'projects.context.client': 'Client',
    'projects.context.side': 'Side project',
    'projects.context.oss': 'Open source',
    'theme.toggle': 'Toggle theme',
    'theme.light': 'Light theme',
    'theme.dark': 'Dark theme',
    'theme.system': 'System theme',
    'lang.switch': 'Passer en français',
    'footer.builtWith': 'Built with Astro, deployed on Vercel.',
    'footer.rss': 'RSS feed',
    'footer.nav': 'Navigation',
    'footer.legal': 'Legal',
    'footer.legalNotice': 'Legal notice',
    'footer.privacy': 'Privacy policy',
    'error.404.title': '404',
    'error.404.lead': 'This page took a coffee break…',
    'error.404.message':
      'It doesn’t exist (or not anymore). Here are the latest blog articles instead.',
    'error.recentArticles': 'Latest articles',
    'error.backHome': 'Back to home',
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

export const articlePath = (
  locale: Locale,
  translationKey: string,
  slug: string,
): string => `${localizedPath(locale, `/blog/${translationKey}/${slug}`)}/`;

export const projectPath = (locale: Locale, slug: string): string =>
  `${localizedPath(locale, `/projects/${slug}`)}/`;

export interface NavItem {
  href: string;
  label: string;
  /** Kept in the compact (mobile) header row. */
  compact: boolean;
}

/** Primary navigation, shared by Header and Footer. */
export const navItems = (locale: Locale): NavItem[] => {
  const home = localizedPath(locale, '/');
  return [
    {
      href: `${home}#services`,
      label: t(locale, 'nav.services'),
      compact: false,
    },
    {
      href: localizedPath(locale, '/projects'),
      label: t(locale, 'nav.projects'),
      compact: true,
    },
    {
      href: localizedPath(locale, '/blog'),
      label: t(locale, 'nav.blog'),
      compact: true,
    },
    {
      href: `${home}#contact`,
      label: t(locale, 'nav.contact'),
      compact: false,
    },
  ];
};
