---
title: "Quel navigateur choisir ? D'Internet Explorer à Zen, mon parcours"
description: "Internet Explorer, Firefox, Chrome, Safari, Arc, puis Zen : l'histoire d'un développeur et de ses navigateurs, entre confort d'usage, uBlock Origin et convictions."
seoTitle: "Quel navigateur choisir ? Mon parcours jusqu'à Zen"
seoDescription: "Internet Explorer, Firefox, Chrome, Safari, Arc, puis Zen : ce que m'ont appris vingt ans de navigateurs, de Manifest V3 à la fin d'Arc et aux DRM."
pubDate: 2026-10-30
lang: fr
slug: quel-navigateur-choisir-zen-firefox-arc
translationKey: browser-choice
cover: ../../../assets/blog/choix-navigateur/cover.jpg
coverCredit:
  author: Matthew Fournier
  authorUrl: https://unsplash.com/@mattyfours
  url: https://unsplash.com/photos/5NM32v14n6M
tags: ["Navigateur", "Firefox", "Zen", "Open source"]
---

## Mes premiers pas sur un PC

Mon histoire avec les ordinateurs remonte à très loin, à l'échelle d'une vie : la maternelle, pour être exact. Mon père, dans le cadre de son travail, avait fait l'acquisition d'un PC dont je ne me rappelle plus la référence. À l'époque, pas de connexion internet : une souris, un clavier et deux jeux, le démineur et le solitaire.

Puis Free s'est mis à distribuer des CD donnant accès gratuitement à internet, quelques heures seulement. Il fallait un modem 56k, une ligne téléphonique et un programme à installer pour se connecter. Ça faisait du bruit, on ne pouvait plus téléphoner, et il n'y avait pas grand-chose à y faire. Une fois les heures gratuites écoulées, ça coûtait une fortune.

Vinrent ensuite les abonnements ADSL. Le premier que nous avons eu était chez Wanadoo, et une sorte de raie manta verte a fait son apparition dans notre salon. On lançait un programme, on se connectait, et voilà ! MSN et les copains devenaient un nouveau terrain de jeu, et le Site du Zéro (devenu depuis [OpenClassrooms](https://openclassrooms.com/)) une mine d'informations pour apprendre plein de choses sur la programmation web.

## Internet Explorer, puis la révélation Firefox

C'est à ce moment-là que j'ai compris qu'Internet Explorer, notre navigateur de l'époque, n'était pas forcément le meilleur outil.

![Internet Explorer 8 sous Windows 7 affichant la page Wikipédia consacrée à Internet Explorer 8](../../../assets/blog/choix-navigateur/internet-explorer-8.png)

*Internet Explorer 8 sous Windows 7. Capture : [Das Schäfchen](https://commons.wikimedia.org/wiki/File:Windows_Internet_Explorer_8.png), CC BY-SA 3.0 DE.*

Un autre paraissait bien plus évolué, plus fluide, et on pouvait y ajouter des extensions sans peine : [Firefox](https://www.mozilla.org/firefox/). Pendant des années, ça a été le navigateur que j'installais par défaut sur toutes les machines que je configurais.

![Firefox 136 sous macOS affichant la page d'accueil de Wikipédia](../../../assets/blog/choix-navigateur/firefox-136.png)

*Firefox 136 sous macOS. Capture : [Paowee](https://commons.wikimedia.org/wiki/File:Firefox_136_screenshot,_macOS_Sonoma.png), CC BY-SA 4.0.*

## Chrome, la grande bascule

Puis un jour, une petite entreprise du nom de Google a sorti son propre navigateur : [Chrome](https://www.google.com/chrome/). C'était en septembre 2008, et je me suis mis à l'utiliser très tôt après sa sortie. Une révolution : plus fluide, plus léger, avec une interface plus simple. Je me suis empressé de l'adopter.

![Chrome 75 sous Windows affichant sa page d'accueil](../../../assets/blog/choix-navigateur/chrome-75.png)

*Chrome 75 sous Windows (2019). Capture : [WikiPimpi](https://commons.wikimedia.org/wiki/File:Google_Chrome_75_screenshot.png), domaine public.*

## Safari, Opera et quelques détours

Dans les années 2010, j'ai eu mon premier MacBook Pro. Et sur un Mac, difficile d'ignorer [Safari](https://www.apple.com/fr/safari/) : il est parfaitement intégré au système, et j'ai commencé à l'utiliser pour cette raison.

![Safari 17 sous macOS Sonoma affichant la page d'accueil de Wikipédia](../../../assets/blog/choix-navigateur/safari-17.png)

*Safari 17 sous macOS Sonoma. Capture : [ChipsPacketLover](https://commons.wikimedia.org/wiki/File:Safari_17_on_macOS_Sonoma.png), CC0.*

Au fil des années, j'ai aussi exploré d'autres pistes, comme [Opera](https://www.opera.com/) puis, plus tard, [Brave](https://brave.com/), né en 2016. Mais à chaque fois, je ne trouvais pas d'intérêt suffisant pour changer.

## Le piège Chromium

Chrome repose sur [Chromium](https://www.chromium.org/), le moteur (et le projet open source) piloté par Google. Or ce moteur n'est pas réservé à Chrome : Opera, Brave, Edge et bien d'autres l'utilisent aussi. Résultat, une grande partie du web passe par un seul et même moteur, dont l'évolution dépend largement d'une seule entreprise.

Conscient du chemin que prenait Google avec Chromium, je me sentais de plus en plus pris au piège, avec l'impression de ne plus avoir le choix. Je suis donc retourné sur Firefox. Même si son interface me paraissait un peu vieillissante, c'était plus cohérent pour moi d'un point de vue éthique. Et entre-temps, son moteur, Gecko, avait rattrapé une bonne partie de son retard sur Chromium.

## Arc : l'interface qui m'a fait tout oublier

Puis The Browser Company a lancé son propre navigateur : [Arc](https://arc.net/). Après une longue bêta sur invitation, il est devenu accessible à tous en juillet 2023.

Je ne suis pas dupe : je savais qu'Arc utilisait Chromium sous le capot. En revanche, j'ai été séduit par sa proposition d'interface :

- les onglets sur le côté plutôt qu'en haut ;
- la distinction claire entre les onglets temporaires et les onglets épinglés, avec des accès rapides bien identifiés ;
- une barre d'adresse discrète, des intégrations bien pensées, etc.

![Arc affichant la page Wikipédia consacrée à Arc, avec sa barre latérale d'onglets](../../../assets/blog/choix-navigateur/arc.png)

*Arc et sa barre latérale d'onglets. Capture : [Temaro](https://commons.wikimedia.org/wiki/File:Screenshot_Arc_Browser.png), CC0.*

Je dois avouer que je suis vite devenu accro, et que pendant un temps, j'ai mis mes convictions de côté.

## uBlock Origin, ou pourquoi Chromium m'a rattrapé

Entre octobre 2024 et juillet 2025, Google a progressivement désactivé dans Chrome les extensions reposant sur l'ancien format, « Manifest V2 », pour imposer le nouveau, « Manifest V3 ». Comme Arc suit Chromium, il s'est retrouvé dans le même cas. Et parmi les victimes, une extension que j'affectionne tout particulièrement : [uBlock Origin](https://ublockorigin.com/).

Pour comprendre pourquoi, il faut savoir comment elle fonctionne. uBlock Origin est un bloqueur de contenu : pour chaque requête que le navigateur s'apprête à envoyer (une image, un script, un traceur publicitaire), l'extension compare l'adresse à ses listes de filtres, très longues et mises à jour en permanence, et annule la requête si elle est indésirable. Ça repose sur une API qui permet à l'extension de regarder et d'intercepter les requêtes **en temps réel** : `webRequest`, en mode bloquant.

Manifest V3 retire ce mode bloquant. À la place, Google propose `declarativeNetRequest` : l'extension doit déclarer ses règles à l'avance, et c'est le navigateur qui les applique, sans que l'extension ne voie passer les requêtes. Le nombre de règles est plafonné, et les filtres les plus fins deviennent impossibles à écrire. Google justifie ce choix par la sécurité, la vie privée et les performances : une extension qui lit toutes les requêtes en direct est un risque. Ses détracteurs, dont le développeur d'uBlock Origin, y voient surtout un affaiblissement volontaire des bloqueurs, pour protéger un modèle économique qui repose sur la publicité.

Le développeur propose bien une version allégée, uBlock Origin Lite, compatible avec Manifest V3. Mais elle est moins puissante, et je n'ai pas voulu m'en contenter. Firefox, lui, a choisi de continuer à prendre en charge le mode bloquant de `webRequest`.

Retour à Firefox, donc. Tant pis pour l'expérience utilisateur, ce n'était pas si grave finalement.

## Firefox, encore et toujours (mais pas tout à fait comblé)

Je dois reconnaître que les équipes de Mozilla ont fait des efforts considérables ces dernières années pour faire évoluer le navigateur, y compris côté interface. Pourtant, je n'ai jamais retrouvé une satisfaction à la hauteur de ce que j'avais connu avec Arc.

## La fin d'Arc, et une découverte

C'est là qu'est arrivée la mauvaise nouvelle. Arc était déjà en simple maintenance depuis mai 2025, son éditeur ayant décidé de concentrer ses efforts sur un autre navigateur, Dia, puis ayant été racheté par Atlassian. Le 22 octobre 2026, The Browser Company a annoncé l'arrêt définitif d'Arc, prévu le 22 décembre 2026. Une vie bien courte.

En cherchant ce que les utilisateurs d'Arc allaient devenir, je suis tombé sur un projet dont je n'avais jamais entendu parler : un navigateur open source qui utilise **Gecko**, le moteur de Firefox. Son nom : [Zen](https://zen-browser.app/).

## Zen : l'expérience d'Arc, avec le moteur de Firefox

L'idée est ultra-simple : proposer l'expérience utilisateur d'Arc, mais sur Gecko. Génial. J'ai sauté sur l'occasion : je l'ai téléchargé, je l'ai testé, et en l'espace d'une heure, il est devenu mon navigateur par défaut.

![Zen Browser sous macOS affichant la page d'accueil de Wikipédia, avec sa barre latérale d'onglets](../../../assets/blog/choix-navigateur/zen-1-8.png)

*Zen Browser 1.8.2b sous macOS. Capture : [KiwiTheGamer](https://commons.wikimedia.org/wiki/File:Zen_Browser_1.8.2b_on_MacOS.png), CC BY-SA 4.0.*

Bien sûr, c'est encore une bêta, et les numéros de version portent d'ailleurs un « b ». Mais je suis très satisfait du produit tel qu'il est, pour l'usage que j'en ai. J'ai retrouvé les onglets sur le côté, les espaces de travail, les accès rapides, et surtout mes extensions, uBlock Origin en tête. Avec en prime un moteur qui ne dépend pas de Google.

## Le revers de la médaille : les DRM

Il y a tout de même une limite, et je préfère être transparent : Zen ne sait pas encore lire les contenus protégés par DRM. Ça ne me gêne pas, car je ne regarde pas Netflix et je n'écoute pas Spotify dans mon navigateur. Mais ça peut compter pour vous, alors voici de quoi il s'agit.

Les DRM (*Digital Rights Management*) sont des protections qui empêchent la copie des contenus, vidéos et musiques notamment. Sur le web, ça fonctionne ainsi : le service chiffre le flux, et le navigateur doit le déchiffrer à l'aide d'un module logiciel fermé, un *CDM* (*Content Decryption Module*), appelé par une API standard, les *Encrypted Media Extensions*. Le CDM le plus répandu s'appelle **Widevine**, et il appartient à Google. Netflix, Disney+, Prime Video et d'autres en dépendent.

Pour embarquer Widevine, un navigateur doit obtenir une licence auprès de Google. C'est possible pour une organisation établie comme Mozilla, dont le navigateur Firefox peut télécharger le module à la demande, beaucoup moins pour un jeune projet communautaire. D'après les discussions du projet, Zen attend cette autorisation.

La conséquence est concrète : sur un service qui exige Widevine, la vidéo refuse de se lancer ou affiche une erreur. Il faut alors passer par un autre navigateur, pour moi Firefox, qui reste installé pour ces cas-là.

Les retours d'utilisateurs sur le sujet sont parfois contradictoires selon le système et la version, donc si ce point est crucial pour vous, vérifiez sur votre machine avant de vous engager.

## Alors, quel navigateur choisir ?

Il n'y a pas de bonne réponse unique, et c'est bien le sens de ce parcours : en vingt ans, mon navigateur a changé au gré de mes usages, de mes envies et de mes convictions, pas parce qu'il existerait un « meilleur » navigateur dans l'absolu.

Avant de choisir, quelques questions valent d'être posées :

- **Que faites-vous au quotidien ?** Si vous regardez des séries en streaming, les DRM comptent. Si vous travaillez surtout dans des applications web, la fluidité et la gestion des onglets pèsent davantage.
- **Qu'attendez-vous de l'interface ?** Onglets en haut ou sur le côté, simplicité ou personnalisation : c'est une affaire de goût, et il n'y a rien de plus personnel.
- **Quelle place donnez-vous à vos extensions ?** Si un bloqueur de publicité ou de traceurs est indispensable pour vous, vérifiez ce que chaque navigateur permet réellement.
- **Que pensez-vous de la concentration du web ?** Chromium équipe une immense partie des navigateurs ; Gecko et WebKit (le moteur de Safari) sont les alternatives. Que votre choix soit militant ou pragmatique, mieux vaut le faire en connaissance de cause.
- **Quel écosystème utilisez-vous ?** Safari sur un Mac et un iPhone, Chrome avec un compte Google, Firefox et ses comptes synchronisés : l'intégration a de la valeur.

Mon parcours en est la preuve : un choix n'est jamais définitif. J'ai bien changé de navigateur à plusieurs reprises, et la fin d'Arc m'a rappelé qu'un outil peut disparaître du jour au lendemain. Alors testez, comparez, et gardez celui qui vous correspond, en sachant pourquoi vous l'avez choisi.
