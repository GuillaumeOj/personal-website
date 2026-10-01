import type { Locale } from "../config";

export interface CaseStudySection {
  heading: string;
  paragraphs: string[];
}
export interface CaseStudy {
  metaDescription: string;
  sections: CaseStudySection[];
}

/**
 * Long-form case studies for the project pages, per locale (audit E5): a
 * search-length `metaDescription` and 3–4 sections rendered after the
 * project's `longDescription`. Facts only, from the project data, the blog
 * posts about it and its public repository: no invented metrics or quotes.
 */
export const caseStudies: Record<string, Record<Locale, CaseStudy>> = {
  fusily: {
    fr: {
      metaDescription:
        "Fusily, application de recettes et de planification de repas sur iOS et Android, que je développe de bout en bout avec React Native, Expo et Django.",
      sections: [
        {
          heading: "Le contexte",
          paragraphs: [
            "Je suis développeur backend : j'ai passé l'essentiel de ma carrière à concevoir des API et des modèles de données. Fusily est le projet qui m'a fait passer au mobile, puis au full-stack. L'idée : une application pour les passionnés de cuisine, où l'on partage ses recettes, en découvre de nouvelles, les planifie pour la semaine et se laisse guider pas à pas aux fourneaux.",
            "Développer en natif aurait voulu dire apprendre Swift et Kotlin, maintenir deux bases de code et deux cycles de publication. Seul sur le projet, j'ai choisi une base de code unique, déployée sur iOS et Android.",
          ],
        },
        {
          heading: "Ce que j'ai construit",
          paragraphs: [
            "Chaque recette peut recevoir une ou plusieurs photos ou vidéos, que l'on réordonne avec un retour haptique. La partie sociale (commentaires, mentions j'aime, favoris, abonnements) s'accompagne de notifications push : rappel des repas planifiés, nouvelle recette partagée dans un domaine qui vous intéresse. Les jetons d'authentification sont conservés dans le stockage sécurisé du téléphone (le trousseau sur iOS et son équivalent sur Android), jamais en clair.",
            "L'application est bilingue, en français et en anglais, et la traduction ne s'arrête pas à l'interface : les recettes et les astuces écrites par les utilisateurs sont traduites automatiquement. Le texte saisi est enregistré tout de suite dans sa langue d'origine, puis une tâche Celery détecte la langue et produit les autres versions via l'API Google Translate, en arrière-plan. Les commentaires, plus éphémères, restent dans leur langue.",
          ],
        },
        {
          heading: "La stack et pourquoi",
          paragraphs: [
            "Côté mobile, React Native avec Expo. Les bibliothèques Expo couvrent l'accès au matériel (notifications, stockage sécurisé, galerie photo, vibrations), et les services EAS gèrent la compilation avec trois profils (développement, préversion, production), l'envoi des binaires aux stores et les mises à jour à distance. Un correctif JavaScript peut ainsi partir en production en quelques minutes, sans repasser par la validation des stores.",
            "Pour les composants d'interface, j'ai commencé avec Tamagui avant de migrer vers React Native Paper : chaque mise à jour de Tamagui apportait son lot de régressions, et je passais plus de temps à gérer la bibliothèque qu'à faire avancer le produit. Pour le web, j'utilise Next.js et Tailwind CSS plutôt qu'un framework unique pour les deux plateformes.",
            "Côté serveur, Django et Django REST Framework sur PostgreSQL : mon terrain habituel, qui m'a permis de réutiliser mes réflexes de conception d'API et de modèle de données pendant que j'apprenais le mobile.",
          ],
        },
        {
          heading: "Où en est le projet",
          paragraphs: [
            "Fusily est gratuite et publiée sur l'App Store et Google Play depuis 2024. Je continue de la maintenir et de la faire évoluer. Plusieurs articles de ce blog en racontent les coulisses, du passage à Expo à la traduction du contenu utilisateur.",
          ],
        },
      ],
    },
    en: {
      metaDescription:
        "Fusily, a recipe and meal-planning app for iOS and Android that I build end to end with React Native, Expo, Django and PostgreSQL. Free on both stores.",
      sections: [
        {
          heading: "The context",
          paragraphs: [
            "I'm a backend developer by trade: I've spent most of my career designing APIs and data models. Fusily is the project that took me into mobile, and then into full-stack work. The idea: an app for cooking enthusiasts where you share recipes, discover new ones, plan them for the week and get guided step by step at the stove.",
            "Going fully native would have meant learning Swift and Kotlin, and maintaining two codebases and two release cycles. Working on my own, I chose a single codebase shipped to both iOS and Android.",
          ],
        },
        {
          heading: "What I built",
          paragraphs: [
            "Each recipe can hold one or more photos or videos, which you reorder with haptic feedback. The social side (comments, likes, favorites, follows) comes with push notifications: reminders of your planned meals, or a new recipe shared in an area you're interested in. Authentication tokens are kept in the phone's secure storage (the iOS Keychain and its Android equivalent), never in plain text.",
            "The app is bilingual, in French and English, and translation goes beyond the interface: recipes and tips written by users are translated automatically. What you type is saved right away in its original language, then a Celery task detects the language and produces the other versions through the Google Translate API, in the background. Comments, which are more ephemeral, stay in their original language.",
          ],
        },
        {
          heading: "The stack and why",
          paragraphs: [
            "On mobile, React Native with Expo. Expo's libraries cover device access (notifications, secure storage, the photo library, haptics), and EAS handles builds with three profiles (development, preview, production), store submission and over-the-air updates. A JavaScript fix can reach production in minutes, without going back through store review.",
            "For UI components, I started with Tamagui and later moved to React Native Paper: every Tamagui update brought its share of regressions, and I was spending more time managing the library than building the product. On the web, I use Next.js and Tailwind CSS rather than one framework for both platforms.",
            "On the server, Django and Django REST Framework on PostgreSQL: my home ground, which let me reuse my API and data-modeling habits while I learned mobile.",
          ],
        },
        {
          heading: "Where it stands",
          paragraphs: [
            "Fusily is free and has been on the App Store and Google Play since 2024. I keep maintaining it and adding to it. Several posts on this blog cover what happens behind the scenes, from adopting Expo to translating user-generated content.",
          ],
        },
      ],
    },
  },

  "ma-garde-sereine": {
    fr: {
      metaDescription:
        "Ma Garde Sereine, application en bêta pour gérer une garde d'enfants à domicile, partagée ou non, et préparer la déclaration Pajemploi. Django et React.",
      sections: [
        {
          heading: "Le contexte",
          paragraphs: [
            "Employer une garde d'enfants à domicile fait de vous un employeur : il faut un contrat, suivre les heures, gérer les congés payés et les jours fériés, puis déclarer chaque mois le salaire sur Pajemploi. En garde partagée, deux familles emploient la même personne, et chacune doit déclarer sa propre part.",
            "Ma Garde Sereine est un projet personnel : une application qui prend en charge ce suivi mensuel, pour que les familles passent moins de temps sur l'administratif.",
          ],
        },
        {
          heading: "Ce que j'ai construit",
          paragraphs: [
            "L'application part du contrat : le taux net, le planning hebdomadaire, les congés payés et les jours fériés. Une fois ce cadre posé, le mois se remplit au fil de l'eau, en distinguant les heures normales, les heures majorées et les jours fériés.",
            "En fin de mois, ces heures sont réparties entre les deux familles d'une garde partagée, et chacune obtient ce qu'elle doit déclarer sur Pajemploi pour sa part. L'application sert aussi aux familles qui emploient seules leur garde à domicile.",
            "Les règles appliquées sont celles de la convention collective du particulier employeur et de l'emploi à domicile (IDCC 3239), qui encadre la garde d'enfants à domicile.",
          ],
        },
        {
          heading: "La stack et pourquoi",
          paragraphs: [
            "Le frontend est une application React, qui s'appuie sur une API Django / Django REST Framework et une base PostgreSQL. Le backend est mon terrain habituel.",
            "Le tout est hébergé sur Vercel, y compris le backend Django, servi par des fonctions serverless : un seul hébergeur et un seul flux de déploiement pour le frontend comme pour l'API. J'ai détaillé cette configuration et ses contraintes (fichiers statiques, migrations, pas de tâche de fond permanente) dans un article de ce blog sur l'hébergement Vercel.",
          ],
        },
        {
          heading: "Où en est le projet",
          paragraphs: [
            "Ma Garde Sereine est en bêta et accessible en ligne. L'application continue d'évoluer pendant cette phase.",
          ],
        },
      ],
    },
    en: {
      metaDescription:
        "Ma Garde Sereine, a beta web app to manage in-home childcare, shared or not, and prepare the monthly Pajemploi declaration in France. Django and React.",
      sections: [
        {
          heading: "The context",
          paragraphs: [
            "In France, hiring an in-home nanny makes you an employer: you need a contract, you track hours, paid leave and public holidays, then declare the salary on Pajemploi every month. In shared care, two families employ the same person, and each one has to declare its own share.",
            "Ma Garde Sereine is a personal project: an app that takes care of that monthly tracking, so families spend less time on paperwork.",
          ],
        },
        {
          heading: "What I built",
          paragraphs: [
            "The app starts from the contract: the net rate, the weekly schedule, paid leave and public holidays. With that in place, the month fills in as it goes, separating regular hours, overtime and public holidays.",
            "At the end of the month, those hours are split between the two families sharing the nanny, and each family gets what it needs to declare its share on Pajemploi. The app also works for a family employing a nanny on its own.",
            "The rules applied are those of the French collective agreement for private employers and in-home employment (IDCC 3239), which covers in-home childcare.",
          ],
        },
        {
          heading: "The stack and why",
          paragraphs: [
            "The front end is a React app backed by a Django / Django REST Framework API and a PostgreSQL database. The backend is my home ground.",
            "Everything is hosted on Vercel, including the Django backend, which runs as serverless functions: one provider and one deployment workflow for both the front end and the API. I described this setup and its constraints (static files, migrations, no long-running background jobs) in a post on this blog about hosting on Vercel.",
          ],
        },
        {
          heading: "Where it stands",
          paragraphs: [
            "Ma Garde Sereine is in beta and available online. The app keeps evolving during this phase.",
          ],
        },
      ],
    },
  },

  "personal-website": {
    fr: {
      metaDescription:
        "Mon site de développeur full-stack à Lyon : Astro, Tailwind CSS, articles Markdown bilingues versionnés, tests Playwright et Vitest, déployé sur Vercel.",
      sections: [
        {
          heading: "Le contexte",
          paragraphs: [
            "Ce site est le projet sur lequel je reviens le plus souvent, et mon terrain d'essai pour les stacks et les outils. Sa première version associait Astro pour le blog, Next.js pour la page de présentation, et Notion comme CMS : un webhook relançait le build à chaque modification, et les images étaient recopiées dans Vercel Blob parce que Notion n'expose que des URL temporaires.",
            "Je l'ai simplifiée depuis : tout le site tourne aujourd'hui sur Astro seul, et les articles sont des fichiers Markdown dans le dépôt. Les anciennes adresses des articles redirigent de façon permanente vers les nouvelles.",
          ],
        },
        {
          heading: "Ce que j'ai construit",
          paragraphs: [
            "Le français est la langue par défaut, l'anglais vit sous /en. Chaque article existe en deux fichiers reliés par une clé de traduction commune, ce qui alimente le sélecteur de langue et les balises hreflang de chaque article. Le site propose un thème clair et un thème sombre, un flux RSS par langue et des données structurées (Person, ProfessionalService, BlogPosting, fil d'Ariane).",
            "Au build, une intégration Astro compose avec sharp des cartes Open Graph de 1200 × 630 pixels pour les pages et les projets (celles des articles sont recadrées depuis leur image de couverture), afin que les partages sur LinkedIn ou Slack ne recadrent plus une image verticale. Le formulaire de contact passe par une fonction Vercel qui envoie le message via l'API Brevo ; il fonctionne aussi sans JavaScript, avec une redirection vers une page de confirmation.",
          ],
        },
        {
          heading: "La stack et pourquoi",
          paragraphs: [
            "Astro génère du HTML statique et n'envoie presque pas de JavaScript au navigateur, ce qui convient à un site dont l'essentiel du contenu est du texte. Tailwind CSS gère le style, et la coloration du code dans les articles passe par Shiki, en version claire et sombre.",
            "La qualité est vérifiée à chaque pull request par une intégration continue GitHub Actions : lint avec Biome, vérification des types avec astro check, tests unitaires Vitest, build, puis tests de bout en bout Playwright. Chaque pull request obtient aussi son URL de prévisualisation sur Vercel, pratique pour relire un article avant de le fusionner. Renovate propose chaque lundi les mises à jour de dépendances et fusionne seul les versions mineures et correctives.",
          ],
        },
        {
          heading: "Où en est le projet",
          paragraphs: [
            "Le site est en production sur Vercel, et son code est public sous licence MIT. Je continue de l'améliorer, notamment sur les performances, l'accessibilité et le référencement.",
          ],
        },
      ],
    },
    en: {
      metaDescription:
        "My Lyon-based full-stack developer website: Astro, Tailwind CSS, bilingual Markdown posts in git, Playwright and Vitest tests, deployed on Vercel.",
      sections: [
        {
          heading: "The context",
          paragraphs: [
            "This site is the project I keep coming back to, and my testing ground for stacks and tools. Its first version combined Astro for the blog, Next.js for the about page and Notion as a CMS: a webhook triggered a rebuild on every change, and images were copied to Vercel Blob because Notion only exposes temporary URLs.",
            "I have since simplified it: the whole site now runs on Astro alone, and posts are Markdown files in the repository. The old article URLs permanently redirect to the new ones.",
          ],
        },
        {
          heading: "What I built",
          paragraphs: [
            "French is the default language and English lives under /en. Each post exists as two files linked by a shared translation key, which drives the language switcher and each post's hreflang tags. The site has light and dark themes, one RSS feed per language, and structured data (Person, ProfessionalService, BlogPosting, breadcrumbs).",
            "At build time, an Astro integration uses sharp to compose 1200 × 630 Open Graph cards for pages and projects (posts crop theirs from the cover image), so shares on LinkedIn or Slack no longer crop a portrait image. The contact form posts to a Vercel function that sends the message through the Brevo API; it also works without JavaScript, redirecting to a confirmation page.",
          ],
        },
        {
          heading: "The stack and why",
          paragraphs: [
            "Astro outputs static HTML and ships almost no JavaScript to the browser, which suits a site that is mostly text. Tailwind CSS handles styling, and code blocks in posts are highlighted by Shiki in both light and dark variants.",
            "Every pull request goes through a GitHub Actions pipeline: Biome linting, type checking with astro check, Vitest unit tests, the build, then Playwright end-to-end tests. Each pull request also gets its own Vercel preview URL, handy for proofreading a post before merging it. Renovate opens dependency updates every Monday and merges minor and patch versions on its own.",
          ],
        },
        {
          heading: "Where it stands",
          paragraphs: [
            "The site is in production on Vercel, and its code is public under the MIT license. I keep improving it, especially its performance, accessibility and SEO.",
          ],
        },
      ],
    },
  },

  dotcraft: {
    fr: {
      metaDescription:
        "dotcraft, éditeur de QR codes stylisés open source (React, TypeScript, Django) : formes, couleurs, logo, export PNG ou SVG, sans compte obligatoire.",
      sections: [
        {
          heading: "Le contexte",
          paragraphs: [
            "Tout est parti d'un besoin simple : un QR code soigné, avec mon logo au centre. Les générateurs en ligne que j'ai trouvés étaient couverts de publicités, exigeaient un compte pour télécharger ou conserver ses codes, et produisaient souvent un QR code brut, sans options de style. Pour un outil qui peut tout faire dans le navigateur, cela faisait beaucoup de zones d'ombre sur ce que deviennent vos données.",
          ],
        },
        {
          heading: "Ce que j'ai construit",
          paragraphs: [
            "Vous partez d'une URL ou d'un texte, puis vous façonnez le résultat. Les modules peuvent être carrés, arrondis, en cercles ou en points ; les trois repères des coins peuvent être carrés, arrondis, circulaires ou en goutte, une forme dont un angle pointe vers le centre du code. Vous choisissez les couleurs, la marge, et pouvez placer un logo (PNG, JPG ou SVG) avec son fond, sa marge intérieure et ses coins arrondis. Avec un logo, la correction d'erreur passe automatiquement au niveau le plus élevé pour que le code reste lisible.",
            "L'export se fait en PNG (512, 1024 ou 2048 pixels) ou en SVG autonome. Les QR codes s'organisent en projets et sous-dossiers, et sont enregistrés localement, dans le localStorage et l'IndexedDB du navigateur. Pour ne pas rester lié à un seul navigateur, la bibliothèque s'exporte dans un fichier que l'on réimporte ailleurs. Le compte reste facultatif : avec un compte gratuit, la bibliothèque est sauvegardée et synchronisée automatiquement entre vos appareils, et un mot de passe oublié se réinitialise par e-mail.",
          ],
        },
        {
          heading: "La stack et pourquoi",
          paragraphs: [
            "La toute première version était un script Python en ligne de commande, mon réflexe de développeur backend. Elle fonctionnait, mais un QR code est un objet visuel : modifier une couleur ou une forme en relançant une commande était bien trop lent. Je suis donc passé au web, avec Vite, React et TypeScript, et Claude Code m'a aidé à transformer le script en véritable éditeur en un après-midi.",
            "Le QR code est généré à partir de sa matrice brute puis dessiné en SVG directement dans la page. Ce rendu sur mesure donne un contrôle total sur la forme des repères, y compris la goutte, et un export propre. La synchronisation des comptes s'appuie sur une API Django / Django REST Framework et une base PostgreSQL ; sur Vercel, un seul projet sert l'éditeur à la racine et l'API sous /api.",
          ],
        },
        {
          heading: "Où en est le projet",
          paragraphs: [
            "L'outil est en ligne sur dotcraft.fr et hébergé sur Vercel. Le code est open source sur GitHub, avec un README qui en décrit l'architecture : chacun peut vérifier ce que fait l'outil, s'en inspirer ou contribuer.",
          ],
        },
      ],
    },
    en: {
      metaDescription:
        "dotcraft, an open-source styled QR code editor built with React, TypeScript and Django: shapes, colors, logo, PNG or SVG export, no account required.",
      sections: [
        {
          heading: "The context",
          paragraphs: [
            "It started with a simple need: a clean QR code with my logo in the center. The online generators I found were covered in ads, asked for an account before you could download or keep your codes, and often produced a raw QR code with no styling options. For a tool that can do everything in the browser, that left a lot of uncertainty about what happens to your data.",
          ],
        },
        {
          heading: "What I built",
          paragraphs: [
            "You start from a URL or some text, then shape the result. Modules can be square, rounded, circles or dots; the three corner markers can be square, rounded, circular or droplet-shaped, with one corner pointing toward the center of the code. You pick the colors and the margin, and can add a logo (PNG, JPG or SVG) with its own background, padding and rounded corners. When a logo is present, error correction switches to the highest level so the code stays scannable.",
            "Export goes to PNG (512, 1024 or 2048 pixels) or self-contained SVG. QR codes are organized into projects and subfolders and saved locally, in the browser's localStorage and IndexedDB. So you're not tied to one browser, the library can be exported to a file and imported somewhere else. An account stays optional: with a free account, the library is backed up and synced across your devices automatically, and a forgotten password can be reset by email.",
          ],
        },
        {
          heading: "The stack and why",
          paragraphs: [
            "The very first version was a Python command-line script, my reflex as a backend developer. It worked, but a QR code is a visual object: changing a color or a shape by re-running a command was far too slow. So I moved to the web with Vite, React and TypeScript, and Claude Code helped me turn the script into a real editor in a single afternoon.",
            "The QR code is generated from its raw matrix and then drawn as SVG right in the page. That custom rendering gives full control over the corner markers, including the droplet, and a clean export. Account sync relies on a Django / Django REST Framework API and a PostgreSQL database; on Vercel, a single project serves the editor at the root and the API under /api.",
          ],
        },
        {
          heading: "Where it stands",
          paragraphs: [
            "The tool is live at dotcraft.fr and hosted on Vercel. The code is open source on GitHub, with a README that explains the architecture: anyone can check what the tool does, draw on it or contribute.",
          ],
        },
      ],
    },
  },

  "eva-biezunski-avocate": {
    fr: {
      metaDescription:
        "Site vitrine d'un cabinet d'avocate en droit des sociétés à Lyon : Next.js, Django, PostgreSQL, publications administrables et connecteur MCP.",
      sections: [
        {
          heading: "Ce que j'ai construit",
          paragraphs: [
            "Le site présente sur une seule page les domaines d'intervention du cabinet, avec un formulaire de contact dont les messages sont envoyés par e-mail via Brevo. Une page /carte fait office de carte de visite numérique, avec une fiche contact vCard à télécharger. La section Publications réunit les articles sur /publications, et les trois derniers apparaissent sur la page d'accueil.",
            "Les articles se rédigent dans une interface d'administration privée, avec un éditeur inspiré de Notion. Le Markdown reste la source de vérité, rendu et nettoyé côté serveur. Un article reste en brouillon jusqu'à sa publication, et une date future la programme. Les images importées sont redressées, débarrassées de leurs métadonnées et converties en WebP. Des catégories principales servent de filtres sur la page des publications, et trois rôles (administrateur, éditeur, auteur) encadrent qui peut faire quoi.",
            "Le connecteur MCP expose des outils pour lister, créer, modifier, publier ou dépublier un article. Un article créé depuis un chat IA est un brouillon par défaut, et chaque action respecte le rôle du propriétaire du jeton.",
          ],
        },
        {
          heading: "La stack et pourquoi",
          paragraphs: [
            "Le dépôt réunit un frontend Next.js (qui sert aussi l'interface d'administration) et un backend Django / Django REST Framework. Les types TypeScript du frontend sont générés à partir du schéma OpenAPI de l'API : si un serializer change sans que les types suivent, un test et l'intégration continue échouent. Côté backend, la suite de tests échoue sous 90 % de couverture.",
            "Le site est hébergé sur Vercel, avec une base PostgreSQL sur Neon et les images en production sur Vercel Blob.",
          ],
        },
        {
          heading: "Où en est le projet",
          paragraphs: [
            "Le site est en ligne depuis juin 2026, et la cliente publie elle-même ses articles. Le projet a été livré clés en main : le code et l'hébergement lui appartiennent.",
          ],
        },
      ],
    },
    en: {
      metaDescription:
        "Business website for a corporate-law practice in Lyon: Next.js, Django and PostgreSQL, a self-managed publications space and an MCP connector.",
      sections: [
        {
          heading: "What I built",
          paragraphs: [
            "The site presents the practice's areas of expertise on a single page, with a contact form whose messages are emailed through Brevo. A /carte page works as a digital business card, with a downloadable vCard. The Publications section gathers articles on /publications, and the three latest also appear on the home page.",
            "Articles are written in a private admin interface with a Notion-style editor. Markdown stays the source of truth, rendered and sanitized on the server. An article stays a draft until it's published, and a future date schedules it. Uploaded images are straightened, stripped of their metadata and converted to WebP. Primary categories act as filters on the publications page, and three roles (administrator, editor, author) define who can do what.",
            "The MCP connector exposes tools to list, create, edit, publish or unpublish an article. An article created from an AI chat is a draft by default, and every action follows the role of the token's owner.",
          ],
        },
        {
          heading: "The stack and why",
          paragraphs: [
            "The repository holds a Next.js front end (which also serves the admin interface) and a Django / Django REST Framework backend. The front end's TypeScript types are generated from the API's OpenAPI schema: if a serializer changes and the types don't follow, a test and the CI fail. On the backend, the test suite fails below 90% coverage.",
            "The site is hosted on Vercel, with a PostgreSQL database on Neon and, in production, images stored on Vercel Blob.",
          ],
        },
        {
          heading: "Where it stands",
          paragraphs: [
            "The site has been live since June 2026, and the client publishes her articles herself. It was delivered as a turnkey project: the code and hosting belong to her.",
          ],
        },
      ],
    },
  },

  "re-source-et-moi": {
    fr: {
      metaDescription:
        "Site d'une association d'Éducation Kinesthésique® : ateliers, tarifs et avis gérés en autonomie dans une interface dédiée. Next.js, Django, Neon et Vercel.",
      sections: [
        {
          heading: "Ce que j'ai construit",
          paragraphs: [
            "Les textes du site sont fixes, mais trois contenus changent souvent : les dates des ateliers, les tarifs et les avis. Ils viennent de l'API, pour que l'association puisse les modifier sans redéploiement. Une interface d'édition en français permet de gérer les ateliers en liste ou en calendrier mensuel, les groupes de tarifs avec leurs lignes, et les avis, que l'on publie ou masque d'un clic. La page d'accueil affiche les trois avis publiés les plus récents. L'association gère tout cela en autonomie, sans toucher au code ni attendre que j'intervienne.",
            "Dans l'interface d'édition, chaque lecture et chaque écriture exige une connexion, et les tentatives de connexion sont limitées. Après chaque enregistrement, le cache du site public est invalidé, et la modification apparaît dès la requête suivante. En cas d'oubli, un lien de réinitialisation du mot de passe, valable deux heures et utilisable une seule fois, est envoyé par e-mail via Brevo.",
          ],
        },
        {
          heading: "La stack et pourquoi",
          paragraphs: [
            "Le frontend Next.js récupère les ateliers et les tarifs côté serveur, si bien que les dates et les prix figurent dans le HTML que lisent les moteurs de recherche. Si l'API ne répond plus, la section affiche un message d'indisponibilité plutôt qu'un tarif périmé : un prix obsolète est pire qu'aucun prix.",
            "Le backend Django / Django REST Framework renvoie des données brutes (dates ISO, montants numériques), et le frontend se charge de la mise en forme en français. Les types TypeScript sont générés à partir du schéma OpenAPI et comparés en intégration continue, pour que les deux côtés ne divergent pas. Sur Vercel, un seul projet sert les deux sous le même domaine : /api va à Django, le reste à Next.js, avec une base PostgreSQL sur Neon.",
          ],
        },
        {
          heading: "Où en est le projet",
          paragraphs: [
            "Le site est en ligne depuis septembre 2026, livré clés en main. Il a été conçu pour viser le niveau AA des WCAG en accessibilité, et sa base technique permet de continuer à l'enrichir.",
          ],
        },
      ],
    },
    en: {
      metaDescription:
        "Website for a Kinesthetic Education® non-profit: workshops, pricing and reviews it manages itself in a dedicated editor. Next.js, Django and Neon.",
      sections: [
        {
          heading: "What I built",
          paragraphs: [
            "Most of the site's copy is fixed, but three things change often: workshop dates, pricing and reviews. They come from the API, so the association can update them without a redeploy. A French-language editor manages workshops as a list or a monthly calendar, pricing groups with their lines, and reviews, which can be published or hidden in one click. The home page shows the three most recent published reviews. The association handles all of this on its own, without touching the code or waiting for me to make a change.",
            "In the editor, every read and write requires a login, and login attempts are throttled. After each save, the public site's cache is cleared, and the change shows up on the next request. For a forgotten password, a reset link, valid for two hours and usable once, is emailed through Brevo.",
          ],
        },
        {
          heading: "The stack and why",
          paragraphs: [
            "The Next.js front end fetches workshops and pricing on the server, so dates and prices are in the HTML that search engines read. If the API stops responding, the section shows an unavailability notice instead of an outdated price: a stale price is worse than no price.",
            "The Django / Django REST Framework backend returns raw data (ISO dates, numeric amounts), and the front end handles French formatting. TypeScript types are generated from the OpenAPI schema and checked in CI, so the two sides can't drift apart. On Vercel, a single project serves both under one domain: /api goes to Django and everything else to Next.js, with a PostgreSQL database on Neon.",
          ],
        },
        {
          heading: "Where it stands",
          paragraphs: [
            "The site has been live since September 2026, delivered as a turnkey project. It was built to target WCAG AA accessibility, on a foundation that leaves room to keep adding to it.",
          ],
        },
      ],
    },
  },
};

/** The case study of a project in `locale`; a missing one fails the build. */
export const caseStudyFor = (slug: string, locale: Locale): CaseStudy => {
  const study = caseStudies[slug]?.[locale];
  if (!study) throw new Error(`No ${locale} case study for project "${slug}"`);
  return study;
};
