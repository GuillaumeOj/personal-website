export const hero = {
  eyebrow: {
    fr: "Développeur Full-Stack Web & Mobile · freelance",
    en: "Full-Stack Web & Mobile Developer · freelance",
  },
  title: {
    fr: "Votre application web ou mobile, de l’idée à la mise en ligne.",
    en: "Your web or mobile app, from idea to launch.",
  },
  lead: {
    fr: "Confiez tout votre projet à un seul partenaire — design, développement, déploiement et suivi — et restez concentré sur votre activité.",
    en: "Hand your whole project to a single partner — design, development, deployment and follow-up — and stay focused on your business.",
  },
  ctaPrimary: {
    fr: "Discutons de votre projet",
    en: "Let’s talk about your project",
  },
  ctaSecondary: { fr: "Voir des réalisations", en: "See recent work" },
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
      label: { fr: "Design sur mesure", en: "Design from scratch" },
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
        fr: "Un code lisible, testé (tests unitaires et e2e) et documenté, qui évolue sans mauvaises surprises.",
        en: "Readable, tested (unit and e2e) and documented code that evolves without nasty surprises.",
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
        fr: "Vous restez seul propriétaire de votre code et de votre infrastructure — pas de dépendance, pas d’enfermement.",
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
  title: { fr: "Des projets déjà en ligne", en: "Products already live" },
  cta: { fr: "Tous les projets", en: "All projects" },
};

export const about = {
  eyebrow: { fr: "À propos", en: "About me" },
  title: {
    fr: "Qui construira votre projet",
    en: "Who will build your project",
  },
  teaser: {
    fr: "Ancien développeur backend chez Sketchfab (racheté par Epic Games), je suis aujourd’hui développeur web et mobile freelance à Lyon. Je construis aussi Fusily, mon application de recettes, de bout en bout — la meilleure preuve que je sais mener un projet de l’idée jusqu’au store.",
    en: "A former backend developer at Sketchfab (acquired by Epic Games), I’m now a freelance web and mobile developer in Lyon. I also build Fusily, my own recipe app, end to end — the best proof I can carry a project from idea to app store.",
  },
  teaserCta: {
    fr: "En savoir plus sur mon parcours",
    en: "More about me",
  },
};

export const contact = {
  eyebrow: { fr: "Contact", en: "Contact" },
  title: { fr: "Parlons de votre projet", en: "Let’s talk about your project" },
  lead: {
    fr: "Décrivez votre idée en quelques mots, vous avez une réponse sous 24 h.",
    en: "Tell me about your idea in a few words — you’ll get a reply within 24 h.",
  },
  form: {
    name: { fr: "Nom", en: "Name" },
    email: { fr: "E-mail", en: "Email" },
    projectType: { fr: "Type de projet", en: "Project type" },
    projectTypeOptions: [
      {
        value: "web",
        label: { fr: "Site / application web", en: "Web site / app" },
      },
      { value: "saas", label: { fr: "SaaS", en: "SaaS" } },
      {
        value: "mobile",
        label: { fr: "Application mobile", en: "Mobile app" },
      },
      { value: "other", label: { fr: "Autre", en: "Other" } },
    ],
    message: { fr: "Votre projet", en: "Your project" },
    messagePlaceholder: {
      fr: "En quelques lignes : ce que vous voulez construire, pour qui, et sous quel délai.",
      en: "In a few lines: what you want to build, for whom, and by when.",
    },
    submit: { fr: "Envoyer", en: "Send" },
    sending: { fr: "Envoi…", en: "Sending…" },
    success: {
      fr: "Merci ! Votre message est parti, vous avez une réponse sous 24 h.",
      en: "Thanks! Your message is on its way — you’ll get a reply within 24 h.",
    },
    error: {
      fr: "Une erreur est survenue, merci de réessayer.",
      en: "Something went wrong, please try again.",
    },
  },
};
