---
title: "Dotcraft : créer un générateur de QR codes open source en quelques heures avec Claude Code"
description: "Retour d'expérience sur la création de Dotcraft, un éditeur de QR codes stylés open source, privacy-first et construit en quelques heures avec Claude Code."
pubDate: 2026-06-13
lang: fr
slug: dotcraft-generateur-qr-codes-open-source-claude-code
translationKey: dotcraft
cover: ../../../assets/blog/dotcraft/cover.jpg
tags: []
---

J'avais juste besoin d'un QR code. Stylé, propre, avec mon logo au centre. Une demande banale — sauf que la chercher m'a rappelé à quel point le web regorge d'outils auxquels on n'a pas vraiment envie de confier quoi que ce soit. De cette frustration est né [Dotcraft](https://dotcraft.fr), un éditeur de QR codes que j'ai construit de A à Z, en open source, en quelques heures. Voici comment, et surtout pourquoi.

## Le problème avec les générateurs de QR codes en ligne

Si vous avez déjà cherché « QR code generator » sur Google, vous connaissez le tableau. Une dizaine de sites qui se ressemblent, couverts de publicités, qui vous promettent un QR code « gratuit »… avant de vous demander de créer un compte pour le télécharger, ou de glisser un abonnement entre vous et votre image.

Trois choses me dérangeaient en particulier :

D'abord, la confiance. Un QR code encode une URL, parfois une donnée plus sensible. Le générer sur un site obscur, c'est lui transmettre cette information sans savoir ce qu'il en fait. Pour un outil aussi simple, ça fait beaucoup de zones d'ombre.

Ensuite, l'obligation de créer un compte. Sur la plupart de ces services, dès qu'on veut conserver ses QR codes ou les retrouver plus tard, il faut s'inscrire. On échange ses données contre une fonctionnalité qui, techniquement, ne nécessite aucun serveur.

Enfin, le résultat. Beaucoup de générateurs crachent un QR code carré, brut, sans la moindre option de style. Or un QR code, c'est aussi un élément de design : il mérite des couleurs, des formes de modules cohérentes avec une identité, un logo bien intégré.

## Ce que fait Dotcraft

Dotcraft est un éditeur de QR codes stylés qui tourne entièrement dans le navigateur. On part d'une URL ou d'un texte, et on façonne le rendu :

Les **formes de modules** peuvent être carrées, arrondies, en cercles ou en points. Les **yeux** du QR code — les trois grands repères dans les angles — peuvent eux aussi être carrés, arrondis, circulaires, ou en goutte (droplet), une forme où chaque coin pointe vers le centre du code. On choisit les **couleurs** de premier plan et d'arrière-plan, on ajuste la marge, et on peut déposer un **logo** (PNG, JPG ou SVG) au centre, avec son fond, son padding et ses coins arrondis. Quand un logo est présent, la correction d'erreur passe automatiquement au niveau maximal pour que le code reste scannable.

À la fin, on exporte en **PNG** (512, 1024 ou 2048 px) ou en **SVG** autonome, prêt à intégrer partout.

## Le vrai parti pris : aucune donnée ne quitte le navigateur

C'est là que Dotcraft se distingue. Il n'y a pas de compte, pas de serveur, pas de base de données distante. Tout ce que vous créez est sauvegardé localement, dans le `localStorage` et l'`IndexedDB` de votre navigateur. Vos QR codes restent sur votre machine, point.

Ce choix répond directement aux frustrations de départ. On peut fermer l'onglet et retrouver ses créations plus tard, sans inscription. Rien n'est envoyé nulle part, donc rien n'est exploité. Et comme tout est calculé côté client — le QR code est généré à partir de sa matrice brute, puis dessiné en SVG directement dans la page — l'outil fonctionne même hors ligne une fois chargé.

Restait un défaut classique du stockage local : il est lié à un navigateur. Pour le contourner, Dotcraft permet d'**exporter ses données dans un fichier**, puis de les **réimporter** sur un autre navigateur ou une autre machine. On garde la simplicité du local, sans la prison du local.

J'ai aussi voulu que l'outil tienne la route quand on a beaucoup de QR codes à gérer. On peut donc les **organiser par projets et sous-dossiers**, comme on rangerait des fichiers — un projet par client, par campagne, peu importe. C'est le genre de confort qu'on ne trouve presque jamais dans les générateurs gratuits.

## Le making-of : de A à Z en quelques heures

Le détail qui me tient à cœur dans cette histoire, c'est la vitesse d'exécution. Dotcraft est passé de l'idée à un outil en ligne fonctionnel en quelques heures, en m'appuyant sur Claude Code.

La stack est volontairement légère : **Vite + React + TypeScript**, déployé sur Vercel comme site statique. Pas de backend à maintenir, pas de variables d'environnement, pas d'infrastructure.

En réalité, la toute première version de Dotcraft n'avait rien d'une application web : c'était un simple script Python en ligne de commande. Développeur backend Python, c'était mon réflexe naturel — et techniquement, ça marchait très bien. Le problème, c'est qu'un QR code est avant tout un objet **visuel**. Ajuster une couleur, tester une forme de module, déplacer un logo de quelques pixels… tout cela en éditant des arguments puis en relançant la commande pour aller ouvrir l'image générée, c'est d'une lenteur frustrante. Aussi puissant soit-il, un CLI n'est pas le bon support pour itérer sur du design : on a besoin de voir le résultat changer en temps réel.

C'est précisément ce qui a motivé le passage au web — et là, Claude Code a changé mon rapport au projet. Le front n'est pas mon terrain le plus naturel, et transformer ce script en véritable éditeur visuel aurait été un chantier que j'aurais sans doute repoussé indéfiniment. Pouvoir décrire ce que je voulais, itérer sur la géométrie des formes, déboguer un export SVG récalcitrant, le tout en conversation, m'a permis de rester concentré sur les décisions de produit plutôt que de m'enliser dans l'implémentation. Le passage du CLI Python à une vraie application web s'est fait en l'affaire d'un après-midi.

## Un projet open source de bout en bout

Au-delà de l'outil lui-même, Dotcraft m'a permis de mener un projet **open source de A à Z** : penser le produit, écrire le code, le documenter, le déployer, et le rendre public. Le dépôt est disponible sur [GitHub](https://github.com/GuillaumeOj/dotcraft) — le code est lisible, le README explique l'architecture, et n'importe qui peut s'en inspirer, le forker ou contribuer.

C'est aussi une manière de boucler la boucle avec ma frustration initiale. Plutôt qu'un énième générateur opaque, j'ai voulu un outil dont on peut littéralement vérifier qu'il ne fait rien dans votre dos. Le code est ouvert, le stockage est local, et il n'y a aucun compte à créer.

## En résumé

Dotcraft est né d'un besoin trivial et d'un agacement bien réel : générer un beau QR code sans confier ses données ni créer de compte. C'est d'abord passé par un script Python — efficace, mais frustrant pour façonner quelque chose d'aussi visuel — avant de devenir un véritable éditeur web. Le résultat est un outil stylé, respectueux de la vie privée, organisable par projets, exportable et open source — construit en quelques heures avec l'aide de Claude Code.

Si vous avez un QR code à créer, [essayez Dotcraft](https://dotcraft.fr). Et si la technique vous intéresse, le [code est sur GitHub](https://github.com/GuillaumeOj/dotcraft).
