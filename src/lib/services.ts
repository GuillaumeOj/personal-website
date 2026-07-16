import { type Locale, SITE } from "../config";
import { ensureTrailingSlash, localizedPath, t } from "../i18n/ui";
import { heroCredibility, methodology } from "./home";
import {
  BUSINESS_ID,
  breadcrumbList,
  inLanguage,
  LYON_ADDRESS,
  PERSON_ID,
  SERVICE_TYPES,
  WEBSITE_ID,
} from "./schema";

/** A localized string. */
type L = Record<Locale, string>;

/** An inline run inside a "proof" sentence: plain text, or a link to a project. */
export type ServiceRun =
  | { t: "text"; v: L }
  | { t: "link"; v: L; slug: string };

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
 * `<title>` segment (the layout appends ` — {SITE.name}`) and meta description.
 * Services owns the offer/"prestations" query cluster — deliberately distinct
 * from Home's "développeur … à Lyon" head term to avoid cannibalization.
 */
export const servicesMeta: { title: L; description: L } = {
  title: {
    fr: "Prestations de développement web & mobile",
    en: "Custom Web & Mobile Development Services",
  },
  description: {
    fr: "Applications web, mobiles et SaaS sur mesure par un développeur freelance à Lyon. Un seul interlocuteur, du design au déploiement. Réponse sous 24 h.",
    en: "Custom web, mobile and SaaS apps by a freelance full-stack developer. Design, development, deployment: a single point of contact. Reply within 24 h.",
  },
};

export const hero = {
  title: {
    fr: "Votre application web ou mobile, conçue et livrée par un seul interlocuteur",
    en: "Your web or mobile app, designed and delivered by a single point of contact",
  },
  subtitle: {
    fr: "Du premier écran à la mise en production : design, développement, base de données, API et déploiement. Vous suivez un projet clair, vous en restez propriétaire, et vous parlez à une seule personne du début à la fin.",
    en: "From the first screen to production: design, development, database, APIs and deployment. You follow a clear project, you stay its owner, and you talk to one person from start to finish.",
  },
  cta: { fr: "Discutons de votre projet", en: "Let’s talk about your project" },
  reassurance: {
    fr: "Réponse sous 24 h · Devis gratuit",
    en: "Reply within 24 h · Free quote",
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
    fr: "Une application native dans le ressenti, sur iPhone et Android, à partir d’une seule base de code React Native / Expo — pas deux développements séparés, pas deux factures.",
    en: "An app that feels native, on iPhone and Android, from a single React Native / Expo codebase — not two separate builds, not two invoices.",
  },
  leadIn: {
    fr: "Ce que vous obtenez concrètement :",
    en: "What you get, concretely:",
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
      fr: "Les mises à jour à distance (OTA) pour corriger et améliorer sans réattendre la validation des stores.",
      en: "Over-the-air (OTA) updates to fix and improve without waiting again for store review.",
    },
    {
      fr: "Les captures, fiches et visuels nécessaires à la publication, y compris en plusieurs langues.",
      en: "The screenshots, store listings and assets needed to publish, including in several languages.",
    },
  ] satisfies L[],
  proof: [
    text(
      "C’est exactement la chaîne que j’ai menée de bout en bout, seul, pour ",
      "This is exactly the chain I ran end to end, on my own, for ",
    ),
    link("Fusily", "Fusily", "fusily"),
    text(
      " — mon application de planification de repas, publiée sur l’App Store et Google Play.",
      " — my meal-planning app, published on the App Store and Google Play.",
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
    en: "Fast, tailor-made websites and web apps, from the landing page that converts to the full SaaS your customers use every day.",
  },
  leadIn: { fr: "Ce que je construis :", en: "What I build:" },
  list: [
    {
      fr: "Sites vitrines & corporate — rapides, soignés, bien référencés.",
      en: "Landing & corporate sites — fast, polished, well ranked.",
    },
    {
      fr: "SaaS & applications métier — comptes, abonnements, tableaux de bord, la logique au cœur de votre activité.",
      en: "SaaS & business apps — accounts, subscriptions, dashboards, the logic at the heart of your business.",
    },
    {
      fr: "Dashboards & back-offices — pour piloter votre produit ou votre équipe.",
      en: "Dashboards & back-offices — to steer your product or your team.",
    },
    {
      fr: "Progressive Web Apps (PWA) — l’expérience d’une app, accessible depuis un navigateur.",
      en: "Progressive Web Apps (PWA) — the feel of an app, straight from a browser.",
    },
  ] satisfies L[],
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
        fr: "responsives, accessibles et agréables, pensées pour vos utilisateurs, pas recyclées d’un template.",
        en: "responsive, accessible and enjoyable, designed for your users, not recycled from a template.",
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
        fr: "En ligne, et qui le reste (devops)",
        en: "Live, and staying live (devops)",
      },
      desc: {
        fr: "déploiement, hébergement et automatisation, pour que votre produit tourne sans surprise.",
        en: "deployment, hosting and automation, so your product runs without surprises.",
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
    fr: "Code propre, testé et documenté ; maintenance après livraison ; aucune dépendance ni enfermement.",
    en: "Clean, tested and documented code; maintenance after launch; no lock-in, no dependency.",
  },
};

export const cost = {
  title: {
    fr: "Combien coûte votre projet ?",
    en: "How much does your project cost?",
  },
  intro: {
    fr: "Chaque projet est unique. Plutôt qu’un prix au hasard, voici la logique, pour y voir clair avant même le premier échange :",
    en: "Every project is unique. Rather than a random price, here’s the logic, so you have a clear picture before we even talk:",
  },
  list: [
    {
      fr: "Site vitrine / PWA — un forfait clair, périmètre défini à l’avance.",
      en: "Landing site / PWA — a clear fixed price, scope defined upfront.",
    },
    {
      fr: "Application mobile ou web sur mesure — estimé après un cadrage court et gratuit, selon les fonctionnalités.",
      en: "Custom mobile or web app — estimated after a short, free scoping, based on the features.",
    },
    {
      fr: "SaaS complet — construit par lots, pour étaler l’investissement et livrer de la valeur tôt.",
      en: "Full SaaS — built in batches, to spread the investment and deliver value early.",
    },
  ] satisfies L[],
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
        fr: "À vous, entièrement — code et infrastructure. Aucune dépendance, aucun enfermement.",
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
        fr: "Sous 24 h après votre message.",
        en: "Within 24 h of your message.",
      },
    },
    {
      q: {
        fr: "Combien coûte un projet ?",
        en: "How much does a project cost?",
      },
      a: {
        fr: "Devis gratuit après un cadrage court ; la logique de prix est détaillée plus haut.",
        en: "A free quote after a short scoping; the pricing logic is detailed above.",
      },
    },
  ],
};

/** Reassurance line added near the reused contact block. */
export const contactNote = {
  fr: "Décrivez votre idée en quelques mots — réponse sous 24 h, devis gratuit, aucun engagement.",
  en: "Tell me about your idea in a few words — reply within 24 h, free quote, no commitment.",
};

/**
 * schema.org JSON-LD for the services page: the canonical `#business`
 * ProfessionalService node (the *same* entity defined on About — same `@id`,
 * name, address and `WebSite`) enriched here with the offer's `serviceType`s and
 * `areaServed`, plus a FAQPage built from the visible FAQ. Sharing the `@id`
 * (rather than minting a second businessless node) lets Google merge both pages
 * into one local business instead of reading two competing ones.
 */
export const servicesJsonLd = (locale: Locale) => {
  const homeUrl = new URL(
    ensureTrailingSlash(localizedPath(locale, "/")),
    SITE.url,
  ).toString();

  const service = {
    "@type": "ProfessionalService",
    "@id": BUSINESS_ID,
    name: SITE.name,
    url: homeUrl,
    email: SITE.email,
    inLanguage: inLanguage(locale),
    isPartOf: { "@id": WEBSITE_ID },
    address: LYON_ADDRESS,
    // Same coarse band as the About #business node so the merged entity reads
    // consistently from either page.
    priceRange: "€€",
    areaServed: [
      { "@type": "City", name: "Lyon" },
      { "@type": "Country", name: "France" },
    ],
    serviceType: SERVICE_TYPES,
    provider: { "@id": PERSON_ID },
  };

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

  const breadcrumbs = breadcrumbList([
    { name: t(locale, "nav.home"), url: homeUrl },
    {
      name: t(locale, "nav.services"),
      url: new URL(
        ensureTrailingSlash(localizedPath(locale, "/services")),
        SITE.url,
      ).toString(),
    },
  ]);

  return {
    "@context": "https://schema.org",
    "@graph": [service, faqPage, breadcrumbs],
  };
};
