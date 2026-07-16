import type { Locale } from "../config";
import { hero } from "../lib/home";

const dictionaries = {
  fr: {
    "nav.home": "Accueil",
    "nav.blog": "Blog",
    "nav.projects": "Projets",
    "nav.services": "Prestations",
    "nav.about": "À propos",
    "nav.menu": "Menu",
    "nav.mainNav": "Navigation principale",
    "nav.skipToContent": "Aller au contenu",
    // SEO `<title>` for static pages. Each is the page-specific segment; the
    // layout appends ` — Guillaume Ojardias`. One page owns one query cluster:
    // Home owns the "développeur … à Lyon" head term (About leads with the name,
    // Services with "prestations") so no two titles share a leading phrase.
    "meta.homeTitle": "Développeur web & mobile freelance à Lyon",
    "meta.projectsTitle": "Projets & réalisations web",
    "meta.blogTitle": "Blog — Développement web & mobile",
    // SEO meta descriptions for hub pages — richer than the on-page subtitle
    // (`projects.subtitle` / `blog.subtitle`), which stays as the visible lead.
    // Benefit-first: lead with the outcome/positioning, demote the stack to a
    // secondary clause, and keep the local intent ("Lyon"/"freelance").
    "meta.homeDescription":
      "Développeur freelance à Lyon, je conçois des applications web et mobiles performantes, du premier écran à la mise en production (Python, React Native).",
    "meta.projectsDescription":
      "Une sélection de projets web et mobiles réalisés en freelance : l’application mobile Fusily, un site vitrine d’avocate, le générateur de QR codes dotcraft, et plus encore.",
    "meta.blogDescription":
      "Retours d’expérience et bonnes pratiques sur le développement web et mobile (Astro, React Native, Django), par un développeur freelance basé à Lyon.",
    "home.contact.github": "GitHub",
    "home.contact.linkedin": "LinkedIn",
    "home.contact.malt": "Malt",
    "home.contact.fiverr": "Fiverr",
    "home.contact.emailLabel": "Ou écrivez-moi directement",
    "blog.title": "Blog",
    "blog.subtitle":
      "Notes et retours d’expérience d’un développeur web & mobile freelance à Lyon.",
    "blog.empty": "Aucun article pour le moment.",
    "blog.published": "Publié le",
    "blog.backToList": "← Tous les articles",
    "blog.tocLabel": "Sommaire",
    // End-of-article conversion block (author card + CTAs).
    "blog.cta.bio":
      "Guillaume Ojardias, développeur web & mobile freelance à Lyon. J’accompagne PME, associations et porteurs de projet, de l’idée à la mise en ligne.",
    "blog.cta.heading": "Un projet web ou mobile en tête ?",
    "blog.cta.lead":
      "Décrivez votre idée en quelques mots : vous avez une réponse sous 24 h, devis gratuit et sans engagement.",
    "blog.cta.primary": "Discutons de votre projet",
    "blog.cta.secondary": "Voir les prestations",
    "projects.title": "Projets",
    "projects.subtitle":
      "Des applications web et mobiles conçues et livrées de bout en bout, en freelance à Lyon, pour des PME, des associations et des porteurs de projet.",
    "projects.similarCta.title": "Un projet similaire en tête ? Discutons-en.",
    "projects.similarCta.primary": "Discutons de votre projet",
    "projects.similarCta.secondary": "Voir les prestations",
    "projects.listCta.title":
      "Votre projet peut être le prochain — parlons-en.",
    "projects.listCta.link": "Discutons de votre projet",
    "projects.empty": "Aucun projet pour le moment.",
    "projects.filter.all": "Tous",
    "projects.filter.web": "Web",
    "projects.filter.saas": "SaaS",
    "projects.filter.mobile": "Mobile",
    "projects.filter.label": "Filtrer par type",
    "projects.filter.none": "Aucun projet pour ce filtre.",
    "projects.visit": "Visiter le projet",
    "projects.viewSource": "Voir le code source",
    "projects.aim": "Objectif",
    "projects.result": "Résultat",
    "projects.stack": "Stack technique",
    "projects.backToList": "← Tous les projets",
    "projects.context.personal": "Personnel",
    "projects.context.client": "Client",
    "projects.context.side": "Projet perso",
    "projects.context.oss": "Open source",
    "theme.toggle": "Changer le thème",
    "theme.light": "Clair",
    "theme.dark": "Sombre",
    "theme.system": "Système",
    "lang.menu": "Changer de langue",
    "footer.builtWith": "Construit avec Astro, déployé sur Vercel.",
    "footer.rss": "Flux RSS",
    "footer.nav": "Navigation",
    "footer.legal": "Légal",
    "footer.legalNotice": "Mentions légales",
    "footer.privacy": "Politique de confidentialité",
    "error.404.title": "404",
    "error.404.lead": "Cette page a pris un café…",
    "error.404.message":
      "Elle n’existe pas (ou plus). Voici les derniers articles du blog en attendant.",
    "error.recentArticles": "Derniers articles",
    "error.backHome": "Retour à l’accueil",
  },
  en: {
    "nav.home": "Home",
    "nav.blog": "Blog",
    "nav.projects": "Projects",
    "nav.services": "Services",
    "nav.about": "About",
    "nav.menu": "Menu",
    "nav.mainNav": "Main navigation",
    "nav.skipToContent": "Skip to content",
    "meta.homeTitle": "Freelance Web & Mobile Developer in Lyon",
    "meta.projectsTitle": "Web & Mobile Development Projects",
    "meta.blogTitle": "Blog — Web & Mobile Development",
    "meta.homeDescription":
      "Freelance developer in Lyon building fast web and mobile apps, from the first screen to production (Python, React Native).",
    "meta.projectsDescription":
      "A selection of freelance web and mobile projects: the Fusily mobile app, a lawyer’s business website, the dotcraft QR code generator and more.",
    "meta.blogDescription":
      "Field notes and best practices on web and mobile development (Astro, React Native, Django), from a freelance developer based in Lyon.",
    "home.contact.github": "GitHub",
    "home.contact.linkedin": "LinkedIn",
    "home.contact.malt": "Malt",
    "home.contact.fiverr": "Fiverr",
    "home.contact.emailLabel": "Or email me directly",
    "blog.title": "Blog",
    "blog.subtitle":
      "Notes and field lessons from a freelance web & mobile developer in Lyon.",
    "blog.empty": "No posts yet.",
    "blog.published": "Published on",
    "blog.backToList": "← All posts",
    "blog.tocLabel": "On this page",
    // End-of-article conversion block (author card + CTAs).
    "blog.cta.bio":
      "Guillaume Ojardias, freelance web & mobile developer in Lyon. I help SMEs, non-profits and project owners go from idea to launch.",
    "blog.cta.heading": "A web or mobile project in mind?",
    "blog.cta.lead":
      "Tell me about your idea in a few words: you’ll get a reply within 24 h, a free quote, no commitment.",
    "blog.cta.primary": "Let’s talk about your project",
    "blog.cta.secondary": "See all services",
    "projects.title": "Projects",
    "projects.subtitle":
      "Web and mobile apps designed and delivered end to end, freelance from Lyon, for SMEs, non-profits and project owners.",
    "projects.similarCta.title": "A similar project in mind? Let’s talk.",
    "projects.similarCta.primary": "Let’s talk about your project",
    "projects.similarCta.secondary": "See all services",
    "projects.listCta.title": "Your project could be next — let’s talk.",
    "projects.listCta.link": "Let’s talk about your project",
    "projects.empty": "No projects yet.",
    "projects.filter.all": "All",
    "projects.filter.web": "Web",
    "projects.filter.saas": "SaaS",
    "projects.filter.mobile": "Mobile",
    "projects.filter.label": "Filter by type",
    "projects.filter.none": "No projects for this filter.",
    "projects.visit": "Visit project",
    "projects.viewSource": "View source code",
    "projects.aim": "Goal",
    "projects.result": "Result",
    "projects.stack": "Tech stack",
    "projects.backToList": "← All projects",
    "projects.context.personal": "Personal",
    "projects.context.client": "Client",
    "projects.context.side": "Side project",
    "projects.context.oss": "Open source",
    "theme.toggle": "Toggle theme",
    "theme.light": "Light",
    "theme.dark": "Dark",
    "theme.system": "System",
    "lang.menu": "Change language",
    "footer.builtWith": "Built with Astro, deployed on Vercel.",
    "footer.rss": "RSS feed",
    "footer.nav": "Navigation",
    "footer.legal": "Legal",
    "footer.legalNotice": "Legal notice",
    "footer.privacy": "Privacy policy",
    "error.404.title": "404",
    "error.404.lead": "This page took a coffee break…",
    "error.404.message":
      "It doesn’t exist (or not anymore). Here are the latest blog articles instead.",
    "error.recentArticles": "Latest articles",
    "error.backHome": "Back to home",
  },
} as const satisfies Record<Locale, Record<string, string>>;

export type TranslationKey = keyof (typeof dictionaries)["fr"];

export const t = (locale: Locale, key: TranslationKey): string => {
  const entry = dictionaries[locale]?.[key];
  if (entry) return entry;
  return dictionaries.fr[key] ?? key;
};

export const formatDate = (date: Date, locale: Locale): string =>
  date.toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

export const otherLocale = (locale: Locale): Locale =>
  locale === "fr" ? "en" : "fr";

export const localizedPath = (locale: Locale, path: string): string => {
  const cleaned = path.startsWith("/") ? path : `/${path}`;
  if (locale === "fr") return cleaned;
  return `/en${cleaned === "/" ? "" : cleaned}`;
};

/** Append a trailing slash unless present — the site's canonical URL form. */
export const ensureTrailingSlash = (path: string): string =>
  path.endsWith("/") ? path : `${path}/`;

export const articlePath = (locale: Locale, slug: string): string =>
  `${localizedPath(locale, `/blog/${slug}`)}/`;

export const projectPath = (locale: Locale, slug: string): string =>
  `${localizedPath(locale, `/projects/${slug}`)}/`;

export interface NavItem {
  href: string;
  label: string;
  /** Rendered as a prominent button rather than a plain link. */
  cta?: boolean;
}

/**
 * Primary navigation, shared by Header and Footer. Top-level pages plus a
 * contact CTA (reusing the hero CTA copy so the nav stays in sync).
 */
export const navItems = (locale: Locale): NavItem[] => {
  const home = localizedPath(locale, "/");
  return [
    { href: home, label: t(locale, "nav.home") },
    {
      href: localizedPath(locale, "/services"),
      label: t(locale, "nav.services"),
    },
    {
      href: localizedPath(locale, "/projects"),
      label: t(locale, "nav.projects"),
    },
    { href: localizedPath(locale, "/about"), label: t(locale, "nav.about") },
    { href: localizedPath(locale, "/blog"), label: t(locale, "nav.blog") },
    { href: `${home}#contact`, label: hero.ctaPrimary[locale], cta: true },
  ];
};
