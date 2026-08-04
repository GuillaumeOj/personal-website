import type { ImageMetadata } from "astro";
import dotcraftEn from "../assets/projects/dotcraft-en.png";
import dotcraftFr from "../assets/projects/dotcraft-fr.png";
import ebAvocatCover from "../assets/projects/eb-avocat.png";
import fusilyEnDark from "../assets/projects/fusily-en-dark.webp";
import fusilyEnLight from "../assets/projects/fusily-en-light.webp";
import fusilyFrDark from "../assets/projects/fusily-fr-dark.webp";
import fusilyFrLight from "../assets/projects/fusily-fr-light.webp";
import maGardeSereineEnDark from "../assets/projects/ma-garde-sereine-en-dark.png";
import maGardeSereineEnLight from "../assets/projects/ma-garde-sereine-en-light.png";
import maGardeSereineFrDark from "../assets/projects/ma-garde-sereine-fr-dark.png";
import maGardeSereineFrLight from "../assets/projects/ma-garde-sereine-fr-light.png";
import personalEnDark from "../assets/projects/personal-website-en-dark.png";
import personalEnLight from "../assets/projects/personal-website-en-light.png";
import personalFrDark from "../assets/projects/personal-website-fr-dark.png";
import personalFrLight from "../assets/projects/personal-website-fr-light.png";
import type { Locale } from "../config";

export type ProjectContext = "personal" | "client" | "side" | "oss";

/** Platform/type used to filter the projects grid. A project may have several. */
export type ProjectPlatform = "web" | "saas" | "mobile";

/** Filter display order. */
const PLATFORM_ORDER: ProjectPlatform[] = ["web", "saas", "mobile"];

/** A light/dark pair for theme-aware screenshots. */
export type ThemeVariants = { light: ImageMetadata; dark: ImageMetadata };
/** A single image, or one per theme. */
type ThemeImage = ImageMetadata | ThemeVariants;
/** A theme-image, or one theme-image per locale (e.g. localized screenshots). */
export type LocalizedImage = ThemeImage | Record<Locale, ThemeImage>;

const isImageMetadata = (
  value: ThemeImage | LocalizedImage,
): value is ImageMetadata => "src" in value;
const isThemeVariants = (
  value: ThemeVariants | Record<Locale, ThemeImage>,
): value is ThemeVariants => "light" in value && "dark" in value;

/**
 * Resolve a `LocalizedImage` down to a `{ light, dark }` pair for the given
 * locale. When the image has no theme variants, light and dark are identical
 * (the same reference), so callers can render a single `<Image>`.
 */
export const resolveImage = (
  image: LocalizedImage,
  locale: Locale,
): ThemeVariants => {
  const themed: ThemeImage = isImageMetadata(image)
    ? image
    : isThemeVariants(image)
      ? image
      : image[locale];
  return isImageMetadata(themed) ? { light: themed, dark: themed } : themed;
};

export interface Project {
  /** URL segment + stable key, shared across locales */
  slug: string;
  /** Display name: a shared string, or one per locale when it needs translating */
  name: string | Record<Locale, string>;
  /**
   * Short (2–4 word) descriptor appended to the SEO `<title>` as
   * `{name} — {descriptor} — {SITE.name}`, so the project isn't a bare name in
   * search results. Keep it terse — the three-part title must survive ~60 chars.
   */
  titleDescriptor?: Record<Locale, string>;
  /** Live project URL */
  url?: string;
  /** Optional source/repository link */
  repoUrl?: string;
  /** Context label is localized via i18n (`projects.context.*`) */
  context: ProjectContext;
  /** Platform(s) — drives the projects filter and the card tags. */
  platform: ProjectPlatform[];
  /** Tech stack, e.g. ['Astro', 'Django', 'PostgreSQL'] */
  stack: string[];
  /** 16:9 screenshot used on the summary card */
  cover: LocalizedImage;
  /**
   * Optional per-locale descriptive `alt` for the screenshot, consumed as
   * `project.imageAlt?.[locale]` (with a fallback to the generic
   * "Capture d'écran de {name}"). Describe what the screenshot actually shows —
   * factual, never invented — to help image search and screen readers.
   */
  imageAlt?: Record<Locale, string>;
  /** Wide hero used on the detail view; falls back to `cover` */
  banner?: LocalizedImage;
  year?: number;
  /**
   * Optional factual outcome/result line, shown on the card (under the
   * description) and on the detail page (as a `<dl>` entry). Only verifiable
   * facts already known about the project — never invented metrics.
   */
  result?: Record<Locale, string>;
  /**
   * Per-locale copy: short card `description`, the project's `aim`, and a
   * longer `longDescription` shown on the detail page.
   */
  content: Record<
    Locale,
    { description: string; aim: string; longDescription: string }
  >;
}

export const projects: Project[] = [
  {
    slug: "fusily",
    name: "Fusily",
    titleDescriptor: {
      fr: "Application mobile de repas",
      en: "Meal-planning mobile app",
    },
    url: "https://fusily.com",
    context: "personal",
    platform: ["mobile"],
    stack: ["Django", "DRF", "PostgreSQL", "React Native", "Expo"],
    cover: {
      fr: { light: fusilyFrLight, dark: fusilyFrDark },
      en: { light: fusilyEnLight, dark: fusilyEnDark },
    },
    imageAlt: {
      fr: "Écran d’accueil de l’application mobile Fusily",
      en: "Fusily mobile app home screen",
    },
    year: 2024,
    result: {
      fr: "Publiée sur l’App Store et Google Play, en ligne depuis 2024.",
      en: "Published on the App Store and Google Play, live since 2024.",
    },
    content: {
      fr: {
        description:
          "Application mobile (iOS et Android) pour organiser les repas de la semaine.",
        aim: "Aider à planifier les repas de la semaine, n’acheter que le nécessaire, varier les plats à chaque fois et découvrir de nouvelles recettes.",
        longDescription:
          "Fusily est un produit complet que je construis de bout en bout : une application mobile React Native / Expo publiée sur iOS et Android, adossée à un backend Django / DRF et une base PostgreSQL. On y crée, partage et planifie des recettes, on génère sa liste de courses, et on réduit le gaspillage en n’achetant que le nécessaire. Du modèle de données au déploiement des stores, chaque brique — API, authentification, notifications, mise en production — est pensée pour durer.",
      },
      en: {
        description:
          "Mobile app (iOS and Android) to organize your week’s meals.",
        aim: "Help people plan their week’s meals, buy only what they need, eat something different each time and discover new recipes.",
        longDescription:
          "Fusily is a full product I build end to end: a React Native / Expo mobile app shipped on iOS and Android, backed by a Django / DRF backend and a PostgreSQL database. You create, share and plan recipes, generate your shopping list, and cut waste by buying only what you need. From the data model to store deployment, every piece — API, authentication, notifications, going to production — is built to last.",
      },
    },
  },
  {
    slug: "ma-garde-sereine",
    name: "Ma Garde Sereine",
    titleDescriptor: {
      fr: "Garde partagée à domicile",
      en: "Shared childcare app",
    },
    url: "https://ma-garde-sereine.fr",
    context: "personal",
    platform: ["web", "saas"],
    stack: ["Django", "DRF", "PostgreSQL", "React"],
    cover: {
      fr: { light: maGardeSereineFrLight, dark: maGardeSereineFrDark },
      en: { light: maGardeSereineEnLight, dark: maGardeSereineEnDark },
    },
    imageAlt: {
      fr: "Page d’accueil du site de l’application Ma Garde Sereine",
      en: "Home page of the Ma Garde Sereine app website",
    },
    year: 2026,
    result: {
      fr: "En bêta, pour la garde partagée d’enfants à domicile.",
      en: "In beta, for shared in-home childcare.",
    },
    content: {
      fr: {
        description:
          "Application web pour gérer la garde partagée à domicile de son enfant.",
        aim: "Aider les familles à gérer le contrat de leur garde à domicile et à préparer leur déclaration pajemploi chaque mois, y compris en garde partagée entre deux familles.",
        longDescription:
          "Ma Garde Sereine est une application web, actuellement en bêta, qui accompagne les familles employant une garde d’enfants à domicile — notamment en garde partagée entre deux familles. Elle permet de cadrer le contrat (taux net, planning hebdomadaire, congés payés, jours fériés) et de préparer sereinement la déclaration pajemploi chaque mois : les heures normales, majorées et les jours fériés sont suivis au fil du mois, puis répartis entre les familles pour que chacune déclare sa part. Conçue pour la garde à domicile relevant de la convention IDCC 3239, elle vise à alléger la charge administrative pour laisser plus de place à la relation avec la personne qui veille sur les enfants.",
      },
      en: {
        description:
          "Web app to manage shared in-home childcare for your children.",
        aim: "Help families manage their in-home nanny’s contract and prepare their monthly pajemploi declaration, including shared care between two families.",
        longDescription:
          "Ma Garde Sereine is a web app, currently in beta, that helps families employing an in-home nanny — especially in shared care between two families. It frames the contract (net rate, weekly schedule, paid leave, public holidays) and calmly prepares the monthly pajemploi declaration: regular, overtime and public-holiday hours are tracked through the month, then split between families so each declares its own share. Built for in-home childcare under the IDCC 3239 collective agreement, it aims to lighten the administrative load so families can focus on the relationship with the person who cares for their children.",
      },
    },
  },
  {
    slug: "personal-website",
    name: { fr: "Site personnel", en: "Personal website" },
    // Steer clear of "blog" here — the blog list and articles already own that
    // query; naming the stack keeps this a build/case-study, not a competitor.
    titleDescriptor: {
      fr: "Astro, i18n & Markdown",
      en: "Astro, i18n & Markdown",
    },
    url: "https://guillaume.ojardias.info",
    repoUrl: "https://github.com/GuillaumeOj/personal-website",
    context: "side",
    platform: ["web"],
    stack: ["Astro", "Tailwind CSS", "Markdown", "Vercel"],
    cover: {
      fr: { light: personalFrLight, dark: personalFrDark },
      en: { light: personalEnLight, dark: personalEnDark },
    },
    imageAlt: {
      fr: "Page d’accueil du site personnel de Guillaume Ojardias",
      en: "Home page of Guillaume Ojardias’ personal website",
    },
    year: 2025,
    result: {
      fr: "En production sur Vercel, pensé pour la perf, l’accessibilité et le SEO.",
      en: "In production on Vercel, tuned for performance, accessibility and SEO.",
    },
    content: {
      fr: {
        description:
          "Ce site : blog bilingue en Markdown versionné, déployé sur Vercel.",
        aim: "Un espace personnel pour écrire et présenter mon travail.",
        longDescription:
          "Ce site est construit avec Astro et Tailwind CSS, entièrement bilingue (français / anglais), et déployé sur Vercel. Les articles sont des fichiers Markdown versionnés avec le code : chaque publication passe par une pull request, les images vivent dans le dépôt, et un push suffit à déclencher le déploiement. Un terrain de jeu pour soigner les performances, l’accessibilité et le référencement.",
      },
      en: {
        description:
          "This site: a bilingual blog written in version-controlled Markdown, deployed on Vercel.",
        aim: "A personal space to write and showcase my work.",
        longDescription:
          "This site is built with Astro and Tailwind CSS, fully bilingual (French / English), and deployed on Vercel. Posts are Markdown files versioned alongside the code: every publication goes through a pull request, images live in the repository, and a push is all it takes to deploy. A playground to sharpen performance, accessibility and SEO.",
      },
    },
  },
  {
    slug: "dotcraft",
    name: "dotcraft",
    titleDescriptor: {
      fr: "Générateur de QR codes",
      en: "QR code generator",
    },
    url: "https://dotcraft.fr",
    repoUrl: "https://github.com/GuillaumeOj/dotcraft",
    context: "side",
    platform: ["web"],
    stack: ["React", "TypeScript", "Vite"],
    cover: { fr: dotcraftFr, en: dotcraftEn },
    imageAlt: {
      fr: "Interface du générateur de QR codes dotcraft",
      en: "dotcraft QR code generator interface",
    },
    year: 2025,
    result: {
      fr: "En production, 100% côté client, sans compte ni serveur.",
      en: "In production, fully client-side, no account or server.",
    },
    content: {
      fr: {
        description:
          "Générateur de QR codes directement dans le navigateur, sans serveur.",
        aim: "Créer et conserver ses QR codes entièrement côté client, en utilisant uniquement le localStorage du navigateur — pas de compte, pas de backend.",
        longDescription:
          "dotcraft est une application web React / TypeScript qui génère des QR codes entièrement côté client. Aucun serveur, aucun compte : les codes sont créés et conservés dans le localStorage du navigateur. Un exemple d’application rapide et respectueuse de la vie privée, où toute la logique vit dans le navigateur.",
      },
      en: {
        description:
          "QR code generator that runs entirely in the browser, with no server.",
        aim: "Create and keep your QR codes fully client-side, using only the browser’s localStorage — no account, no backend.",
        longDescription:
          "dotcraft is a React / TypeScript web app that generates QR codes entirely client-side. No server, no account: codes are created and kept in the browser’s localStorage. An example of a fast, privacy-friendly app where all the logic lives in the browser.",
      },
    },
  },
  {
    slug: "eva-biezunski-avocate",
    name: "Eva Biezunski Avocate",
    // Short descriptor: the name already carries "Avocate", and the full
    // three-part title must clear ~60 chars without clipping.
    titleDescriptor: {
      fr: "Site vitrine",
      en: "Business website",
    },
    url: "https://biezunski-avocat.fr",
    repoUrl: "https://github.com/EB-Avocat/eb-avocat",
    context: "client",
    platform: ["web"],
    stack: ["Next.js", "React", "Tailwind CSS", "TypeScript"],
    cover: ebAvocatCover,
    imageAlt: {
      fr: "Page d’accueil du site vitrine de l’avocate Eva Biezunski",
      en: "Home page of lawyer Eva Biezunski’s business website",
    },
    year: 2026,
    result: {
      fr: "Projet client livré clés en main, en ligne depuis juin 2026.",
      en: "Turnkey client project, live since June 2026.",
    },
    content: {
      fr: {
        description:
          "Site vitrine d’un cabinet d’avocate spécialisé en droit des sociétés.",
        aim: "Présenter le cabinet et ses domaines d’intervention — droit des sociétés (contrats, créations de sociétés, etc.), avec un focus sur les professions libérales (avocats, médecins, dentistes…).",
        longDescription:
          "La cliente, avocate en droit des sociétés, avait besoin d’un site vitrine pour présenter clairement son cabinet, inspirer confiance et faciliter la prise de contact. Le site a été livré clés en main, en ligne depuis juin 2026, développé avec Next.js, React, TypeScript et Tailwind CSS. Le code et l’hébergement restent la propriété de la cliente.",
      },
      en: {
        description:
          "Business website for a lawyer specialized in companies law.",
        aim: "Present the practice and its areas of expertise — companies law (contracts, company formation, etc.), with a focus on liberal professions (lawyers, doctors, dentists…).",
        longDescription:
          "The client, a lawyer specialized in companies law, needed a business website to clearly present her practice, build trust and make getting in touch easy. The site was delivered turnkey, live since June 2026, built with Next.js, React, TypeScript and Tailwind CSS. The code and hosting remain the client’s property.",
      },
    },
  },
];

/** Explicit display order (first → last) for the list and the home teaser. */
const DISPLAY_ORDER = [
  "fusily",
  "ma-garde-sereine",
  "eva-biezunski-avocate",
  "dotcraft",
  "personal-website",
];

/** Rank a slug by its place in DISPLAY_ORDER; unlisted projects sort last. */
const displayRank = (slug: string): number => {
  const index = DISPLAY_ORDER.indexOf(slug);
  return index === -1 ? DISPLAY_ORDER.length : index;
};

export const getProjects = (): Project[] =>
  [...projects].sort((a, b) => displayRank(a.slug) - displayRank(b.slug));

export const getProjectBySlug = (slug: string): Project | undefined =>
  projects.find((p) => p.slug === slug);

/** Platforms present across all projects, in display order — powers the filter. */
export const getAvailablePlatforms = (): ProjectPlatform[] => {
  const present = new Set(projects.flatMap((p) => p.platform));
  return PLATFORM_ORDER.filter((platform) => present.has(platform));
};

export const localizedName = (project: Project, locale: Locale): string =>
  typeof project.name === "string" ? project.name : project.name[locale];
