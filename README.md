# guillaume-ojardias

Site personnel de Guillaume Ojardias — landing page bilingue (FR / EN) + blog.

## Stack

- **[Astro 6](https://astro.build/)** — générateur de site statique, i18n natif, Content Collections.
- **[Tailwind CSS v4](https://tailwindcss.com/)** + `@tailwindcss/typography` pour le rendu Markdown.
- **Markdown** dans `src/content/blog/{fr,en}/` (validé via Zod).
- **[Bun](https://bun.sh/)** pour la gestion des dépendances et l'exécution des scripts.
- **[Biome](https://biomejs.dev/)** pour le lint et le formatage.
- **[Vitest](https://vitest.dev/)** pour les tests unitaires.
- **[Playwright](https://playwright.dev/)** pour les tests end-to-end.
- **GitHub Actions** pour l'intégration continue.
- **[Renovate](https://docs.renovatebot.com/)** pour la mise à jour automatique des dépendances (versions lockées exactes via `bunfig.toml`).
- Hébergé sur **[Vercel](https://vercel.com/)**.

## Pré-requis

- [Bun](https://bun.sh/) (`curl -fsSL https://bun.sh/install | bash`)
- Node.js ≥ 22 (utilisé par certains outils via `bunx`, ex. `astro check`)

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

1. Créer un fichier Markdown dans `src/content/blog/fr/` (ou `en/`) avec le nom `YYYY-MM-DD-slug.md`.
2. Inclure le frontmatter requis :

   ```yaml
   ---
   title: 'Titre de l’article'
   description: 'Résumé d’une ou deux phrases.'
   pubDate: 2026-05-06
   lang: fr
   tags: [optionnel]
   draft: false
   ---
   ```

3. L'idéal est de créer la version dans l'autre langue (mêmes `pubDate` et `slug`) pour que le sélecteur de langue tombe sur l'équivalent.
4. Commit + push : Vercel rebuild automatiquement.

## Architecture rapide

```
src/
├── config.ts            # Constantes du site (URL, locales, liens sociaux)
├── content.config.ts    # Schéma Zod des Content Collections
├── content/blog/{fr,en}/  # Articles Markdown
├── i18n/ui.ts           # Helper t(locale, key) + utilitaires i18n
├── layouts/             # BaseLayout, BlogPostLayout
├── components/          # Header, Footer, ThemeToggle, LangSwitcher, PostList
├── pages/               # Routes FR (index.astro, blog/, rss.xml.ts)
└── pages/en/            # Routes EN (mêmes routes, préfixées par /en)
```

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

## TODO (post-V1)

- [ ] Créer un `public/og-image.png` (1200×630) pour les partages sociaux.
- [ ] Domaine personnalisé (configuration DNS dans Vercel).
- [ ] Optionnel : analytics (Plausible / Vercel), commentaires (giscus), formulaire de contact.
