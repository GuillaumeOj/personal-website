---
title: "Comment j'ai construit mon blog personnel : Next.js, Astro, Notion et Vercel"
description: "Retour détaillé sur les choix techniques de mon blog personnel : une stack Next.js + Astro avec Notion comme CMS headless bilingue, un pipeline de déploiement automatisé via Vercel et la gestion des images avec Vercel Blob."
pubDate: 2026-05-20
lang: fr
slug: comment-jai-construit-mon-blog-nextjs-astro-notion-vercel
translationKey: blog-stack
cover: ../../../assets/blog/blog-stack/cover.jpg
tags: []
---

Mon blog personnel est le projet technique que je reprends et améliore régulièrement. C'est aussi un terrain d'expérimentation idéal pour tester des stacks, des outils et des architectures. Voici un retour détaillé sur les choix techniques que j'ai faits et comment tout s'articule.

## La stack : pourquoi Next.js *et* Astro ?

La première question que l'on me pose souvent c'est : pourquoi deux frameworks JavaScript ? La réponse tient à la nature même du projet.

**Astro** gère la partie blog au sens strict — les pages de listing, les articles, le layout éditorial. Astro est taillé pour ça : il génère du HTML statique par défaut, embarque très peu de JavaScript côté client, et son modèle de composants "islands" est parfait pour un site où 95% du contenu est purement statique. Les performances sont excellentes et le bundle est minimal.

**Next.js** prend en charge le reste du site — en l'occurrence une page unique de présentation et d'expériences professionnelles. Cette partie a des besoins différents du blog : interactions potentiellement plus riches et une flexibilité de rendu (SSR, ISR) que Next.js gère très bien, tout en laissant la porte ouverte à une évolution future du site.

Les deux coexistent dans le même dépôt avec un routing clair qui délimite les responsabilités de chacun. Ce n'est pas la stack la plus simple à bootstrapper, mais une fois en place, elle offre le meilleur des deux mondes : la légèreté d'Astro pour le contenu éditorial, la puissance de Next.js pour le reste.

## Notion comme CMS bilingue

Les articles sont écrits directement dans Notion, dans une base de données `Personal blog`. Chaque article est une page Notion avec un ensemble de propriétés structurées :

- **title** — le titre de l'article
- **slug** — l'identifiant URL de l'article
- **lang** — la langue (`fr` ou `en`)
- **translationKey** — une clé partagée entre la version française et la version anglaise pour lier les deux traductions
- **pubDate** — la date de publication
- **author** — l'auteur
- **related** — des articles liés
- **status** — `draft` ou `published`

Le contenu est rédigé en français et en anglais directement dans Notion. Chaque langue correspond à une page distincte dans la base de données, reliées par la `translationKey`. Cela permet au blog de proposer un sélecteur de langue et de naviguer entre les deux versions d'un même article.

Notion joue donc le rôle d'un vrai CMS headless : interface d'édition agréable, support du Markdown enrichi, gestion des images, collaboration possible. L'API Notion est interrogée au moment du build pour récupérer l'ensemble des articles publiés.

## Le pipeline de déploiement : de Notion à Vercel

La mécanique de publication repose sur un webhook. Quand un article est modifié ou publié dans Notion, un événement est déclenché et intercepté côté Vercel. Vercel lance alors un rebuild du site, qui va ré-interroger l'API Notion pour récupérer le contenu à jour et regénérer les pages statiques correspondantes.

Le flow complet ressemble à ceci :

```
┌─────────────────────────────┐
│    Modification dans Notion │
└─────────────┬───────────────┘
              ↓
┌─────────────────────────────┐
│  Webhook → endpoint Vercel  │
└─────────────┬───────────────┘
              ↓
┌─────────────────────────────┐
│  Vercel déclenche un build  │
└─────────────┬───────────────┘
              ↓
┌─────────────────────────────┐
│  Astro interroge l'API      │
│  Notion                     │
└─────────────┬───────────────┘
              ↓
┌─────────────────────────────┐
│  Génération statique des    │
│  pages d'articles           │
└─────────────┬───────────────┘
              ↓
┌─────────────────────────────┐
│  Déploiement sur le CDN     │
│  Vercel                     │
└─────────────────────────────┘
```

Ce pipeline garantit que le blog est toujours à jour sans nécessiter de déploiement manuel. Le rendu statique assure des temps de chargement très rapides et une résilience maximale : une fois les pages générées, elles ne dépendent plus de Notion pour être servies.

Le seul délai est celui du build — quelques dizaines de secondes en général — ce qui est tout à fait acceptable pour un blog personnel.

## Les images : Vercel Blob à la rescousse

L'intégration des images est l'un des points les plus délicats quand on utilise Notion comme CMS. Par défaut, les URLs des images dans Notion sont temporaires et expirables. Une image uploadée dans une page Notion génère une URL signée avec une durée de vie limitée. Au bout de quelques heures, cette URL n'est plus valide.

Pour un site statique généré au moment du build, c'est un problème majeur : les images affichées dans les articles pourraient devenir inaccessibles peu de temps après la génération du site.

La solution retenue est **Vercel Blob** : lors du build, les images référencées dans les articles Notion sont téléchargées et ré-hébergées dans Vercel Blob. Les URLs Blob sont stables et permanentes. Les pages générées pointent vers ces URLs Blob plutôt que vers les URLs temporaires de Notion.

Ce mécanisme garantit que les images restent accessibles indéfiniment, peu importe ce qui se passe du côté de Notion. C'est une couche de robustesse essentielle pour un site en production.

## Bilan

Cette stack n'est pas la plus simple à mettre en place, mais elle répond précisément aux besoins d'un blog personnel multilingue avec du contenu statique performant :

- **Notion** pour l'expérience d'édition et la gestion du contenu bilingue
- **Astro** pour la génération statique légère et rapide des articles
- **Next.js** pour les parties du site qui nécessitent plus de dynamisme
- **Vercel** pour l'hébergement, le CI/CD via webhooks, et le stockage des images avec Blob
- **Vercel Blob** pour pérenniser les images extraites de Notion

Le tout forme un système cohérent où chaque brique a un rôle clair. La publication d'un article depuis Notion jusqu'au blog en production est entièrement automatisée, et les performances restent au rendez-vous grâce au rendu statique.

Cette stack est encore récente et je n'ai pas suffisamment de recul pour en dresser un bilan définitif. Il est possible que certains choix évoluent après une utilisation prolongée — que ce soit sur la gestion des images, la séparation Next.js / Astro, ou l'intégration Notion. Je mettrai cet article à jour si c'est le cas.

C'est ce genre d'architecture "composée" qui me plaît en développement backend comme en frontend : choisir le bon outil pour chaque problème plutôt que de tout faire reposer sur un seul.
