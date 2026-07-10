import type { Locale } from "../config";

/** A localized string, one entry per locale. */
type Localized = Record<Locale, string>;

/** A localized list of strings, one entry per locale. */
type LocalizedList = Record<Locale, string[]>;

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
  /** Intro paragraph. */
  description: Localized;
  /** Bullet-point highlights. */
  highlights?: LocalizedList;
  /** Optional closing paragraph. */
  note?: Localized;
}

const experience: ExperienceEntry[] = [
  {
    logo: "/logos/fusily.png",
    alt: "Logo Fusily",
    role: {
      fr: "Fondateur & Développeur Full-Stack",
      en: "Founder & Full-Stack Developper",
    },
    org: "Fusily",
    url: "https://fusily.com",
    period: { fr: "sept. 2024 → aujourd’hui", en: "Sep 2024 → present" },
    description: {
      fr: "Fusily est une application mobile (iOS et Android) qui simplifie la création et le partage de recettes ainsi que la planification des repas, tout en réduisant le gaspillage alimentaire. J’ai conçu, développé et publié le produit de bout en bout, seul :",
      en: "Fusily is a mobile app (iOS and Android) that simplifies creating and sharing recipes as well as meal planning, while reducing food waste. I designed, built and shipped the product end-to-end, on my own:",
    },
    highlights: {
      fr: [
        "Application mobile React Native / Expo, publiée sur l’App Store et Google Play",
        "Backend Django / DRF avec base PostgreSQL : comptes utilisateurs, recettes, planification de repas, listes de courses",
        "Pipeline de livraison : builds EAS, mises à jour OTA, stratégie de versions alignée sur les runtimes natifs",
        "Design de l’identité de marque et des interfaces, captures d’écran multilingues pour les stores",
        "Contenu et marketing : site web, réseaux sociaux (Reels), automatisation de la production de contenu",
      ],
      en: [
        "React Native / Expo mobile app, published on the App Store and Google Play",
        "Django / DRF backend with a PostgreSQL database: user accounts, recipes, meal planning, shopping lists",
        "Delivery pipeline: EAS builds, OTA updates, versioning strategy aligned with native runtimes",
        "Brand identity and UI design, multilingual store screenshots",
        "Content and marketing: website, social media (Reels), content-production automation",
      ],
    },
    note: {
      fr: "Fusily est aussi mon laboratoire grandeur nature : chaque décision produit, technique et design y est la mienne — c’est le même niveau de soin que j’apporte aux projets de mes clients.",
      en: "Fusily is also my real-world lab: every product, technical and design decision is mine — the same level of care I bring to my clients’ projects.",
    },
  },
  {
    logo: "/logos/medsmart.png",
    alt: "Logo Medsmart",
    role: { fr: "Développeur backend Python", en: "Python Backend Developer" },
    org: "Medsmart",
    url: "https://medsmart.eu",
    period: { fr: "juil. 2024 → sept. 2024", en: "Jul 2024 → Sep 2024" },
    description: {
      fr: "Développement backend (Python / Django) pour le système de télétransmission entre les mutuelles et les praticiens de médecine douce (ostéopathes, hypnothérapeutes, etc.) :",
      en: "Backend development (Python / Django) for the claims-transmission system between health insurers and alternative-medicine practitioners (osteopaths, hypnotherapists, etc.):",
    },
    highlights: {
      fr: [
        "Intégration d’un système pour la prise en charge des mutuelles utilisant le même numéro AMC",
        "Mises à jour et correction de bug sur l’outil dédié à la gestion de cabinets",
      ],
      en: [
        "Integration of a system to handle insurers sharing the same AMC number",
        "Updates and bug fixes on the practice-management tool",
      ],
    },
  },
  {
    logo: "/logos/epic-games.png",
    alt: "Logo Epic Games",
    role: { fr: "Développeur backend Python", en: "Python Backend Developer" },
    org: "Epic Games (FAB)",
    url: "https://www.fab.com",
    period: { fr: "juil. 2021 → févr. 2024", en: "Jul 2021 → Feb 2024" },
    description: {
      fr: "Après le rachat de Sketchfab par Epic Games, contribution à la construction de FAB, la marketplace d’assets unifiée d’Epic Games à destination des créateurs (fusion des catalogues Sketchfab, Unreal Marketplace et Quixel), en amont de son lancement.",
      en: "After Epic Games acquired Sketchfab, contributed to building FAB, Epic Games’ unified asset marketplace for creators (merging the Sketchfab, Unreal Marketplace and Quixel catalogs), ahead of its launch.",
    },
    highlights: {
      fr: [
        "Développement backend Python / Django / DRF",
        "Travail sur des enjeux de migration et d’intégration à très grande échelle (catalogues de millions d’assets)",
        "Collaboration avec des équipes distribuées à l’international, en anglais",
      ],
      en: [
        "Python / Django / DRF backend development",
        "Work on very large-scale migration and integration challenges (catalogs of millions of assets)",
        "Collaboration with internationally distributed teams, in English",
      ],
    },
  },
  {
    logo: "/logos/sketchfab.png",
    alt: "Logo Sketchfab",
    role: { fr: "Développeur backend Python", en: "Python Backend Developer" },
    org: "Sketchfab",
    url: "https://sketchfab.com",
    period: { fr: "mai 2021 → févr. 2024", en: "May 2021 → Feb 2024" },
    description: {
      fr: "Développement du backend Django / DRF de Sketchfab, la plateforme collaborative de publication et de visualisation de modèles 3D, utilisée par des millions de créateurs.",
      en: "Development of Sketchfab’s Django / DRF backend, the collaborative platform to publish and view 3D models, used by millions of creators.",
    },
    highlights: {
      fr: [
        "Conception et évolution d’API REST (DRF) au cœur du produit",
        "Travail sur une application Python à fort trafic : performance, fiabilité, qualité (tests, revues de code)",
        "Collaboration au sein d’une équipe internationale, en anglais",
      ],
      en: [
        "Design and evolution of REST APIs (DRF) at the core of the product",
        "Work on a high-traffic Python application: performance, reliability, quality (tests, code reviews)",
        "Collaboration within an international team, in English",
      ],
    },
    note: {
      fr: "Sketchfab a été racheté par Epic Games en juillet 2021.",
      en: "Sketchfab was acquired by Epic Games in July 2021.",
    },
  },
  {
    logo: "/logos/mergify.svg",
    alt: "Logo Mergify",
    logoPlate: true,
    role: {
      fr: "Développeur backend Python",
      en: "Python Backend Developer",
    },
    org: "Mergify",
    url: "https://mergify.com",
    period: { fr: "août 2020 → févr. 2021", en: "Aug 2020 → Feb 2021" },
    description: {
      fr: "Au sein de cette startup spécialisée dans l’automatisation des workflows GitHub, j’ai intégré une équipe réduite composée des deux fondateurs. Ce stage m’a permis de bénéficier d’un mentorat direct et d’une immersion complète dans le développement d’un produit SaaS utilisé par des milliers de développeurs.",
      en: "At this startup specialized in GitHub workflow automation, I joined a small team made up of the two founders. This internship gave me direct mentorship and a full immersion in developing a SaaS product used by thousands of developers.",
    },
    highlights: {
      fr: [
        "Conception et déploiement d’un programme de parrainage",
        "Maintenance et optimisation du produit",
        "Amélioration de la documentation technique",
      ],
      en: [
        "Design and deployment of a referral program",
        "Product maintenance and optimization",
        "Improvement of the technical documentation",
      ],
    },
    note: {
      fr: "Une expérience formatrice, alliant pratique intensive et transmission de savoir-faire par des fondateurs expérimentés. Idéal pour consolider mes compétences en développement et comprendre les enjeux d’un produit technique B2B.",
      en: "A formative experience, combining intensive practice and knowledge transfer from experienced founders. Ideal for consolidating my development skills and understanding the stakes of a B2B technical product.",
    },
  },
];

export const getExperience = (): ExperienceEntry[] => experience;
