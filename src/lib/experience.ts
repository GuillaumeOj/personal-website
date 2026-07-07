import type { Locale } from '../config';

/** A localized string, one entry per locale. */
type Localized = Record<Locale, string>;

export interface ExperienceEntry {
  /** Logo path under /public/logos */
  logo: string;
  alt: string;
  /** Some logos (Mergify's dark mark) need a white plate to stay legible. */
  logoPlate?: boolean;
  role: Localized;
  /** Organization label as displayed (may already read like "A → B"). */
  org: string;
  url: string;
  period: Localized;
  description: Localized;
}

const experience: ExperienceEntry[] = [
  {
    logo: '/logos/fusily.png',
    alt: 'Logo Fusily',
    role: {
      fr: 'Fondateur & développeur fullstack',
      en: 'Founder & fullstack developer',
    },
    org: 'Fusily',
    url: 'https://fusily.com',
    period: { fr: 'sept. 2024 → aujourd’hui', en: 'Sep 2024 → present' },
    description: {
      fr: 'Application mobile iOS/Android pour créer, partager et planifier des recettes, tout en réduisant le gaspillage alimentaire.',
      en: 'iOS/Android mobile app to create, share and plan recipes while reducing food waste.',
    },
  },
  {
    logo: '/logos/sketchfab.png',
    alt: 'Logo Sketchfab',
    role: { fr: 'Développeur backend Python', en: 'Python backend developer' },
    org: 'Sketchfab → Epic Games (FAB)',
    url: 'https://www.fab.com',
    period: { fr: 'mai 2021 → févr. 2024', en: 'May 2021 → Feb 2024' },
    description: {
      fr: 'Backend Django/DRF de Sketchfab, plateforme 3D collaborative ; après le rachat par Epic Games, contribution au lancement de FAB, la marketplace d’assets pour créateurs.',
      en: 'Django/DRF backend of Sketchfab, a collaborative 3D platform; after the Epic Games acquisition, contributed to launching FAB, the asset marketplace for creators.',
    },
  },
  {
    logo: '/logos/mergify.svg',
    alt: 'Logo Mergify',
    logoPlate: true,
    role: {
      fr: 'Développeur Python (stage)',
      en: 'Python developer (internship)',
    },
    org: 'Mergify',
    url: 'https://mergify.com',
    period: { fr: 'août 2020 → févr. 2021', en: 'Aug 2020 → Feb 2021' },
    description: {
      fr: 'Stage de fin d’études sur l’outil d’automatisation de pull requests Git/GitHub.',
      en: 'End-of-studies internship on the Git/GitHub pull-request automation tool.',
    },
  },
];

export const getExperience = (): ExperienceEntry[] => experience;
