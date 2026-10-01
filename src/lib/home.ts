/**
 * One-line, above-the-fold proof strip. Single source of truth shared by the
 * home hero and the services hero (`services.ts` imports it as
 * `hero.credibility`) so the two can never drift. No new claims — every element
 * restates an existing fact from the About copy.
 */
export const heroCredibility = {
  fr: "Ex-développeur backend chez Sketchfab (Epic Games) · une app publiée sur l’App Store et Google Play · basé à Lyon",
  en: "Former backend developer at Sketchfab (Epic Games) · an app published on the App Store and Google Play · based in Lyon",
};

export const hero = {
  eyebrow: {
    fr: "Développeur full-stack web et mobile · freelance",
    en: "Full-stack web & mobile developer · freelance",
  },
  title: {
    fr: "Votre application web ou mobile, de l’idée à la mise en ligne.",
    en: "Your web or mobile app, from idea to launch.",
  },
  lead: {
    fr: "Confiez tout votre projet à un seul partenaire — design, développement, déploiement et suivi — et consacrez-vous à votre activité.",
    en: "Hand your whole project to a single partner — design, development, deployment and follow-up — and get on with running your business.",
  },
  // "Who I work with" cue on the first screen: lets a visitor self-identify as
  // the intended client, and carries the "Lyon" local keyword naturally on the
  // highest-authority page.
  audience: {
    fr: "Pour les PME, associations et porteurs de projet, à Lyon et partout en France.",
    en: "For SMEs, non-profits and project owners, in Lyon and across France.",
  },
  ctaSecondary: { fr: "Voir des réalisations", en: "See recent work" },
  // Kinetic closing line: "<lead> <rotating word>". The rotating word types
  // in, holds, deletes and swaps on a calm loop (see Hero.astro). Index 0 is
  // the serious, safe default — server-rendered so the sentence reads with JS
  // off — and stays first for reduced-motion visitors. Keep phrases short
  // (≤ ~28 chars) so the reserved line height and mobile wrapping stay stable.
  closingLead: {
    fr: "Pendant ce temps, vous restez",
    en: "Meanwhile, you stay",
  },
  closingRotating: {
    fr: [
      "concentré sur votre métier",
      "tourné vers vos clients",
      "serein",
      "maître de votre temps",
      "propriétaire de votre produit",
    ],
    en: [
      "focused on your business",
      "focused on your customers",
      "at ease",
      "in control of your time",
      "the owner of your product",
    ],
  },
};

export const whatIDo = {
  eyebrow: { fr: "Ce que vous obtenez", en: "What you get" },
  title: {
    fr: "Un produit web ou mobile complet, prêt pour vos utilisateurs.",
    en: "A complete web or mobile product, ready for your users.",
  },
  lead: {
    fr: "Interfaces soignées, logique métier robuste, base de données, API et mise en production : toute la chaîne est couverte, avec un seul interlocuteur.",
    en: "Polished interfaces, robust business logic, database, APIs and shipping to production: the whole chain is covered, with a single point of contact.",
  },
  pillars: [
    {
      key: "frontend",
      label: { fr: "Frontend", en: "Frontend" },
      desc: {
        fr: "Des interfaces web et mobiles responsives, accessibles et agréables pour vos utilisateurs.",
        en: "Responsive, accessible web & mobile interfaces your users enjoy.",
      },
    },
    {
      key: "backend",
      label: { fr: "Backend", en: "Backend" },
      desc: {
        fr: "API, logique métier et bases de données solides, prêtes à encaisser la croissance.",
        en: "Solid APIs, business logic and databases, ready to handle growth.",
      },
    },
    {
      key: "devops",
      label: { fr: "DevOps", en: "DevOps" },
      desc: {
        fr: "Déploiement, hébergement et automatisation : votre produit est en ligne et le reste.",
        en: "Deployment, hosting and automation: your product goes live and stays live.",
      },
    },
  ],
};

export const tech = {
  groups: [
    {
      label: { fr: "Backend", en: "Backend" },
      items: ["Python", "Django", "DRF", "PostgreSQL"],
    },
    {
      label: { fr: "Frontend", en: "Frontend" },
      items: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    },
    {
      label: { fr: "Mobile", en: "Mobile" },
      items: ["React Native", "Expo"],
    },
    {
      label: { fr: "DevOps", en: "DevOps" },
      items: ["Docker", "CI/CD", "AWS", "Heroku", "Vercel"],
    },
  ],
};

/**
 * Home "What you get" → services page link. The detailed web/mobile lists that
 * used to live here now have their canonical home on `/services`.
 */
export const whatIDoMore = {
  fr: "Voir le détail des prestations",
  en: "See all services",
};

/** Home "Working together" process → full step descriptions on `/services`. */
export const processMore = {
  fr: "Comment se déroule un projet",
  en: "How a project unfolds",
};

export const howIWork = {
  eyebrow: { fr: "Travailler ensemble", en: "Working together" },
  title: {
    fr: "Une collaboration claire, un projet qui reste le vôtre",
    en: "Clear collaboration, a project that stays yours",
  },
  points: [
    {
      label: { fr: "Design sur mesure", en: "Custom design" },
      desc: {
        fr: "Une interface pensée pour votre besoin et vos utilisateurs, pas un template recyclé.",
        en: "An interface designed for your need and your users, not a recycled template.",
      },
    },
    {
      label: {
        fr: "Code propre & maintenable",
        en: "Clean, maintainable code",
      },
      desc: {
        fr: "Un code lisible, documenté et couvert par des tests automatisés, qui évolue sans mauvaises surprises.",
        en: "Readable, documented code covered by automated tests, which evolves without nasty surprises.",
      },
    },
    {
      label: { fr: "Maintenance", en: "Maintenance" },
      desc: {
        fr: "Votre application continue d’évoluer et de s’améliorer, bien après la livraison.",
        en: "Your app keeps evolving and improving, well after launch.",
      },
    },
    {
      label: { fr: "Vous êtes propriétaire", en: "You own everything" },
      desc: {
        fr: "Vous restez seul propriétaire de votre code et de votre infrastructure — vous restez libre de changer de prestataire, moi compris.",
        en: "You remain the sole owner of your code and infrastructure — no lock-in, no dependency.",
      },
    },
  ],
};

export const methodology = {
  title: {
    fr: "Comment se déroule votre projet",
    en: "How your project unfolds",
  },
  lead: {
    fr: "Un déroulé simple et prévisible, à chaque étape.",
    en: "A simple, predictable flow at every step.",
  },
  phases: [
    {
      label: { fr: "Cadrage & besoins", en: "Scoping & needs" },
      desc: {
        fr: "On clarifie ensemble vos objectifs, le périmètre et les priorités.",
        en: "We clarify your goals, scope and priorities together.",
      },
    },
    {
      label: { fr: "Design", en: "Design" },
      desc: {
        fr: "Les écrans et les parcours sont conçus avant d’écrire une ligne de code.",
        en: "The screens and flows are designed before a single line of code.",
      },
    },
    {
      label: { fr: "Développement", en: "Development" },
      desc: {
        fr: "Votre application est construite par itérations, avec des points réguliers.",
        en: "Your app is built in iterations, with regular check-ins.",
      },
    },
    {
      label: { fr: "Livraison & suivi", en: "Delivery & follow-up" },
      desc: {
        fr: "Mise en production, transfert des accès, et suivi dans la durée.",
        en: "Shipping to production, handover of access, and ongoing follow-up.",
      },
    },
  ],
};

export const featured = {
  eyebrow: { fr: "Réalisations", en: "Work" },
  title: { fr: "Des projets déjà en ligne", en: "Projects already live" },
  lead: {
    fr: "Des projets réels, en production — la meilleure preuve de ce que je peux livrer pour vous.",
    en: "Real projects, in production — the best proof of what I can deliver for you.",
  },
  cta: { fr: "Tous les projets", en: "All projects" },
};

export const about = {
  eyebrow: { fr: "À propos", en: "About me" },
  title: {
    fr: "Qui construira votre projet",
    en: "Who will build your project",
  },
  teaser: {
    fr: "Ancien développeur backend chez Sketchfab (racheté par Epic Games), je suis aujourd’hui développeur web et mobile freelance à Lyon. Je construis aussi Fusily, mon application de recettes et de planification de repas, de bout en bout : de quoi montrer que je sais mener un projet de l’idée jusqu’au store.",
    en: "A former backend developer at Sketchfab (acquired by Epic Games), I’m now a freelance web and mobile developer in Lyon. I also build Fusily, my own recipe and meal-planning app, end to end: proof that I can carry a project from idea to app store.",
  },
  teaserCta: {
    fr: "En savoir plus sur mon parcours",
    en: "More about me",
  },
};

/** Closing CTA band copy (the form itself lives on /contact — see `lib/contact-page.ts`). */
export const contact = {
  eyebrow: { fr: "Contact", en: "Contact" },
  title: { fr: "Parlons de votre projet", en: "Let’s talk about your project" },
  lead: {
    fr: "Décrivez votre idée en quelques mots : je vous réponds généralement sous 24 h ouvrées.",
    en: "Tell me about your idea in a few words — you’ll usually get a reply within one business day.",
  },
  cta: { fr: "Écrire un message", en: "Send a message" },
};
