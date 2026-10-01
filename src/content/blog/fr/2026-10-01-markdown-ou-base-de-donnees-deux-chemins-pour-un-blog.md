---
title: "Markdown ou base de données : deux chemins pour un blog"
description: "Fichiers Markdown versionnés dans Git ou base de données avec back-office : retour d'expérience sur deux blogs que j'ai réalisés, et pourquoi le bon choix dépend avant tout de la personne qui écrit."
seoDescription: "Markdown versionné dans Git ou base de données avec back-office : retour sur deux blogs, et pourquoi tout dépend de la personne qui écrit."
pubDate: 2026-10-01
lang: fr
slug: markdown-ou-base-de-donnees-deux-chemins-pour-un-blog
translationKey: blog-two-paths
cover: ../../../assets/blog/blog-two-paths/cover.jpg
coverCredit:
  author: Jens Lelie
  authorUrl: https://unsplash.com/@madebyjens
  url: https://unsplash.com/photos/u0vgcIOQG08
tags: ["Blog", "Markdown", "Django", "Notion", "MCP"]
---

« Quelle est la meilleure solution pour faire un blog ? » On me pose régulièrement la question, et je n'ai jamais de réponse toute faite. Non pas parce que les outils manquent, mais parce que la question est mal posée. La bonne question, c'est plutôt : **qui va écrire, et avec quel outil cette personne est-elle à l'aise ?**

Cette année, j'ai réalisé deux blogs qui illustrent bien ce point. Le mien, celui que vous lisez, et l'espace de publications du [site de Maître Eva Biezunski](/projects/eva-biezunski-avocate/), avocate en droit des sociétés. Deux besoins proches en apparence (publier des articles), deux profils d'auteurs opposés, et au final deux architectures qui n'ont presque rien en commun.

## WordPress, le réflexe que j'ai abandonné

Pendant longtemps, la réponse par défaut à « il me faut un blog » était WordPress. Je l'ai utilisé par le passé, et je comprends son succès : l'éditeur est accessible, l'écosystème immense, et on trouve un hébergeur à chaque coin de rue.

Mais à l'usage, plusieurs choses m'ont lassé :

- **Le monolithe** : l'éditeur, le rendu des pages, l'administration et la base de données vivent dans la même application. Difficile de faire évoluer l'un sans toucher aux autres.
- **L'« obligation » des extensions** : référencement, cache, formulaires, sécurité, sauvegardes… Presque chaque besoin courant passe par une extension, plus ou moins bien maintenue, qu'il faut mettre à jour en croisant les doigts pour qu'elle reste compatible avec les autres.
- **La lenteur** : à force d'empiler les extensions, les pages s'alourdissent, et il faut ajouter… une extension de cache pour compenser.
- **La surface d'attaque** : parce qu'il est omniprésent, WordPress est une cible permanente, et ce sont souvent les extensions qui ouvrent la brèche. Le laisser sans surveillance quelques mois est exclu.

Pour un blog personnel comme pour un site client, je cherchais quelque chose de plus léger, de plus maîtrisé, et qui ne m'oblige pas à jouer les administrateurs système.

## Notion comme CMS : séduisant sur le papier

Pour la version précédente de mon blog, j'avais fait de Notion à la fois l'éditeur et la base de données. J'ai détaillé cette architecture dans [un article précédent](/blog/comment-jai-construit-mon-blog-nextjs-astro-notion-vercel/) : chaque article était une page d'une base Notion, avec ses propriétés (titre, slug, langue, date…), et un webhook prévenait Vercel à chaque modification pour reconstruire le site.

L'idée était belle : un éditeur agréable, que j'utilise déjà au quotidien, et un site statique rapide en sortie. En pratique, trois problèmes sont apparus.

**Des webhooks fragiles.** Dans mon cas, les webhooks Notion se sont révélés fragiles : après certaines évolutions de la plateforme, les appels vers mon endpoint échouaient, et après plusieurs échecs, Notion mettait le webhook en pause. Résultat : je publiais un article, rien ne se passait, et je ne m'en rendais compte qu'en allant vérifier le site.

**Des modifications invisibles.** Tous les champs ne déclenchaient pas d'événement. Changer la couverture d'un article, par exemple, ne prévenait personne : le site gardait l'ancienne image jusqu'à la prochaine modification « détectée ».

**Trop de déploiements.** À l'inverse, dans mon cas, chaque modification détectée envoyait son propre événement. Corriger le titre, puis la description, puis le texte : trois événements, donc trois déploiements pour une seule mise à jour. On peut regrouper les événements, attendre quelques minutes avant de lancer un build… mais je me retrouvais à bricoler une plomberie de plus en plus complexe pour un simple blog.

La leçon que j'en ai tirée : en faisant d'un outil tiers le cœur de mon système de publication, je dépendais d'une API dont je ne maîtrisais ni le comportement ni le calendrier d'évolution. Pour un outil qui doit simplement fonctionner, c'était beaucoup d'incertitude.

## Chemin 1 : des fichiers Markdown, pour qui vit dans Git

Pour mon blog, la réponse a fini par être la plus simple possible : **des fichiers Markdown, versionnés dans le dépôt du site**. Le site tourne désormais sur Astro seul, et chaque article existe en deux fichiers `.md`, un par langue, rangés dans `src/content/blog/fr/` et `src/content/blog/en/`.

L'en-tête de chaque fichier (le *frontmatter*) porte les métadonnées de l'article. En voici un extrait :

```yaml
---
title: "Markdown ou base de données : deux chemins pour un blog"
pubDate: 2026-10-01
lang: fr
slug: markdown-ou-base-de-donnees-deux-chemins-pour-un-blog
translationKey: blog-two-paths
cover: ../../../assets/blog/blog-two-paths/cover.jpg
tags: ["Blog", "Markdown", "Django", "Notion", "MCP"]
# … description, crédit de la couverture, etc.
---
```

La version française et la version anglaise partagent la même `translationKey` : c'est elle qui relie les deux traductions, alimente le sélecteur de langue et les balises `hreflang`. Le schéma de ces métadonnées est validé au build par Astro : un champ manquant ou mal formé, et le site ne se construit pas.

Le cycle de publication tient en quelques étapes :

1. Je crée une branche et j'écris l'article dans mon éditeur.
2. J'ouvre une pull request : Vercel génère un déploiement de prévisualisation, et l'intégration continue lance les tests.
3. Je relis l'article en conditions réelles sur l'URL de prévisualisation.
4. Je fusionne dans `main` : l'article part en production.

Ce que j'y gagne :

- **Un historique complet** : chaque modification est un commit, que je peux comparer ou annuler.
- **Une relecture intégrée** : la pull request est l'endroit idéal pour commenter et corriger avant publication.
- **Aucun backend pour le blog** : pas de base de données, pas d'interface d'administration à sécuriser. Les articles sont des pages entièrement statiques.
- **Du contenu testé** : des tests vérifient par exemple que chaque article existe dans les deux langues, que les deux versions partagent la même couverture, ou que titres et descriptions tiennent dans les résultats de recherche.
- **Un retour arrière immédiat**, puisque chaque déploiement est conservé sur Vercel.

Mais cette simplicité a un prérequis évident : **être à l'aise avec Git, un éditeur de code, la syntaxe Markdown et le principe d'une pull request**. Pour un développeur, c'est le quotidien. Pour la plupart des gens, c'est un vrai obstacle. Et même entre développeurs, gérer plusieurs auteurs réguliers sur ce modèle demande une certaine discipline.

## Chemin 2 : une base de données et un back-office, pour qui veut simplement écrire

Le besoin de Maître Biezunski était tout autre. Elle voulait publier des articles sur son site professionnel, sans jamais avoir à penser au code : un éditeur visuel, un bouton « publier », et c'est tout. Lui demander d'ouvrir une pull request n'avait aucun sens.

J'ai donc développé un backend complet, avec **Django et Django REST Framework**, et une base **PostgreSQL** hébergée sur Neon. Ici, les articles vivent en base de données plutôt que dans des fichiers, et le site Next.js les récupère via l'API.

Côté rédaction, tout se passe dans une interface d'administration privée, conçue pour être plus simple à prendre en main que l'admin Django :

- **Un éditeur inspiré de Notion** : on écrit et on met en forme directement, sans connaître la syntaxe Markdown. En coulisses, le Markdown reste la source de vérité, rendu et nettoyé côté serveur.
- **Des brouillons et la publication programmée** : un article reste en brouillon tant qu'il n'est pas publié, et une date de publication future permet de le programmer.
- **Des images traitées automatiquement** : les images importées sont remises dans le bon sens, débarrassées de leurs métadonnées et converties en WebP.
- **Des catégories** qui servent de filtres sur la page des publications.
- **Trois rôles** (administrateur, éditeur, auteur) qui encadrent qui peut faire quoi. Le jour où le cabinet accueille un collaborateur qui souhaite écrire, il suffit de lui créer un compte.

Autre différence de taille : publier un article ne déclenche aucun déploiement. Le contenu est servi depuis la base, et l'article apparaît dès qu'il est publié, ou à la date programmée.

### Écrire depuis un assistant IA

J'ai ajouté une brique que je n'aurais pas imaginée il y a encore deux ans : **un endpoint `/mcp`**. Il expose le blog via le Model Context Protocol, ce qui permet de gérer les articles depuis n'importe quel assistant IA compatible, comme Claude Desktop. Lister, créer, modifier, publier ou dépublier un article se fait en conversation.

Deux garde-fous encadrent cet usage : un article créé depuis une conversation est un **brouillon par défaut**, et chaque action respecte le **rôle du propriétaire du jeton**. Un auteur ne peut pas, via l'IA, faire plus que ce qu'il pourrait faire dans l'interface.

### Le prix de ce confort

Cette solution a évidemment un coût : un backend à héberger, une base de données à sauvegarder, une interface d'administration à sécuriser, des dépendances à mettre à jour. Là où mon blog n'a besoin de rien d'autre qu'un hébergement statique, celui-ci est une application à part entière. Pour que ces mises à jour restent sereines, j'ai misé sur des garde-fous automatisés : les types TypeScript du frontend sont générés à partir du schéma OpenAPI de l'API, et un test échoue si les deux divergent ; côté backend, la suite de tests échoue sous 90 % de couverture.

## Deux chemins, côte à côte

| | Fichiers Markdown + Git | Base de données + back-office |
|---|---|---|
| **Pour qui** | Développeur à l'aise avec Git et le code | Toute personne qui veut écrire sans se soucier de la technique |
| **Édition** | Éditeur de code, syntaxe Markdown | Éditeur visuel dans le navigateur |
| **Publication** | Pull request fusionnée dans `main` | Bouton « publier » ou date programmée |
| **Plusieurs auteurs** | Possible, mais demande de la rigueur | Prévu, avec des rôles |
| **Infrastructure** | Pages statiques, aucun backend dédié | API, base de données, stockage des images |
| **Maintenance** | Faible | Réelle : mises à jour, sauvegardes, sécurité |
| **Historique** | Natif, grâce à Git | À développer si on en a besoin |

## Comment choisir ?

Avant de parler technologie, je pose désormais quelques questions :

- **Qui va écrire ?** Si la réponse est « moi, et je suis développeur », difficile de faire plus simple que des fichiers Markdown. Si c'est quelqu'un qui ne veut pas entendre parler de Git, il faut une interface.
- **Combien d'auteurs, aujourd'hui et demain ?** Un seul auteur s'accommode de presque tout. Plusieurs auteurs avec des droits différents appellent une gestion des rôles.
- **À quel rythme ?** Pour quelques articles par an, une personne non technique peut confier ses textes à quelqu'un qui les publie ; dès que la publication devient régulière, un back-office s'impose.
- **Qui va maintenir le système ?** Un backend se maintient. Si personne n'est prévu pour s'en charger, mieux vaut se tourner vers une plateforme hébergée, où la maintenance est assurée par d'autres.

Rien n'est figé pour autant. Un blog peut commencer en Markdown et migrer vers une base de données le jour où de nouveaux auteurs arrivent. Le contenu étant du Markdown dans les deux cas, on passe de l'un à l'autre sans rien réécrire.

## En bref

Mon blog et l'espace de publications de Maître Biezunski répondent au même besoin (publier des articles) avec deux architectures opposées. Ni l'une ni l'autre n'est « la bonne » dans l'absolu : chacune est adaptée à la personne qui écrit. C'est finalement le principe qui guide tous mes projets : l'outil doit s'adapter à son utilisateur, pas l'inverse.

Vous avez un blog ou un espace de publications à mettre en place ? [Parlons-en](/contact/).
