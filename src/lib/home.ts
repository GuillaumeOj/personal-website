export const hero = {
  eyebrow: {
    fr: 'Développeur fullstack · freelance',
    en: 'Fullstack developer · freelance',
  },
  title: {
    fr: 'Je conçois vos applications web et mobiles, du début à la fin.',
    en: 'I build your web & mobile apps, end to end.',
  },
  lead: {
    fr: 'Du frontend au backend, jusqu’au déploiement et à la maintenance — un seul interlocuteur pour tout votre projet.',
    en: 'From frontend to backend, through deployment and maintenance — a single point of contact for your whole project.',
  },
  ctaPrimary: {
    fr: 'Discutons de votre projet',
    en: 'Let’s talk about your project',
  },
  ctaSecondary: { fr: 'Voir mes projets', en: 'See my work' },
};

export const whatIDo = {
  eyebrow: { fr: 'Ce que je fais', en: 'What I do' },
  title: {
    fr: 'Des applications web et mobiles, complètes.',
    en: 'Complete web & mobile applications.',
  },
  lead: {
    fr: 'Je prends en charge toute la chaîne : interfaces soignées, logique métier robuste, base de données, API, et mise en production.',
    en: 'I own the whole chain: polished interfaces, robust business logic, database, APIs, and shipping to production.',
  },
  pillars: [
    {
      key: 'frontend',
      label: { fr: 'Frontend', en: 'Frontend' },
      desc: {
        fr: 'Interfaces web et mobiles responsives, accessibles et agréables à utiliser.',
        en: 'Responsive, accessible web & mobile interfaces that feel good to use.',
      },
    },
    {
      key: 'backend',
      label: { fr: 'Backend', en: 'Backend' },
      desc: {
        fr: 'API, logique métier et bases de données pensées pour durer.',
        en: 'APIs, business logic and databases built to last.',
      },
    },
    {
      key: 'devops',
      label: { fr: 'DevOps', en: 'DevOps' },
      desc: {
        fr: 'Déploiement, hébergement et automatisation, du premier commit à la production.',
        en: 'Deployment, hosting and automation, from the first commit to production.',
      },
    },
  ],
};

export const tech = {
  eyebrow: { fr: 'Technologies', en: 'Technologies' },
  title: { fr: 'Mes outils de prédilection', en: 'Tools I master' },
  groups: [
    {
      label: { fr: 'Backend', en: 'Backend' },
      items: ['Python', 'Django', 'DRF', 'PostgreSQL'],
    },
    {
      label: { fr: 'Frontend', en: 'Frontend' },
      items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
    },
    {
      label: { fr: 'Mobile', en: 'Mobile' },
      items: ['React Native', 'Expo'],
    },
    {
      label: { fr: 'DevOps', en: 'DevOps' },
      items: ['Docker', 'CI/CD', 'AWS', 'Heroku', 'Vercel'],
    },
  ],
};

export const services = {
  eyebrow: { fr: 'Services', en: 'Services' },
  title: {
    fr: 'Ce que je peux construire pour vous',
    en: 'What I can build for you',
  },
  items: [
    {
      key: 'web',
      label: { fr: 'Développement web', en: 'Web development' },
      desc: {
        fr: 'Des sites et applications rapides, sur mesure, du site vitrine au produit complet.',
        en: 'Fast, tailored sites and applications — from a landing page to a full product.',
      },
      features: [
        {
          fr: 'Sites vitrines & corporate',
          en: 'Landing & corporate sites',
        },
        { fr: 'SaaS et applications métier', en: 'SaaS & business apps' },
        { fr: 'Dashboards & back-offices', en: 'Dashboards & back-offices' },
        { fr: 'Progressive Web Apps (PWA)', en: 'Progressive Web Apps (PWA)' },
      ],
    },
    {
      key: 'mobile',
      label: { fr: 'Applications mobiles', en: 'Mobile applications' },
      desc: {
        fr: 'Des apps iOS et Android natives dans le ressenti, connectées à votre backend.',
        en: 'iOS and Android apps that feel native, wired to your backend.',
      },
      features: [
        {
          fr: 'iOS & Android (React Native / Expo)',
          en: 'iOS & Android (React Native / Expo)',
        },
        { fr: 'Notifications push', en: 'Push notifications' },
        { fr: 'Optimisation des performances', en: 'Performance optimization' },
        { fr: 'Publication sur les stores', en: 'Store publishing' },
        { fr: 'Back-office de gestion', en: 'Management back-office' },
      ],
    },
  ],
};

export const howIWork = {
  eyebrow: { fr: 'Ma façon de travailler', en: 'How I work' },
  title: {
    fr: 'Une collaboration claire, un projet qui vous appartient',
    en: 'Clear collaboration, a project that stays yours',
  },
  points: [
    {
      label: { fr: 'Design sur mesure', en: 'Design from scratch' },
      desc: {
        fr: 'Je conçois l’interface depuis zéro si nécessaire, adaptée à votre besoin.',
        en: 'I design the interface from scratch when needed, tailored to your need.',
      },
    },
    {
      label: {
        fr: 'Code propre & maintenable',
        en: 'Clean, maintainable code',
      },
      desc: {
        fr: 'Un code lisible, testé (tests unitaires et e2e) et documenté, pensé pour évoluer sans mauvaises surprises.',
        en: 'Readable, tested (unit and e2e) and documented code, built to evolve without nasty surprises.',
      },
    },
    {
      label: { fr: 'Maintenance', en: 'Maintenance' },
      desc: {
        fr: 'Je reste disponible pour faire vivre et améliorer votre application dans le temps.',
        en: 'I stay available to maintain and improve your application over time.',
      },
    },
    {
      label: { fr: 'Vous êtes propriétaire', en: 'You own everything' },
      desc: {
        fr: 'Vous restez seul propriétaire de votre code et de votre infrastructure — pas de dépendance, pas d’enfermement.',
        en: 'You remain the sole owner of your code and infrastructure — no lock-in, no dependency.',
      },
    },
  ],
};

export const methodology = {
  eyebrow: { fr: 'Méthodologie', en: 'Methodology' },
  title: { fr: 'Comment se déroule un projet', en: 'How a project unfolds' },
  lead: {
    fr: 'Un déroulé simple et prévisible, à chaque étape.',
    en: 'A simple, predictable flow at every step.',
  },
  phases: [
    {
      label: { fr: 'Cadrage & besoins', en: 'Scoping & needs' },
      desc: {
        fr: 'On clarifie ensemble vos objectifs, le périmètre et les priorités.',
        en: 'We clarify your goals, scope and priorities together.',
      },
    },
    {
      label: { fr: 'Design', en: 'Design' },
      desc: {
        fr: 'Je conçois les écrans et les parcours avant d’écrire une ligne de code.',
        en: 'I design the screens and flows before writing a line of code.',
      },
    },
    {
      label: { fr: 'Développement', en: 'Development' },
      desc: {
        fr: 'Je construis l’application par itérations, avec des points réguliers.',
        en: 'I build the app in iterations, with regular check-ins.',
      },
    },
    {
      label: { fr: 'Livraison & suivi', en: 'Delivery & follow-up' },
      desc: {
        fr: 'Mise en production, transfert des accès, et suivi dans la durée.',
        en: 'Shipping to production, handover of access, and ongoing follow-up.',
      },
    },
  ],
};

export const featured = {
  eyebrow: { fr: 'Réalisations', en: 'Work' },
  title: { fr: 'Quelques projets récents', en: 'Selected recent work' },
  cta: { fr: 'Tous les projets', en: 'All projects' },
};

export const parcours = {
  eyebrow: { fr: 'Parcours', en: 'Experience' },
  title: { fr: 'D’où je viens', en: 'Where I come from' },
};

export const contact = {
  eyebrow: { fr: 'Contact', en: 'Contact' },
  title: { fr: 'Parlons de votre projet', en: 'Let’s talk about your project' },
  lead: {
    fr: 'Décrivez-moi votre idée en quelques mots, je vous réponds sous 24 h.',
    en: 'Tell me about your idea in a few words — I reply within 24 h.',
  },
  form: {
    name: { fr: 'Nom', en: 'Name' },
    email: { fr: 'E-mail', en: 'Email' },
    projectType: { fr: 'Type de projet', en: 'Project type' },
    projectTypeOptions: [
      {
        value: 'web',
        label: { fr: 'Site / application web', en: 'Web site / app' },
      },
      { value: 'saas', label: { fr: 'SaaS', en: 'SaaS' } },
      {
        value: 'mobile',
        label: { fr: 'Application mobile', en: 'Mobile app' },
      },
      { value: 'other', label: { fr: 'Autre', en: 'Other' } },
    ],
    message: { fr: 'Votre projet', en: 'Your project' },
    messagePlaceholder: {
      fr: 'En quelques lignes : ce que vous voulez construire, pour qui, et sous quel délai.',
      en: 'In a few lines: what you want to build, for whom, and by when.',
    },
    submit: { fr: 'Envoyer', en: 'Send' },
    sending: { fr: 'Envoi…', en: 'Sending…' },
    success: {
      fr: 'Merci ! Votre message est parti, je vous réponds sous 24 h.',
      en: 'Thanks! Your message is on its way — I’ll reply within 24 h.',
    },
    error: {
      fr: 'Une erreur est survenue, merci de réessayer.',
      en: 'Something went wrong, please try again.',
    },
  },
};
