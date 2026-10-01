# guillaume-ojardias

Site personnel de Guillaume Ojardias — landing page bilingue (FR / EN) + blog.

## Stack

- **[Astro 7](https://astro.build/)** — générateur de site statique, i18n natif, Content Layer.
- **[Tailwind CSS v4](https://tailwindcss.com/)** + `@tailwindcss/typography` pour le rendu Markdown.
- **Markdown** dans `src/content/blog/{fr,en}/` (chargé par le loader `glob`, validé via Zod).
- **Shiki** (intégré à Astro) pour la coloration syntaxique, en double thème clair/sombre.
- **[Bun](https://bun.sh/)** pour la gestion des dépendances et l'exécution des scripts.
- **[Biome](https://biomejs.dev/)** pour le lint et le formatage.
- **[Vitest](https://vitest.dev/)** pour les tests unitaires.
- **[Playwright](https://playwright.dev/)** pour les tests end-to-end.
- **GitHub Actions** pour l'intégration continue.
- **[Renovate](https://docs.renovatebot.com/)** pour la mise à jour automatique des dépendances (versions lockées exactes via `bunfig.toml`).
- Hébergé sur **[Vercel](https://vercel.com/)**.

## Pré-requis

- [Bun](https://bun.sh/) (`curl -fsSL https://bun.sh/install | bash`)
- Node.js 24 (version exacte dans `.nvmrc`, utilisé par certains outils via `bunx`, ex. `astro check`)

## Installation

```sh
bun install
bunx playwright install chromium  # nécessaire la première fois pour les tests E2E
```

## Scripts

| Commande | Description |
|---|---|
| `bun run dev` | Démarre le serveur de dev (http://localhost:4321) |
| `bun run build` | Build de production dans `dist/` |
| `bun run preview` | Sert le build local |
| `bun run lint` | Lint + format check (Biome) |
| `bun run check` | Lint + format avec auto-fix (Biome) |
| `bun run format` | Format uniquement (Biome) |
| `bun run typecheck` | Vérification TypeScript (`astro check`) |
| `bun run test:unit` | Tests unitaires (Vitest) |
| `bun run test:e2e` | Tests end-to-end (Playwright, sur le build de preview) |

## Ajouter un article de blog

1. Créer un fichier Markdown dans `src/content/blog/fr/` (ou `en/`) nommé
   `YYYY-MM-DD-<slug>.md`. Le préfixe de date garde le dossier lisible dans l'ordre
   de publication ; les métadonnées, elles, viennent toujours du frontmatter.
2. Inclure le frontmatter requis :

   ```yaml
   ---
   title: "Titre de l’article"
   description: "Résumé d’une ou deux phrases."
   pubDate: 2026-05-06
   lang: fr
   slug: titre-de-l-article
   translationKey: sujet-partage
   cover: ../../../assets/blog/sujet-partage/cover.jpg
   tags: []
   ---
   ```

   - `slug` — le segment d'URL. Il diffère d'une langue à l'autre et **ne doit jamais
     changer** une fois publié (SEO).
   - `translationKey` — clé partagée par la paire FR/EN. C'est elle qui alimente le
     `hreflang` et le sélecteur de langue. Interne : elle n'apparaît dans aucune URL.
   - `cover` — chemin **relatif au fichier Markdown** (les chemins nus ou les alias
     TypeScript ne sont pas résolus par le Content Layer). Les deux langues d'une paire
     pointent vers la même image ; son `alt` rendu est le titre de l'article.
   - `author` (optionnel) — uniquement pour une signature invitée ; absent, c'est
     l'auteur du site.
3. Créer la version dans l'autre langue avec la **même `translationKey`**, sinon
   l'article n'a ni `hreflang` ni équivalent dans le sélecteur de langue.
4. Commit + push : Vercel rebuild automatiquement.

### Images des articles

Les visuels vivent dans `src/assets/blog/<translationKey>/`, partagés par la paire
FR/EN — la couverture à la racine, les illustrations du corps de texte dans un
sous-dossier par langue quand elles contiennent du texte à traduire :

```
src/assets/blog/react-native-expo/
├── cover.jpg
├── fr/01-natif-vs-cross-platform.svg
└── en/01-native-vs-cross-platform.svg
```

On les référence relativement depuis le Markdown
(`![Description](../../../assets/blog/<clé>/fr/01-schema.svg)`) : Astro les optimise
au build. Les couvertures `.jpg` sont suivies par **Git LFS** (règle
`src/assets/**/*.jpg` dans `.gitattributes`) ; les SVG, qui sont du texte, en sont
volontairement exclus pour rester diffables.

## Architecture rapide

```
src/
├── config.ts            # Constantes du site (nom, URL, e-mails, SIREN, locales, liens)
├── content.config.ts    # Loader glob + schéma Zod de la collection blog
├── content/blog/{fr,en}/  # Articles Markdown
├── assets/              # Portrait, couvertures et illustrations, captures de projets
├── i18n/ui.ts           # Dictionnaires, t(locale, key), localizedPath/localizedUrl
├── middleware.ts        # Typographie française (espaces insécables) sur le HTML
├── layouts/             # BaseLayout, HubLayout, BlogPostLayout, ProjectLayout
├── components/          # En-tête, pied de page, sélecteurs, cartes, SeoHead…
│   ├── home/ about/ services/ contact/ legal/  # Sections par page
│   └── lists/           # NumberedCards, Timeline, CheckList
├── scripts/             # Scripts client bundlés (reveal, snap, halo des boutons)
├── lib/                 # Contenu et logique pure, testés unitairement
│   ├── home.ts about.ts services.ts contact-page.ts legal.ts  # Textes des pages
│   ├── projects.ts case-studies.ts experience.ts  # Projets et parcours
│   ├── posts.ts related.ts rss.ts  # Blog (runtime Astro)
│   ├── post-files.ts    # Lecture du frontmatter sur disque (chargement de la config)
│   ├── schema.ts seo.ts alternates.ts  # JSON-LD, titres, hreflang
│   ├── og.ts og-compose.ts  # URLs et composition (sharp) des cartes Open Graph
│   └── contact.ts http.ts  # Validation et envoi du formulaire de contact
├── pages/               # Routes FR (+ og/ : cartes Open Graph, rss.xml.ts)
└── pages/en/            # Routes EN (mêmes routes, préfixées par /en)
```

`api/` (hors `src/`) contient les fonctions serverless Vercel — aujourd'hui le seul
`contact.ts`. Le build fonctionne hors ligne. Il ne lit que deux variables d'environnement
facultatives, `LEGAL_ADDRESS` et `LEGAL_PHONE` (voir `.env.example`). Elles sont injectées
dans les mentions légales pour garder l'adresse postale et le téléphone hors du dépôt
public. Sans elles, la page affiche un texte de remplacement. Seul un build de
production Vercel (`VERCEL_ENV=production`) échoue si elles manquent.

## CI

Le workflow `.github/workflows/ci.yml` se lance sur chaque pull request et chaque push sur `main`. Il enchaîne :

1. `bun install --frozen-lockfile`
2. `bun run lint` (Biome)
3. `bun run typecheck` (`astro check`)
4. `bun run test:unit` (Vitest)
5. `bun run build` (Astro)
6. `bun run test:e2e` (Playwright)

À configurer côté GitHub : marquer `verify` comme **status check requis** sur la branche `main` (Settings → Branches → Branch protection rules).

## Renovate

Le fichier `renovate.json` configure :

- Toutes les dépendances pinnées en version exacte (`rangeStrategy: pin`).
- Patchs et minors regroupés dans un seul PR par semaine, automerge si la CI est verte.
- Majors dans des PRs séparés (label `major-update`) à reviewer manuellement.
- `lockFileMaintenance` hebdomadaire pour rafraîchir `bun.lock`.

À faire une seule fois : installer la **[GitHub App Renovate](https://github.com/apps/renovate)** sur le repo.

## Déploiement Vercel

1. Pousser le repo sur GitHub.
2. Sur [vercel.com](https://vercel.com), `Add New Project` → importer le repo.
3. Vercel détecte Astro + Bun automatiquement (présence de `bun.lock`). Aucun paramétrage requis.
4. Chaque PR ouvre une preview, chaque merge sur `main` déploie en production.
5. Variables d'environnement : `BREVO_API_KEY` (formulaire de contact), ainsi que
   `LEGAL_ADDRESS` et `LEGAL_PHONE` (mentions légales, obligatoires en Production).

## Licence

Le code source est publié sous [licence MIT](LICENSE). Elle ne couvre pas le contenu
éditorial : les textes, les photographies personnelles et les éléments graphiques
(notamment sous `src/content/` et `src/assets/`) restent la propriété de Guillaume
Ojardias. Voir les mentions légales du site.

## TODO (post-V1)

- [ ] Optionnel : analytics (Plausible / Vercel), commentaires (giscus).
