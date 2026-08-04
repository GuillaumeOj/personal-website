---
title: "Tamagui vs React Native Paper : pourquoi j'ai changé de framework UI sur Fusily"
description: "Retour d'expérience sur le choix du framework UI sur Fusily : de Tamagui à React Native Paper, et pourquoi j'ai finalement séparé mobile et web."
pubDate: 2026-05-19
lang: fr
slug: tamagui-vs-react-native-paper-retour-experience-fusily
translationKey: tamagui-paper
cover: ../../../assets/blog/tamagui-paper/cover.jpg
tags: []
---

Choisir son framework UI en React Native, c'est un de ces choix qu'on fait en début de projet, un peu vite, et qu'on regrette parfois longtemps. Sur Fusily, j'ai fait ce chemin : Tamagui d'abord, React Native Paper ensuite. Voilà pourquoi.

## Tamagui, le framework qui promettait tout

Avant de démarrer le développement, j'ai fait ce que font la plupart des devs : éplucher des comparatifs, traîner sur quelques sub-reddits, lire des retours d'expérience. C'est là que Tamagui est apparu sur mon radar.

Le pitch était difficile à ignorer : un framework UI pensé pour fonctionner à la fois sur mobile (React Native / Expo) et sur le web, avec un compilateur statique censé booster les performances. Pour un projet solo ou une petite équipe, l'idée d'une seule base de composants pour tout couvrir, c'est évidemment tentant.

J'ai intégré Tamagui et commencé à construire.

## Quelques mois plus tard

Les problèmes sont arrivés progressivement, puis de manière de plus en plus fréquente.

D'abord, les mises à jour. Mettre à jour Tamagui n'était jamais anodin — chaque nouvelle version apportait son lot de régressions. Des composants que j'avais utilisés partout se retrouvaient dépréciés du jour au lendemain, parfois sans que le changelog soit vraiment explicite sur ce qu'il fallait faire. Je passais des après-midis entières à corriger des choses qui fonctionnaient très bien la semaine d'avant.

Il y avait aussi la question des dépendances. L'écosystème Tamagui est découpé en dizaines de packages qui doivent impérativement être à la même version entre eux. Le moindre écart — souvent introduit par une autre dépendance du projet — déclenchait des erreurs cryptiques difficiles à remonter. Sur un projet Expo, c'est une couche de complexité dont on se passerait bien.

Au bout d'un moment, j'ai fait le calcul : une part trop importante de mon temps allait à gérer la librairie plutôt qu'à construire le produit. Ce n'est pas viable.

## Le passage à React Native Paper

La migration vers **React Native Paper** n'a pas été instantanée, mais la différence s'est sentie assez vite.

React Native Paper, c'est une bibliothèque Material Design maintenue par Callstack — une équipe sérieuse, bien ancrée dans l'écosystème React Native. Ce qui change concrètement : les APIs bougent peu, les breaking changes sont rares et clairement documentés, la communauté est large. On met à jour, ça marche.

Sur le papier, j'abandonnais le cross-platform intégré. En pratique, c'était une fausse contrainte : vouloir couvrir mobile et web avec le même framework, au stade de maturité où en était Tamagui, me coûtait plus que ça ne m'apportait.

|  | Tamagui | React Native Paper |
| --- | --- | --- |
| Maturité | Encore jeune | Solide |
| Breaking changes | Fréquents | Rares, bien documentés |
| Cross-platform | Mobile + Web | Mobile |
| Gestion des deps | Contraignante | Simple |
| Documentation | Inégale | Complète |

## Ce que j'utilise aujourd'hui

Plutôt que de chercher un outil unique qui couvre tout, j'ai tranché pour le bon outil à chaque endroit :

- **Mobile** : React Native + Expo + React Native Paper
- **Web** : Next.js + Tailwind CSS

C'est peut-être moins élégant dans l'idée, mais c'est bien plus agréable à maintenir. Chaque partie de la stack est stable, documentée, et je n'ai plus à gérer d'incompatibilités entre les deux.

## Ce que j'aurais fait différemment

Avec le recul, quelques réflexes que j'aurais aimé avoir plus tôt :

**Regarder l'historique des releases avant de s'engager.** La fréquence et la nature des breaking changes en disent long sur la maturité réelle d'une librairie, au-delà du README soigné.

**Se méfier des promesses cross-platform.** Couvrir mobile et web depuis une seule base de composants, c'est un objectif légitime — mais les solutions qui l'affichent comme acquis ne sont pas toutes au même stade. Ça vaut la peine de creuser.

**Tester sur un vrai cas d'usage.** Pas un hello world, mais quelques écrans proches de ce qu'on va vraiment construire. Les frictions de développement se révèlent vite.

**Voir qui est derrière.** Une librairie portée par une équipe identifiée et active dans l'écosystème (Callstack, Software Mansion, Expo…) donne plus de garanties qu'un projet maintenu au fil de l'eau.

La meilleure lib UI, c'est celle qui s'efface. Celle dont on n'entend plus parler parce qu'elle fait simplement son travail.
