import type { Locale, Localized } from "../config";
import { heroCredibility, methodology } from "./home";
import {
  breadcrumbList,
  type Crumb,
  inLanguage,
  navTrail,
  professionalServiceNode,
  WEBSITE_ID,
} from "./schema";

/** A localized string. */

/** The one public price (audit U8), shared by the cost list and the FAQ. */
const FLOOR_PRICE: Localized = { fr: "1 500 €", en: "€1,500" };

/** An inline run inside a "proof" sentence: plain text, or a link to a project. */
export type ServiceRun =
  | { t: "text"; v: Localized }
  | { t: "link"; v: Localized; slug: string };

const text = (fr: string, en: string): ServiceRun => ({
  t: "text",
  v: { fr, en },
});
const link = (fr: string, en: string, slug: string): ServiceRun => ({
  t: "link",
  v: { fr, en },
  slug,
});

/**
 * `<title>` segment and meta description. The layout appends ` — {SITE.name}`
 * only while the result fits BaseLayout's TITLE_MAX (these titles don't).
 * Services owns the offer/"prestations" query cluster — deliberately distinct
 * from Home's "développeur … à Lyon" head term to avoid cannibalization.
 */
export const servicesMeta: { title: Localized; description: Localized } = {
  title: {
    // "Développement", not "Développeur": the home page owns the person query
    // ("Développeur web & mobile freelance à Lyon"); this page owns the offer.
    fr: "Développement web & mobile freelance à Lyon : tarifs",
    en: "Freelance Web & Mobile Development in Lyon: Pricing",
  },
  description: {
    fr: "Applications web, mobiles et SaaS sur mesure par un développeur full-stack freelance à Lyon. Un seul interlocuteur, du design au déploiement.",
    en: "Custom web, mobile and SaaS apps by a freelance full-stack developer in Lyon. Design, development, deployment: one point of contact.",
  },
};

export const hero = {
  title: {
    fr: "Votre application web ou mobile, conçue et livrée par un seul interlocuteur",
    en: "Your web or mobile app, designed and delivered by a single point of contact",
  },
  subtitle: {
    fr: "Du premier écran à la mise en production : design, développement, base de données, API et déploiement. Vous suivez un projet clair, vous en restez propriétaire, et vous parlez à une seule personne du début à la fin. Basé à Lyon, je travaille avec des entreprises et associations de la métropole lyonnaise et, à distance, de toute la France.",
    en: "From the first screen to production: design, development, database, APIs and deployment. You get a clear process, full ownership, and one person to talk to from start to finish. Based in Lyon, I work with businesses and non-profits across the Lyon area and, remotely, all over France.",
  },
  cta: { fr: "Discutons de votre projet", en: "Let’s talk about your project" },
  reassurance: {
    fr: "Réponse généralement sous 24 h ouvrées · Devis gratuit",
    en: "Usually a reply within one business day · Free quote",
  },
  /** One-line proof strip shown under the hero, above the fold. Shared verbatim
   *  with the home hero via `heroCredibility` (single source of truth). */
  credibility: heroCredibility,
  anchorMobile: { fr: "Applications mobiles", en: "Mobile apps" },
  anchorWeb: { fr: "Web & SaaS", en: "Web & SaaS" },
};

export const mobile = {
  title: {
    fr: "Applications mobiles iOS & Android sur mesure",
    en: "Custom iOS & Android mobile applications",
  },
  intro: {
    fr: "Une application au ressenti natif, sur iPhone et Android, à partir d’une seule base de code React Native / Expo — pas deux développements séparés, pas deux factures.",
    en: "An app that feels native, on iPhone and Android, from a single React Native / Expo codebase — not two separate builds, not two invoices.",
  },
  leadIn: {
    fr: "Ce que vous obtenez concrètement :",
    en: "Here’s what you get:",
  },
  list: [
    {
      fr: "Une app iOS et Android publiée sur l’App Store et Google Play, prête pour vos utilisateurs.",
      en: "An iOS and Android app published on the App Store and Google Play, ready for your users.",
    },
    {
      fr: "Un backend qui l’alimente : comptes, données, logique métier, notifications push.",
      en: "A backend that powers it: accounts, data, business logic, push notifications.",
    },
    {
      fr: "Les mises à jour à distance (OTA) pour corriger et améliorer sans repasser par la validation des stores.",
      en: "Over-the-air (OTA) updates to fix and improve without waiting again for store review.",
    },
    {
      fr: "Les captures, fiches et visuels nécessaires à la publication, y compris en plusieurs langues.",
      en: "The screenshots, store listings and assets needed to publish, including in several languages.",
    },
  ] satisfies Localized[],
  proof: [
    text(
      "C’est exactement la chaîne que j’ai menée de bout en bout, seul, pour ",
      "I ran this exact process end to end, on my own, for ",
    ),
    link("Fusily", "Fusily", "fusily"),
    text(
      " — mon application de recettes et de planification de repas, publiée sur l’App Store et Google Play.",
      " — my recipe and meal-planning app, published on the App Store and Google Play.",
    ),
  ] satisfies ServiceRun[],
};

export const web = {
  title: {
    fr: "Développement web & SaaS sur mesure",
    en: "Custom web & SaaS development",
  },
  intro: {
    fr: "Des sites et applications web rapides et sur mesure, du site vitrine qui convertit au SaaS complet que vos clients utilisent tous les jours.",
    en: "Fast, tailor-made websites and web apps, from a business website that converts to the full SaaS your customers use every day.",
  },
  leadIn: { fr: "Ce que je construis :", en: "What I build:" },
  list: [
    {
      fr: "Sites vitrines et sites d’entreprise — rapides, soignés, bien référencés.",
      en: "Business websites — fast, polished, well ranked.",
    },
    {
      fr: "SaaS & applications métier — comptes, abonnements, tableaux de bord, la logique au cœur de votre activité.",
      en: "SaaS & business apps — accounts, subscriptions, dashboards, the logic at the heart of your business.",
    },
    {
      fr: "Tableaux de bord et back-offices — pour piloter votre produit ou votre équipe.",
      en: "Dashboards & back-offices — to steer your product or your team.",
    },
    {
      fr: "Progressive Web Apps (PWA) — l’expérience d’une app, accessible depuis un navigateur.",
      en: "Progressive Web Apps (PWA) — the feel of an app, straight from a browser.",
    },
  ] satisfies Localized[],
  proof: [
    text(
      "Backend à fort trafic sur des plateformes utilisées par des millions de personnes (Sketchfab, FAB / Epic Games) ; site vitrine livré pour le cabinet d’avocate ",
      "High-traffic backends on platforms used by millions (Sketchfab, FAB / Epic Games); a business website delivered for the ",
    ),
    link("Eva Biezunski", "Eva Biezunski", "eva-biezunski-avocate"),
    text(".", " law firm."),
  ] satisfies ServiceRun[],
};

/** The Frontend/Backend/DevOps trio, reused as the 01/02/03 card component. */
export const included = {
  title: {
    fr: "Ce qui est inclus, à chaque fois",
    en: "What’s included, every time",
  },
  intro: {
    fr: "Quel que soit le projet, toute la chaîne est couverte — vous n’avez pas à recruter trois prestataires ni à jouer les chefs d’orchestre.",
    en: "Whatever the project, the whole chain is covered — no need to hire three providers or play conductor.",
  },
  items: [
    {
      label: {
        fr: "Des interfaces soignées (frontend)",
        en: "Polished interfaces (frontend)",
      },
      desc: {
        fr: "Responsives, accessibles et agréables, pensées pour vos utilisateurs, pas recyclées d’un template.",
        en: "Responsive, accessible and enjoyable, designed for your users, not recycled from a template.",
      },
    },
    {
      label: {
        fr: "Une logique solide sous le capot (backend)",
        en: "Solid logic under the hood (backend)",
      },
      desc: {
        fr: "API, règles métier et base de données prêtes à encaisser la croissance.",
        en: "APIs, business rules and a database ready to handle growth.",
      },
    },
    {
      label: {
        fr: "En ligne, et qui le reste (DevOps)",
        en: "Live, and staying live (DevOps)",
      },
      desc: {
        fr: "Déploiement, hébergement et automatisation, pour que votre produit tourne sans surprise.",
        en: "Deployment, hosting and automation, so your product runs without surprises.",
      },
    },
  ],
};

/**
 * "How your project unfolds" — the canonical home for the 4 steps. The step
 * titles/descriptions are shared with the home methodology block; only the
 * intro and reassurance line are specific to this page.
 */
export const projectFlow = {
  title: {
    fr: "Comment se déroule votre projet",
    en: "How your project unfolds",
  },
  intro: {
    fr: "Un déroulé simple et prévisible, avec des points réguliers. À l’arrivée, vous êtes propriétaire du code et de l’infrastructure.",
    en: "A simple, predictable flow, with regular check-ins. At the end, you own the code and the infrastructure.",
  },
  steps: methodology.phases,
  reassurance: {
    fr: "Code propre, testé et documenté ; maintenance après livraison ; libre de changer de prestataire à tout moment.",
    en: "Clean, tested and documented code; maintenance after launch; no lock-in, no dependency.",
  },
};

export const cost = {
  title: {
    fr: "Combien coûte votre projet ?",
    en: "How much does your project cost?",
  },
  intro: {
    fr: "Chaque projet est unique. Plutôt qu’un tarif unique, voici comment j’estime, pour y voir clair avant même le premier échange :",
    en: "Every project is unique. Rather than a one-size-fits-all price, here’s how I estimate, so you have a clear picture before we even talk:",
  },
  list: [
    {
      // The one public figure (audit U8): a floor price helps buyers judge
      // fit before writing. Apps and SaaS vary too much for a useful floor.
      fr: `Site vitrine / PWA — à partir de ${FLOOR_PRICE.fr}, un forfait clair, périmètre défini à l’avance.`,
      en: `Business website / PWA — from ${FLOOR_PRICE.en}, a clear fixed price, scope defined upfront.`,
    },
    {
      fr: "Application mobile ou web sur mesure — estimée après un cadrage court et gratuit, selon les fonctionnalités.",
      en: "Custom mobile or web app — estimated after a short, free scoping call, based on the features.",
    },
    {
      fr: "SaaS complet — construit par lots, pour étaler l’investissement et livrer de la valeur tôt.",
      en: "Full SaaS — built in phases, to spread the investment and deliver value early.",
    },
  ] satisfies Localized[],
  closing: {
    fr: "Le premier échange et le devis sont gratuits, sans engagement. Vous repartez avec une estimation, que l’on travaille ensemble ou non.",
    en: "The first conversation and the quote are free, no strings attached. You leave with an estimate, whether we work together or not.",
  },
  cta: {
    fr: "Demander une estimation gratuite",
    en: "Request a free estimate",
  },
};

export const faq = {
  title: { fr: "Questions fréquentes", en: "Frequently asked questions" },
  items: [
    // B2B scope statement: keeps the offer outside consumer-law obligations
    // (withdrawal right, consumer mediator). Keep it first and explicit.
    {
      q: {
        fr: "À qui s’adressent vos prestations ?",
        en: "Who are your services for?",
      },
      a: {
        fr: "Les prestations proposées sur ce site s’adressent aux professionnels, associations et porteurs de projet agissant dans le cadre de leur activité professionnelle. Je ne travaille pas pour des particuliers.",
        en: "The services offered on this site are for businesses, non-profits and project owners acting in the course of their activity. I don’t take on private individuals as clients.",
      },
    },
    // Local intent: says where the work happens without a public address.
    {
      q: {
        fr: "Travaillez-vous uniquement à Lyon ?",
        en: "Do you only work in Lyon?",
      },
      a: {
        fr: "Non. Je suis basé à Lyon : dans la métropole lyonnaise, je me déplace volontiers dans vos locaux pour les moments clés du projet. Partout ailleurs en France, je travaille à distance, en visio, avec le même suivi.",
        en: "No. I'm based in Lyon: across the Lyon area, I'm happy to come to your offices for the key moments of the project. Anywhere else in France, I work remotely over video calls, with the same follow-up.",
      },
    },
    {
      q: {
        fr: "Travaillez-vous seul ou en équipe ?",
        en: "Do you work alone or in a team?",
      },
      a: {
        fr: "Seul, de bout en bout — c’est le principe : un seul interlocuteur, aucune coordination à votre charge.",
        en: "On my own, end to end — that’s the point: a single point of contact, no coordination on your plate.",
      },
    },
    {
      q: {
        fr: "Que se passe-t-il si vous êtes indisponible en cours de projet ?",
        en: "What happens if you’re unavailable mid-project?",
      },
      a: {
        fr: "Le code est versionné, testé et documenté au fil de l’eau, et hébergé sur votre infrastructure. À tout moment, vous — ou un autre développeur — pouvez reprendre la main : rien n’est enfermé dans ma tête.",
        en: "The code is versioned, tested and documented as we go, and hosted on your own infrastructure. At any point you — or another developer — can pick it up: nothing is locked in my head.",
      },
    },
    {
      q: { fr: "À qui appartient le code ?", en: "Who owns the code?" },
      a: {
        fr: "À vous, entièrement : code et infrastructure. Vous restez libre de changer de prestataire à tout moment, moi compris.",
        en: "You do, entirely — code and infrastructure. No dependency, no lock-in.",
      },
    },
    {
      q: {
        fr: "Faites-vous du web et du mobile ?",
        en: "Do you do both web and mobile?",
      },
      a: {
        fr: "Les deux, avec le même soin : applications mobiles React Native / Expo et applications web Django / Next.js.",
        en: "Both, with the same care: React Native / Expo mobile apps and Django / Next.js web apps.",
      },
    },
    {
      q: {
        fr: "Que se passe-t-il après la livraison ?",
        en: "What happens after launch?",
      },
      a: {
        fr: "Transfert des accès, puis maintenance et évolutions dans la durée si vous le souhaitez.",
        en: "Handover of access, then maintenance and improvements over time if you want them.",
      },
    },
    {
      q: {
        fr: "Sous combien de temps répondez-vous ?",
        en: "How fast do you reply?",
      },
      a: {
        fr: "Généralement sous 24 h ouvrées après votre message.",
        en: "Usually within one business day of your message.",
      },
    },
    {
      q: {
        fr: "Combien coûte un projet ?",
        en: "How much does a project cost?",
      },
      a: {
        fr: `Un site vitrine démarre à ${FLOOR_PRICE.fr}, au forfait. Une application web ou mobile est estimée après un cadrage court et gratuit, et un SaaS se construit par lots. Le devis est gratuit et sans engagement.`,
        en: `A business website starts at ${FLOOR_PRICE.en}, at a fixed price. A web or mobile app is estimated after a short, free scoping call, and a SaaS is built in phases. The quote is free, with no commitment.`,
      },
    },
  ],
};

/** Lead of /contact/quote and of the ContactCta band that links to it (see lib/contact-page.ts). */
export const contactNote = {
  fr: "Décrivez votre idée en quelques mots — réponse généralement sous 24 h ouvrées, devis gratuit, aucun engagement.",
  en: "Tell me about your idea in a few words — usually a reply within one business day, free quote, no commitment.",
};

/** Home › Services — the visible trail and the JSON-LD `BreadcrumbList`. */
export const servicesCrumbs = (locale: Locale): Crumb[] =>
  navTrail(locale, ["nav.services", "/services"]);

/**
 * schema.org JSON-LD for the services page: the canonical `#business`
 * ProfessionalService node (the *same* entity defined on About and Home — same
 * `@id`, name, address and offers) plus contact details, and a FAQPage built
 * from the visible FAQ. Sharing the `@id`
 * (rather than minting a second businessless node) lets Google merge both pages
 * into one local business instead of reading two competing ones.
 */
export const servicesJsonLd = (locale: Locale) => {
  const service = professionalServiceNode();

  const faqPage = {
    "@type": "FAQPage",
    inLanguage: inLanguage(locale),
    isPartOf: { "@id": WEBSITE_ID },
    mainEntity: faq.items.map((item) => ({
      "@type": "Question",
      name: item.q[locale],
      acceptedAnswer: { "@type": "Answer", text: item.a[locale] },
    })),
  };

  const breadcrumbs = breadcrumbList(servicesCrumbs(locale));

  return {
    "@context": "https://schema.org",
    "@graph": [service, faqPage, breadcrumbs],
  };
};
