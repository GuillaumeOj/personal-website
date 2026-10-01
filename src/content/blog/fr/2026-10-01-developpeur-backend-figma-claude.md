---
title: "Développeur backend, j'ai enfin ouvert Figma (et Claude m'a tenu la main)"
description: "Pendant des années, Figma a été pour moi l'outil des autres. Retour d'expérience d'un développeur Django : 14 écrans en une journée avec Claude Desktop, et un Figma à reconstruire pour Fusily."
seoTitle: "Développeur backend : j'ai enfin ouvert Figma, avec Claude"
seoDescription: "Un développeur Django face à Figma : 14 écrans en une journée avec Claude Desktop, des composants pensés comme du code, et un Figma à reconstruire pour Fusily."
pubDate: 2026-10-01
lang: fr
slug: developpeur-backend-figma-claude
translationKey: figma-backend-dev
cover: ../../../assets/blog/figma-backend-dev/cover.jpg
coverCredit:
  author: Kelly Sikkema
  authorUrl: https://unsplash.com/@kellysikkema
  url: https://unsplash.com/photos/v9FQR4tbIq8
tags: ["Figma", "Design", "Claude", "Fusily"]
---

## Soyons honnêtes

Je suis développeur backend, spécialisé Django. Mon terrain de jeu, ce sont les modèles de données, les API, les requêtes SQL et tout ce qui se passe une fois que l'utilisateur a cliqué. Ce sur quoi il clique, en revanche, n'a jamais vraiment été mon affaire.

Dans les équipes que j'ai côtoyées, l'interface était la responsabilité des designers UI et des développeurs frontend. Les maquettes arrivaient dans Figma, propres et réfléchies, et mon travail commençait là où le leur s'arrêtait. Une division des rôles confortable, qui m'a permis de n'ouvrir l'outil qu'en lecture seule.

Puis j'ai lancé Fusily, et ce confort a disparu.

## Les débuts de Fusily : seul face à l'interface

Fusily, c'est une application mobile de recettes et de planification de repas, que je construis en grande partie seul. Au démarrage du projet, je n'avais ni designer ni développeur frontend sous la main. Seulement moi, une idée assez précise du produit, et une incapacité tout aussi précise à la mettre en images.

Pour le « starter pack », j'ai fait appel à deux freelances :

- le premier pour l'**identité de marque** : le logo, les typographies, les couleurs ;
- le second pour le **design des premiers écrans principaux** de l'application, histoire de ne pas partir d'une page blanche.

De cette collaboration est né un fichier Figma d'une vingtaine d'écrans : la connexion, le fil de recettes, la création d'une recette, la recherche, le détail d'une recette, le mode préparation pas à pas, le planning de la semaine, la liste de courses…

![Trois écrans du fichier Figma d'origine de Fusily : le fil de recettes, le planning de la semaine et une étape du mode préparation](../../../assets/blog/figma-backend-dev/fusily-figma-2025.jpg)

Un tel fichier est un outil de travail précieux. On visualise à quoi pourrait ressembler l'application, on enchaîne les écrans, on vérifie que le parcours tient debout, et tout ça **avant d'avoir écrit la moindre ligne de code**. Pour un développeur, c'est un luxe : chaque incohérence repérée dans une maquette, c'est une refonte en moins dans le code.

## Un fichier Figma resté figé

Sauf que ce fichier n'a pas suivi l'application, qui, elle, a beaucoup bougé. J'ai [changé de framework UI en cours de route](/blog/tamagui-vs-react-native-paper-retour-experience-fusily/), des écrans sont apparus, d'autres ont été repensés à l'usage, des fonctionnalités entières sont nées directement dans le code. Pendant ce temps, le fichier est resté dans son état de départ, comme une photo de famille qu'on ne met jamais à jour.

Je pourrais citer tout un tas de bonnes (ou de très mauvaises) raisons pour justifier cet abandon : le manque de temps, la priorité donnée aux fonctionnalités, le fait d'aller plus vite en codant directement, l'absence de designer avec qui échanger…

Mais en réalité, tout cela se résume à une seule raison : **je ne savais pas utiliser Figma, et je n'avais pas pris le temps de m'y intéresser.**

Les cadres, les contraintes, l'auto-layout, les composants, les variantes, le mode prototype : vu de l'extérieur, Figma ressemble à un cockpit d'avion. Et quand on est seul sur un produit, avec mille autres choses à faire, il est tentant de laisser le cockpit à d'autres.

## Un projet e-commerce et une journée avec Claude Desktop

Récemment, pour un projet potentiel dans l'e-commerce, je me suis attelé à la tâche : produire des écrans dans Figma, pour qu'ils servent de base de travail et de discussion avec le client. Montrer plutôt que décrire, en somme.

Pour être tout à fait honnête, je n'ai pas pris le temps d'enchaîner les tutoriels pour tout faire moi-même. Je me suis appuyé sur mon meilleur compagnon de travail du moment : **Claude Desktop**, connecté à Figma.

Le résultat m'a surpris. **En une journée, j'ai produit 14 écrans**, reliés entre eux en une maquette dynamique que je peux présenter comme si le site existait déjà : on clique, on passe d'une page à l'autre, on suit le parcours. Le futur client ne regarde plus une série d'images : il essaie le produit.

J'avoue que j'ai été un peu grisé par l'expérience. Passer de « je n'ose pas ouvrir Figma » à « voilà le parcours complet, on en discute ? » si vite, ça fait quelque chose.

## Penser composants : le réflexe du développeur

Ce qui m'a le plus servi, finalement, c'est mon expérience de développeur.

Figma s'appuie sur un principe que tout développeur connaît par cœur : le **composant**. Un bouton, une carte produit, un champ de formulaire, un en-tête : on le définit une fois, on le décline en variantes (principal, secondaire, désactivé…), et on le réutilise partout. Modifier le composant principal met à jour toutes ses instances, sauf les propriétés modifiées localement. C'est la même logique qu'un composant React, ou qu'un template Django qu'on inclut dans plusieurs pages : les variantes jouent le rôle des props.

J'ai donc porté une attention toute particulière à ce point. Plutôt que de laisser chaque écran vivre sa vie, j'ai demandé à Claude de **standardiser au maximum les éléments de la maquette** : des composants pour tout ce qui se répète, des variantes plutôt que des copies légèrement modifiées, des couleurs et des espacements cohérents d'un écran à l'autre.

J'y voyais deux intérêts :

- **la maquette reste cohérente** : un même élément a le même aspect partout ;
- **l'implémentation sera plus simple** : chaque composant Figma a vocation à devenir un composant dans le code. Le jour où il faudra développer, la liste des briques à construire sera déjà là.

Claude connaît les manipulations de l'outil bien mieux que moi, et les exécute vite. Mais la structure, c'est moi qui la décide : ce qui mérite d'être un composant, quelles variantes prévoir, comment découper un écran. Exactement comme dans un projet de code où l'IA écrit, mais où l'architecture reste une affaire de jugement.

## Je ne suis pas designer

Je ne me considère pas comme un spécialiste du design. Le design est un métier, qui demande une formation spécifique et une appétence particulière pour des sujets (la typographie, la composition, la hiérarchie visuelle, la recherche utilisateur…) que je n'ai pas.

Claude ne m'a pas rendu designer, de la même manière que [l'IA ne fait pas de vous un développeur](/blog/non-ia-ne-fait-pas-de-vous-un-developpeur/). Il m'a fait gagner un temps considérable sur la prise en main de l'outil, et a levé la barrière d'entrée qui me tenait à distance. Mais les choix qui comptent ont été les miens, et sur un projet ambitieux, l'œil d'un vrai designer reste irremplaçable.

## Ce que j'apporte

En revanche, j'apporte autre chose.

J'ai l'œil d'un créateur d'applications : je sais ce qui sera simple ou pénible à développer, ce qui tiendra à l'usage, ce qui manque à un parcours pour qu'il fonctionne de bout en bout. Je tiens à offrir la meilleure expérience utilisateur possible : Fusily m'a appris que chaque détail compte quand on cuisine les mains dans la farine.

Maintenant que Figma ne me fait plus peur, c'est une nouvelle corde à mon arc. Une étape de plus sur le chemin de l'autonomie, pour mener des projets complets : de la maquette qu'on montre au client jusqu'à l'API qui tourne en production.

## Le chemin inverse : redonner un Figma à Fusily

Et puisque l'expérience a été concluante, je vais la pousser jusqu'au bout en faisant le chemin inverse pour Fusily.

L'idée : **recréer un fichier Figma complet à partir de l'état actuel de l'application**. Non plus la maquette de départ des freelances, mais le reflet fidèle de ce que les utilisateurs ont entre les mains aujourd'hui, avec la même rigueur sur les composants.

Ce fichier n'aura pas vocation à rester une photo de plus. Je veux l'intégrer à mon processus de travail : quand il faudra faire évoluer un écran ou ajouter une fonctionnalité, je passerai d'abord par Figma pour poser le parcours, le valider, en discuter, avant d'ouvrir l'éditeur de code. Le même luxe qu'au tout début du projet, mais cette fois sans dépendre de quelqu'un d'autre pour le tenir à jour.

Le fichier d'origine a fini par prendre la poussière parce que je ne savais pas m'en servir. Ce ne sera plus une excuse.
