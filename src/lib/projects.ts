import type { ImageMetadata } from 'astro';
import dotcraftEn from '../assets/projects/dotcraft-en.png';
import dotcraftFr from '../assets/projects/dotcraft-fr.png';
import ebAvocatCover from '../assets/projects/eb-avocat.png';
import fusilyEnDark from '../assets/projects/fusily-en-dark.png';
import fusilyEnLight from '../assets/projects/fusily-en-light.png';
import fusilyFrDark from '../assets/projects/fusily-fr-dark.png';
import fusilyFrLight from '../assets/projects/fusily-fr-light.png';
import personalEnDark from '../assets/projects/personal-website-en-dark.png';
import personalEnLight from '../assets/projects/personal-website-en-light.png';
import personalFrDark from '../assets/projects/personal-website-fr-dark.png';
import personalFrLight from '../assets/projects/personal-website-fr-light.png';
import type { Locale } from '../config';

export type ProjectContext = 'personal' | 'client' | 'side' | 'oss';

/** A light/dark pair for theme-aware screenshots. */
export type ThemeVariants = { light: ImageMetadata; dark: ImageMetadata };
/** A single image, or one per theme. */
type ThemeImage = ImageMetadata | ThemeVariants;
/** A theme-image, or one theme-image per locale (e.g. localized screenshots). */
export type LocalizedImage = ThemeImage | Record<Locale, ThemeImage>;

const isImageMetadata = (
  value: ThemeImage | LocalizedImage,
): value is ImageMetadata => 'src' in value;
const isThemeVariants = (
  value: ThemeVariants | Record<Locale, ThemeImage>,
): value is ThemeVariants => 'light' in value && 'dark' in value;

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
  /** Live project URL */
  url?: string;
  /** Optional source/repository link */
  repoUrl?: string;
  /** Context label is localized via i18n (`projects.context.*`) */
  context: ProjectContext;
  /** Tech stack, e.g. ['Astro', 'Django', 'PostgreSQL'] */
  stack: string[];
  /** 16:9 screenshot used on the summary card */
  cover: LocalizedImage;
  /** Wide hero used on the detail view; falls back to `cover` */
  banner?: LocalizedImage;
  year?: number;
  featured?: boolean;
  /** Per-locale copy: short card description + the project's aim */
  content: Record<Locale, { description: string; aim: string }>;
}

export const projects: Project[] = [
  {
    slug: 'fusily',
    name: 'Fusily',
    url: 'https://fusily.com',
    context: 'personal',
    stack: ['Django', 'DRF', 'PostgreSQL', 'React Native', 'Expo'],
    cover: {
      fr: { light: fusilyFrLight, dark: fusilyFrDark },
      en: { light: fusilyEnLight, dark: fusilyEnDark },
    },
    year: 2024,
    featured: true,
    content: {
      fr: {
        description:
          'Application mobile (iOS et Android) pour organiser les repas de la semaine.',
        aim: 'Aider à planifier les repas de la semaine, n’acheter que le nécessaire, varier les plats à chaque fois et découvrir de nouvelles recettes.',
      },
      en: {
        description:
          'Mobile app (iOS and Android) to organize your week’s meals.',
        aim: 'Help people plan their week’s meals, buy only what they need, eat something different each time and discover new recipes.',
      },
    },
  },
  {
    slug: 'personal-website',
    name: { fr: 'Site personnel', en: 'Personal website' },
    url: 'https://guillaume.ojardias.info',
    repoUrl: 'https://github.com/GuillaumeOj/personal-website',
    context: 'side',
    stack: ['Astro', 'Tailwind CSS', 'Notion', 'Vercel'],
    cover: {
      fr: { light: personalFrLight, dark: personalFrDark },
      en: { light: personalEnLight, dark: personalEnDark },
    },
    year: 2025,
    content: {
      fr: {
        description:
          'Ce site : blog adossé à Notion, bilingue, déployé sur Vercel.',
        aim: 'Un espace personnel pour écrire et présenter mon travail.',
      },
      en: {
        description:
          'This site: a bilingual, Notion-backed blog deployed on Vercel.',
        aim: 'A personal space to write and showcase my work.',
      },
    },
  },
  {
    slug: 'dotcraft',
    name: 'dotcraft',
    url: 'https://dotcraft.fr',
    repoUrl: 'https://github.com/GuillaumeOj/dotcraft',
    context: 'side',
    stack: ['React', 'TypeScript', 'Vite'],
    cover: { fr: dotcraftFr, en: dotcraftEn },
    year: 2025,
    content: {
      fr: {
        description:
          'Générateur de QR codes directement dans le navigateur, sans serveur.',
        aim: 'Créer et conserver ses QR codes entièrement côté client, en utilisant uniquement le localStorage du navigateur — pas de compte, pas de backend.',
      },
      en: {
        description:
          'QR code generator that runs entirely in the browser, with no server.',
        aim: 'Create and keep your QR codes fully client-side, using only the browser’s localStorage — no account, no backend.',
      },
    },
  },
  {
    slug: 'eva-biezunski-avocate',
    name: 'Eva Biezunski Avocate',
    url: 'https://biezunski-avocat.fr',
    repoUrl: 'https://github.com/EB-Avocat/eb-avocat',
    context: 'client',
    stack: ['Next.js', 'React', 'Tailwind CSS', 'TypeScript'],
    cover: ebAvocatCover,
    year: 2024,
    content: {
      fr: {
        description:
          'Site vitrine d’un cabinet d’avocate spécialisé en droit des sociétés.',
        aim: 'Présenter le cabinet et ses domaines d’intervention — droit des sociétés (contrats, créations de sociétés, etc.), avec un focus sur les professions libérales (avocats, médecins, dentistes…).',
      },
      en: {
        description:
          'Business website for a lawyer specialized in companies law.',
        aim: 'Present the practice and its areas of expertise — companies law (contracts, company formation, etc.), with a focus on liberal professions (lawyers, doctors, dentists…).',
      },
    },
  },
];

export const getProjects = (): Project[] =>
  [...projects].sort(
    (a, b) =>
      Number(b.featured ?? false) - Number(a.featured ?? false) ||
      (b.year ?? 0) - (a.year ?? 0),
  );

export const getProjectBySlug = (slug: string): Project | undefined =>
  projects.find((p) => p.slug === slug);

export const localizedName = (project: Project, locale: Locale): string =>
  typeof project.name === 'string' ? project.name : project.name[locale];
