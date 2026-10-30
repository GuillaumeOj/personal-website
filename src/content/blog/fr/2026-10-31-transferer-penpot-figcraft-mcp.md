---
title: "De Penpot à FigCraft : migrer 100 écrans avec Claude Code et les MCP"
description: "Figma, Penpot puis FigCraft : pourquoi j'ai changé d'outil de design, comment installer FigCraft et son MCP, et comment Claude Code a migré 100 écrans sans les faire transiter par la conversation."
seoTitle: "Transférer un design de Penpot à FigCraft avec les MCP"
seoDescription: "Migrer 9 pages, 100 écrans et 49 composants de Penpot vers FigCraft avec Claude Code : installation du MCP, méthode, pièges et prompt prêt à l'emploi."
pubDate: 2026-10-31
lang: fr
slug: transferer-design-penpot-figcraft-mcp
translationKey: penpot-to-figcraft
cover: ../../../assets/blog/penpot-figcraft/cover.jpg
coverCredit:
  author: Salah Ait Mokhtar
  authorUrl: https://unsplash.com/@motosha
  url: https://unsplash.com/photos/a-laptop-computer-sitting-on-top-of-a-wooden-desk--Px5V6LDxCo
tags: ["Penpot", "FigCraft", "MCP", "Claude", "Design"]
---

## Pourquoi changer d'outil de design ?

J'ai déjà raconté [comment j'ai ouvert Figma pour la première fois avec Claude](/blog/developpeur-backend-figma-claude/). Depuis, mon outil de design a changé deux fois. Ce parcours explique pourquoi j'ai dû déplacer un fichier de 100 écrans d'un outil à l'autre.

### Figma : un MCP trop limité

Je suis parti de Figma, comme beaucoup. Mais mon quotidien, c'est de travailler avec Claude, et pour que l'IA soit vraiment utile, il faut qu'elle puisse **lire et écrire dans l'outil** : c'est le rôle d'un serveur MCP.

Le [serveur MCP de Figma](https://developers.figma.com/docs/figma-mcp-server/) existe, mais ses quotas d'appels sont serrés, **même avec un plan payant** :

| Siège | Starter | Professional | Organization | Enterprise |
| --- | --- | --- | --- | --- |
| View, Collab | 20 par mois | 20 par mois | 20 par mois | 20 par mois |
| Full, Dev | — | 200 par jour, 10 par minute | 200 par jour, 15 par minute | 600 par jour, 20 par minute |

Quand un agent enchaîne les appels pour construire des écrans, ces plafonds sont vite atteints.

### Penpot : un excellent logiciel open source

Je me suis tourné vers [Penpot](https://penpot.app/), et je n'ai pas été déçu. C'est un excellent logiciel **open source**, complet, et surtout avec de vraies fonctionnalités MCP : on peut lire un fichier, exécuter du code via son API de plugins, créer des composants… Exactement ce qu'il me fallait.

### Mais Penpot est lent à l'affichage

Le revers de la médaille : sur de gros fichiers, **le rendu de Penpot est lent**. C'est un problème connu de l'équipe, qui travaille sur [un nouveau système de rendu](https://penpot.app/blog/penpots-new-rendering-system/), mais au moment où j'écris ces lignes, il ne résout pas mon cas. Avec des dizaines d'écrans en clair et en sombre, ça devient pénible à l'usage.

### FigCraft : plus rapide et plus sobre

C'est là que j'ai découvert [FigCraft](https://github.com/storytold/figcraft), une nouveauté signée par l'équipe d'[ArtCraft](https://getartcraft.com), à qui l'on doit aussi [PhotoCraft](https://getartcraft.com/apps/photocraft) et [DesignCraft](https://getartcraft.com/apps/designcraft). Son **moteur de rendu est plus efficace et bien moins gourmand** : le même fichier reste fluide là où Penpot rame. Et il expose lui aussi un serveur MCP.

Seul hic : mon design vivait déjà dans Penpot. D'où cet article.

## Installer FigCraft et son MCP

L'installation reste simple, mais il y a un piège : pour ouvrir le port de pilotage, il faut lancer l'application **depuis le binaire issu de la compilation Rust, pas depuis le `.app`**. Voici l'ordre qui a fonctionné pour moi, à partir d'un clone du [dépôt](https://github.com/storytold/figcraft) placé sur le tag de la dernière version.

1. **Compiler le CLI**, qui fait office de serveur MCP :

   ```bash
   cargo build --release -p figcraft-cli
   ```

2. **Ajouter les deux serveurs MCP à Claude Code**, comme indiqué dans la [documentation MCP](https://github.com/storytold/figcraft/blob/main/docs/mcp.md) du projet (adaptez le chemin vers le CLI compilé) :

   ```bash
   claude mcp add figcraft -- /chemin/vers/target/release/figcraft-cli mcp
   claude mcp add figcraft-app -- /chemin/vers/target/release/figcraft-cli mcp --attach 7979
   ```

3. **Compiler et lancer l'application avec le port de pilotage ouvert** :

   ```bash
   cargo run --release -p figcraft -- --control 7979
   ```

   L'option `--control 7979` ouvre le port de pilotage : sans elle, le serveur MCP ne peut pas contrôler l'application.

Une fois cela fait, Claude Code voit deux serveurs FigCraft : `figcraft` travaille **en mode headless** (sans fenêtre, sur un document en mémoire), `figcraft-app` **pilote l'application ouverte** sur `127.0.0.1:7979`. J'ai aussi gardé `penpot` branché pour lire la source.

## Le problème : 100 écrans à déplacer

Mon fichier Penpot contenait :

- 9 pages ;
- environ 100 écrans, en clair et en sombre ;
- 49 composants ;
- des jetons de couleur et d'espacement.

L'objectif : un fichier FigCraft où les composants sont de **vrais composants**, où les écrans les **référencent**, et où clair et sombre partagent **un seul jeu de variables**.

## Pourquoi éviter de tout faire passer par la conversation

Le réflexe naturel est d'utiliser les deux MCP comme un tuyau : l'agent lit une page dans Penpot, puis réécrit la même structure dans FigCraft avec des commandes par lot.

L'obstacle, c'est le volume. Un écran pèse environ 30 Ko : l'agent les lit dans Penpot, puis les renvoie à FigCraft sous forme de commandes, soit environ 60 Ko de contexte par écran. Sur 100 écrans, cela représente environ 6 Mo, bien plus que ce qu'une fenêtre de contexte peut contenir, et chaque octet est payé deux fois en tokens.

Pour les petits volumes, cette approche convient très bien. Les fondations (pages, variables, 49 composants, une page de présentation) sont légères : Claude Code les a recréées directement avec les outils MCP, composants compris.

## La solution : garder les données hors de la conversation

Le principe : ne faire transiter par l'agent que des scripts et des chemins de fichiers, jamais les données elles-mêmes. Deux faits rendent cela possible :

1. **L'API de plugins de Penpot exécute votre JavaScript et renvoie le résultat.** Quand ce résultat est trop gros pour le modèle, l'outil l'écrit dans un fichier sur le disque et ne renvoie qu'un court message. Un script peut donc extraire une page entière sans que l'agent la lise.
2. **FigCraft sait importer un fichier JSON au format de l'API REST de Figma** (pages, composants, instances, auto-layout, vecteurs, liaisons de variables et modes) via la commande `file.import`.

Le pipeline tient en quatre étapes.

### 1. Exporter depuis Penpot

Un appel `execute_code` par page sérialise toutes les formes en un arbre compact : position absolue, taille, remplissages et contours, rayons, ombres, propriétés de texte, tracés, layout flex et dimensionnement des enfants. Chaque résultat est écrit sur le disque par l'outil.

### 2. Convertir avec un script

Un convertisseur Python lit ces fichiers et produit un seul fichier au format REST. Il :

- transforme les formes en cadres, textes, vecteurs et groupes, avec auto-layout ;
- convertit les tracés en coordonnées locales au nœud ;
- repère, par leur nom et leur position, les 49 composants principaux de Penpot, déjà recréés dans FigCraft ;
- transforme chaque icône dessinée (`Icons / Tool / …`, `Icons / UI / …`) en **instance** du composant correspondant ;
- lie remplissages et contours aux variables de couleur Light/Dark en comparant la valeur hexadécimale, et applique le mode Dark à chaque board dont le nom se termine par `dark`.

### 3. Importer dans le fichier cible

`file.import` reçoit le fichier converti **avec le JSON des variables exporté depuis la cible**, pour que les liaisons se résolvent sur les variables existantes.

### 4. Vérifier et corriger

Comparez des captures d'écran de chaque page à la source Penpot, puis corrigez directement dans FigCraft (voir les pièges ci-dessous).

## Les pièges qui m'ont coûté du temps

- **La géométrie des contours.** Si l'on fournit à l'importeur à la fois la géométrie de remplissage et de contour pour un tracé qui n'a qu'un contour, il utilise le contour comme une forme remplie. Les icônes ressortent en taches noires. Ne fournissez que la géométrie de remplissage, et décrivez les contours comme de vrais contours (strokes).
- **La taille des instances.** L'importeur ignore la taille propre d'une instance et la géométrie de ses enfants : il reprend celles du composant principal. Les instances de taille différente (81 chez moi) doivent être redimensionnées après l'import. Pour les retrouver, les identifiants des nœuds importés suivent l'ordre du convertisseur : il suffit de connaître l'identifiant d'un seul nœud pour déduire tous les autres par décalage.
- **La mise à l'échelle.** Réglez les tracés de chaque composant sur la contrainte « Échelle », sinon les traits des instances redimensionnées se décalent ou se déforment.
- **La détection des composants.** Une même icône apparaît à la fois comme simple dessin dans les cartes de présentation et comme composant principal. Associez nom **et** position, ne retenez que la première occurrence et ignorez les occurrences imbriquées.
- **Les réimports s'ajoutent.** Chaque correction du convertisseur impose de réimporter, ce qui coûte peu une fois le pipeline en place. Mais un réimport s'ajoute à l'existant au lieu de le remplacer : supprimez à chaque fois les pages de l'import précédent.
- **Les grosses sorties d'outils.** Lister toutes les variables ou tous les composants dans la conversation gaspille du contexte. Préférez des scripts qui écrivent sur le disque.

## Ce qui reste à faire

Dans le fichier Penpot d'origine, les écrans n'utilisaient pas d'instances : seules les icônes ont pu être converties. Boutons, étiquettes et lignes de liste restent des cadres ordinaires. Détecter les motifs répétés pour les remplacer par des instances est une passe à part. Les styles de texte, les liaisons de jetons d'espacement et de rayon, ainsi que le texte à styles mixtes, ont aussi été laissés de côté.

## Comment demander ça à Claude Code

Voici mon prompt, réécrit avec ce que j'ai appris, pour que l'agent prenne tout de suite la route efficace. Remplacez les éléments entre chevrons par vos propres chemins et noms.

> J'ai créé `<chemin>/<MonProjet>.figcraft`. Transfère tout le design de mon fichier Penpot dedans, avec les serveurs MCP `penpot`, `figcraft` et `figcraft-app`.
>
> **Exigences**
> - Garde les noms de pages de Penpot.
> - Recrée les composants comme de vrais composants, et fais en sorte que les écrans les référencent comme instances partout où un dessin correspond à un composant.
> - Recrée les jetons Light/Dark comme variables FigCraft et relie les couleurs à ces variables. Les cadres issus des boards sombres utilisent le mode Dark.
>
> **Méthode (ne fais pas transiter de gros volumes de données par la conversation)**
> 1. Crée d'abord les variables, la structure vide et les composants (c'est léger).
> 2. Extrais chaque page Penpot avec un seul appel `execute_code` qui renvoie un arbre JSON compact. Quand le résultat est trop gros, l'outil l'enregistre sur le disque. Travaille uniquement à partir de ces fichiers.
> 3. Écris un convertisseur Python qui produit un JSON au format REST de Figma avec instances des composants existants, auto-layout, géométrie de remplissage des vecteurs (pas de géométrie de contour) et liaisons de variables. Importe-le avec `file.import` en passant le JSON des variables exporté.
> 4. Après l'import, corrige ce que l'importeur ignore (par exemple la taille des instances), puis supprime les pages de tout import précédent.
> 5. Vérifie par captures d'écran face à Penpot, puis enregistre.
>
> À la fin, dis-moi ce qui reste à faire, y compris ce que tu n'as pas pu vérifier.

Deux détails de ce prompt comptent beaucoup. La section « Méthode » évite à l'agent de redécouvrir, à grands frais de contexte, qu'il ne faut pas faire passer 60 Ko par écran dans la conversation. Et la dernière phrase l'oblige à rendre compte honnêtement de ce qu'il n'a pas pu contrôler : sur une migration de cette taille, c'est ce qui sépare un fichier « terminé » d'un fichier qu'on peut réellement utiliser.

## Ce que j'en retiens

Le transfert fonctionne, mais le vrai gain ne tient pas à l'outil choisi : c'est de comprendre **où passent les données**. Tant que l'agent sert de tuyau, on paie chaque octet deux fois en contexte. Dès qu'on lui fait écrire un script qui lit et écrit sur le disque, la migration de 100 écrans se ramène à un script et quelques corrections, et un bug du convertisseur se corrige en relançant l'import.

C'est le même réflexe qu'en développement : ne pas faire à la main, ni à travers un LLM, ce qu'un script fait mieux.
