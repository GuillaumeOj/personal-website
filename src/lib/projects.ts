import type { ImageMetadata } from "astro";
import dotcraftEn from "../assets/projects/dotcraft-en.png";
import dotcraftFr from "../assets/projects/dotcraft-fr.png";
import ebAvocatCover from "../assets/projects/eb-avocat.png";
import fusilyEnDark from "../assets/projects/fusily-en-dark.png";
import fusilyEnLight from "../assets/projects/fusily-en-light.png";
import fusilyFrDark from "../assets/projects/fusily-fr-dark.png";
import fusilyFrLight from "../assets/projects/fusily-fr-light.png";
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
  /** Wide hero used on the detail view; falls back to `cover` */
  banner?: LocalizedImage;
  year?: number;
  /**
   * Per-locale copy: short card `description`, the project's `aim`, and a
   * longer `longDescription` shown on the detail page.
   * NOTE: longDescription values below are first drafts — Guillaume to refine.
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
    year: 2024,
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
    slug: "personal-website",
    name: { fr: "Site personnel", en: "Personal website" },
    // Steer clear of "blog" here — the blog list and articles already own that
    // query; naming the stack keeps this a build/case-study, not a competitor.
    titleDescriptor: {
      fr: "Astro, i18n & Notion",
      en: "Astro, i18n & Notion",
    },
    url: "https://guillaume.ojardias.info",
    repoUrl: "https://github.com/GuillaumeOj/personal-website",
    context: "side",
    platform: ["web"],
    stack: ["Astro", "Tailwind CSS", "Notion", "Vercel"],
    cover: {
      fr: { light: personalFrLight, dark: personalFrDark },
      en: { light: personalEnLight, dark: personalEnDark },
    },
    year: 2025,
    content: {
      fr: {
        description:
          "Ce site : blog adossé à Notion, bilingue, déployé sur Vercel.",
        aim: "Un espace personnel pour écrire et présenter mon travail.",
        longDescription:
          "Ce site est construit avec Astro et Tailwind CSS, entièrement bilingue (français / anglais), et déployé sur Vercel. Le blog est adossé à Notion : j’écris mes articles dans Notion et un webhook déclenche la reconstruction du site, les images étant persistées pour rester disponibles. Un terrain de jeu pour soigner les performances, l’accessibilité et le référencement.",
      },
      en: {
        description:
          "This site: a bilingual, Notion-backed blog deployed on Vercel.",
        aim: "A personal space to write and showcase my work.",
        longDescription:
          "This site is built with Astro and Tailwind CSS, fully bilingual (French / English), and deployed on Vercel. The blog is backed by Notion: I write posts in Notion and a webhook triggers a rebuild, with images persisted so they stay available. A playground to sharpen performance, accessibility and SEO.",
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
    year: 2025,
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
    year: 2024,
    content: {
      fr: {
        description:
          "Site vitrine d’un cabinet d’avocate spécialisé en droit des sociétés.",
        aim: "Présenter le cabinet et ses domaines d’intervention — droit des sociétés (contrats, créations de sociétés, etc.), avec un focus sur les professions libérales (avocats, médecins, dentistes…).",
        longDescription:
          "Site vitrine réalisé pour un cabinet d’avocate en droit des sociétés, développé avec Next.js, React, TypeScript et Tailwind CSS. Objectif : présenter clairement le cabinet et ses domaines d’intervention, inspirer confiance et faciliter la prise de contact. Un projet client livré clés en main — le code et l’hébergement restent la propriété de la cliente.",
      },
      en: {
        description:
          "Business website for a lawyer specialized in companies law.",
        aim: "Present the practice and its areas of expertise — companies law (contracts, company formation, etc.), with a focus on liberal professions (lawyers, doctors, dentists…).",
        longDescription:
          "A business website built for a lawyer specialized in companies law, developed with Next.js, React, TypeScript and Tailwind CSS. The goal: clearly present the practice and its areas of expertise, build trust and make getting in touch easy. A turnkey client project — the code and hosting remain the client’s property.",
      },
    },
  },
];

/** Explicit display order (first → last) for the list and the home teaser. */
const DISPLAY_ORDER = [
  "fusily",
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
