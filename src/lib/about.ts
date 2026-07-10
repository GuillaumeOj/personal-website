import { type Locale, SITE } from "../config";
import { localizedPath, projectPath } from "../i18n/ui";
import { tech } from "./home";

/** A run of inline content inside an About paragraph or list item. */
export type Run =
  | { t: "text"; v: string }
  | { t: "strong"; v: string }
  | { t: "link"; v: string; href: string; strong?: boolean };

/** A block inside a section: a paragraph or a bulleted list. */
export type Block = { t: "p"; runs: Run[] } | { t: "list"; items: Run[][] };

export interface AboutSection {
  h: string;
  blocks: Block[];
}

export interface AboutCta {
  h: string;
  lead: string;
  linkLabel: string;
  href: string;
}

export interface AboutDoc {
  /** `<title>` (name is appended by BaseLayout). */
  metaTitle: string;
  /** `<meta name="description">`. */
  metaDescription: string;
  /** Kicker above the H1. */
  eyebrow: string;
  /** H1. */
  title: string;
  /** Lead paragraph(s) under the portrait, no heading. */
  intro: string[];
  sections: AboutSection[];
  cta: AboutCta;
}

const s = (v: string): Run => ({ t: "text", v });
const b = (v: string): Run => ({ t: "strong", v });
const link = (v: string, href: string, strong = false): Run => ({
  t: "link",
  v,
  href,
  strong,
});
const p = (...runs: Run[]): Block => ({ t: "p", runs });
const ul = (...items: Run[][]): Block => ({ t: "list", items });

const frDoc = (): AboutDoc => {
  const home = localizedPath("fr", "/");
  return {
    metaTitle: "Développeur web & mobile freelance à Lyon",
    metaDescription:
      "Développeur web et mobile freelance à Lyon, j’accompagne PME et associations de l’idée à la mise en ligne : sites, applications métier et mobiles. Discutons de votre projet.",
    eyebrow: "Présentation",
    title: "À propos de Guillaume Ojardias, développeur web & mobile à Lyon",
    intro: [
      "Moi, c’est Guillaume Ojardias, développeur web et mobile freelance basé à Lyon. Dans la région lyonnaise, je me déplace volontiers dans vos locaux pour échanger de vive voix ; partout ailleurs en France, je travaille à distance. J’accompagne les PME et les associations dans la création de leurs projets web & mobile : site vitrine, prise de rendez-vous en ligne, application métier ou application mobile grand public.",
    ],
    sections: [
      {
        h: "De Sketchfab et Epic Games à votre projet",
        blocks: [
          p(
            s(
              "Avant de me lancer en freelance, j’ai été développeur backend chez ",
            ),
            b("Sketchfab"),
            s(", une plateforme française rachetée par "),
            b("Epic Games"),
            s(
              " (les créateurs de Fortnite et de l’Unreal Engine). J’y ai notamment contribué à ",
            ),
            b("FAB"),
            s(
              ", leur marketplace de contenus 3D utilisée par des créateurs du monde entier.",
            ),
          ),
          p(
            s(
              "Ce que ça change pour vous : votre projet, même à taille humaine, est construit avec les mêmes standards de qualité, de performance et de rigueur qu’une plateforme utilisée à très grande échelle. Vous bénéficiez de cette exigence sans en payer la lourdeur.",
            ),
          ),
        ],
      },
      {
        h: "Fusily : une application que je porte de bout en bout",
        blocks: [
          p(
            s("Depuis fin 2024, je conçois et développe "),
            link("Fusily", projectPath("fr", "fusily"), true),
            s(
              ", une application de recettes et de planification de repas, seul et sur tous les fronts : backend, frontend, application mobile, mise en production et contenu.",
            ),
          ),
          p(
            s(
              "Ce n’est pas qu’un projet perso : c’est la preuve vivante que je sais piloter un projet web et mobile complet, de l’idée jusqu’au store. Quand vous me parlez de votre projet, je sais de quoi il retourne, parce que je vis exactement les mêmes étapes de mon côté.",
            ),
          ),
        ],
      },
      {
        h: "Ma façon de travailler",
        blocks: [
          p(
            s("Tout commence "),
            b("avant la première ligne de code"),
            s(
              " : par la compréhension de votre activité, de vos besoins et de vos utilisateurs. Un bon projet ne démarre pas par de la technique, mais par les bonnes questions.",
            ),
          ),
          p(
            s(
              "Ensuite, je vous explique les choses le plus clairement possible, ",
            ),
            b("sans vous noyer dans le jargon technique"),
            s(
              ". Vous n’avez pas besoin de savoir ce qu’est une API pour comprendre où va votre budget et pourquoi. Mon rôle, c’est de traduire vos objectifs en solutions concrètes, et de vous tenir informé à chaque étape.",
            ),
          ),
          p(
            s("L’idée : que vous avanciez "),
            b("sereinement"),
            s(
              ", en sachant toujours où vous en êtes. Vous trouverez le détail de ",
            ),
            link("ce que je propose", `${home}#services`),
            s(" sur ma page services."),
          ),
        ],
      },
      {
        h: "Un accompagnement qui ne s’arrête pas à la mise en ligne",
        blocks: [
          p(
            s(
              "Un site ou une application, ça vit. Une fois votre projet en ligne, je reste disponible pour la maintenance, la correction des imprévus et les évolutions à venir. Vous n’êtes pas livré à vous-même le jour de la mise en production : on construit une relation dans la durée, pour que votre outil grandisse avec votre activité.",
            ),
          ),
        ],
      },
      {
        h: "Les technologies que j’utilise",
        blocks: [
          p(
            s(
              "Je développe avec un ensemble d’outils qui ont fait leurs preuves sur des projets exigeants :",
            ),
          ),
          ul(
            [
              b("Backend"),
              s(" : Python, Django, Django REST Framework, PostgreSQL"),
            ],
            [b("Frontend"), s(" : React, Next.js, TypeScript")],
            [
              b("Mobile"),
              s(
                " : React Native, Expo (des applications iOS et Android à partir d’une seule base de code)",
              ),
            ],
          ),
          p(
            s(
              "Ces choix garantissent des projets fiables, maintenables dans le temps, et capables d’évoluer avec vos besoins. Vous pouvez voir ces technologies à l’œuvre dans ",
            ),
            link("mes réalisations", localizedPath("fr", "/projects")),
            s("."),
          ),
        ],
      },
    ],
    cta: {
      h: "Parlons de votre projet",
      lead: "Que vous ayez une idée précise ou juste une intuition à creuser, la première étape est toujours la même : un échange gratuit et sans engagement pour comprendre ce dont vous avez besoin. Réponse sous 24 h.",
      linkLabel: "Contactez-moi",
      href: `${home}#contact`,
    },
  };
};

const enDoc = (): AboutDoc => {
  const home = localizedPath("en", "/");
  return {
    metaTitle: "Freelance Web & Mobile Developer in Lyon",
    metaDescription:
      "Freelance web and mobile developer in Lyon. I help SMEs and non-profits go from idea to launch: websites, business apps and mobile apps. Let’s talk about your project.",
    eyebrow: "Introduction",
    title: "About Guillaume Ojardias, web & mobile developer in Lyon",
    intro: [
      "Hi, I’m Guillaume Ojardias, a freelance web and mobile developer based in Lyon. In the Lyon area, I’m happy to come to your offices to talk things through in person; anywhere else in France, I work remotely. I help SMEs and non-profits bring their web & mobile projects to life: showcase websites, online booking, business applications, or consumer mobile apps.",
    ],
    sections: [
      {
        h: "From Sketchfab and Epic Games to your project",
        blocks: [
          p(
            s("Before going freelance, I was a backend developer at "),
            b("Sketchfab"),
            s(", a French platform acquired by "),
            b("Epic Games"),
            s(
              " (the creators of Fortnite and Unreal Engine). Among other things, I contributed to ",
            ),
            b("FAB"),
            s(", their 3D content marketplace used by creators worldwide."),
          ),
          p(
            s(
              "What this means for you: your project, however modest, is built to the same standards of quality, performance and rigor as a platform running at massive scale. You get the benefit of that exacting standard without the overhead that usually comes with it.",
            ),
          ),
        ],
      },
      {
        h: "Fusily: an app I run end to end",
        blocks: [
          p(
            s("Since late 2024, I’ve been designing and building "),
            link("Fusily", projectPath("en", "fusily"), true),
            s(
              ", a recipe and meal-planning app, single-handedly and on every front: backend, frontend, mobile app, deployment and content.",
            ),
          ),
          p(
            s(
              "This isn’t just a side project: it’s living proof that I can steer a complete web and mobile project, from idea to app store. When you tell me about your project, I know exactly what it involves — because I’m going through those very same steps myself.",
            ),
          ),
        ],
      },
      {
        h: "How I work",
        blocks: [
          p(
            s("Everything starts "),
            b("before the first line of code"),
            s(
              ": with understanding your business, your needs and your users. A good project doesn’t begin with technology, but with the right questions.",
            ),
          ),
          p(
            s("Then I explain things as clearly as possible, "),
            b("without drowning you in technical jargon"),
            s(
              ". You don’t need to know what an API is to understand where your budget goes and why. My job is to translate your goals into concrete solutions and to keep you informed at every step.",
            ),
          ),
          p(
            s("The idea: that you move forward with "),
            b("peace of mind"),
            s(", always knowing where you stand. You’ll find the details of "),
            link("what I offer", `${home}#services`),
            s(" on my services page."),
          ),
        ],
      },
      {
        h: "Support that doesn’t stop at launch",
        blocks: [
          p(
            s(
              "A website or an app is a living thing. Once your project is online, I stay available for maintenance, handling the unexpected, and future improvements. You’re not left to fend for yourself on launch day: we build a lasting relationship, so your tool grows alongside your business.",
            ),
          ),
        ],
      },
      {
        h: "The technologies I use",
        blocks: [
          p(s("I build with a set of tools proven on demanding projects:")),
          ul(
            [
              b("Backend"),
              s(": Python, Django, Django REST Framework, PostgreSQL"),
            ],
            [b("Frontend"), s(": React, Next.js, TypeScript")],
            [
              b("Mobile"),
              s(
                ": React Native, Expo (iOS and Android apps from a single codebase)",
              ),
            ],
          ),
          p(
            s(
              "These choices deliver projects that are reliable, maintainable over time, and able to evolve with your needs. You can see these technologies in action in ",
            ),
            link("my work", localizedPath("en", "/projects")),
            s("."),
          ),
        ],
      },
    ],
    cta: {
      h: "Let’s talk about your project",
      lead: "Whether you have a clear idea or just a hunch to explore, the first step is always the same: a free, no-obligation conversation to understand what you need. I’ll get back to you within 24 hours.",
      linkLabel: "Get in touch",
      href: `${home}#contact`,
    },
  };
};

export const about: Record<Locale, AboutDoc> = {
  fr: frDoc(),
  en: enDoc(),
};

/** Localized alt text for the portrait. */
export const portraitAlt: Record<Locale, string> = {
  fr: "Guillaume Ojardias, développeur web & mobile freelance à Lyon",
  en: "Guillaume Ojardias, freelance web & mobile developer in Lyon",
};

/** Copy for the experience/parcours section (about page only). */
export const experienceSection = {
  eyebrow: { fr: "Expériences", en: "Experience" },
  title: { fr: "Mon parcours", en: "My background" },
  seeMore: { fr: "Voir plus", en: "See more" },
  seeLess: { fr: "Voir moins", en: "See less" },
};

const jobTitle: Record<Locale, string> = {
  fr: "Développeur web & mobile freelance",
  en: "Freelance web & mobile developer",
};

/**
 * schema.org JSON-LD for the About page: a Person (with sameAs social profiles
 * and knowsAbout tech) who provides a ProfessionalService serving Lyon/France,
 * plus the AboutPage node. Feeds local-intent queries ("développeur Lyon").
 */
export const aboutJsonLd = (locale: Locale, image: string) => {
  const doc = about[locale];
  const homeUrl = new URL(localizedPath(locale, "/"), SITE.url).toString();
  const aboutUrl = new URL(
    localizedPath(locale, "/about"),
    SITE.url,
  ).toString();
  const knowsAbout = tech.groups.flatMap((group) => group.items);
  const address = {
    "@type": "PostalAddress",
    addressLocality: "Lyon",
    addressRegion: "Auvergne-Rhône-Alpes",
    addressCountry: "FR",
  };
  const personId = `${SITE.url}/#person`;

  const person = {
    "@type": "Person",
    "@id": personId,
    name: SITE.name,
    jobTitle: jobTitle[locale],
    url: homeUrl,
    image,
    address,
    sameAs: Object.values(SITE.social),
    knowsAbout,
  };
  const business = {
    "@type": "ProfessionalService",
    "@id": `${SITE.url}/#business`,
    name: SITE.name,
    description: doc.metaDescription,
    url: homeUrl,
    image,
    founder: { "@id": personId },
    provider: { "@id": personId },
    areaServed: [
      { "@type": "City", name: "Lyon" },
      { "@type": "Country", name: "France" },
    ],
    address,
    knowsAbout,
    serviceType: jobTitle[locale],
  };
  const webPage = {
    "@type": "AboutPage",
    "@id": aboutUrl,
    url: aboutUrl,
    name: `${doc.metaTitle} — ${SITE.name}`,
    description: doc.metaDescription,
    inLanguage: locale === "fr" ? "fr-FR" : "en-US",
    isPartOf: {
      "@type": "WebSite",
      "@id": `${SITE.url}/#website`,
      url: SITE.url,
      name: SITE.name,
    },
    about: { "@id": personId },
    primaryImageOfPage: image,
  };

  return {
    "@context": "https://schema.org",
    "@graph": [person, business, webPage],
  };
};
