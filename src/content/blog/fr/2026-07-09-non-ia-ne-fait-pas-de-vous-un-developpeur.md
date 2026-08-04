---
title: "Non, l'IA ne fait pas de vous un développeur"
description: "Deux personnes, deux métiers sans aucun rapport avec le code, une même idée : « pourquoi payer un développeur alors que l'IA peut le faire ? » L'une voulait un outil sur mesure pour gérer son activité, l'autre refaire le site de la sienne. Toutes deux se sont lancées seules, portées par les promesses de l'IA. Spoiler : ça ne s'est pas bien terminé. Récit de deux échecs — et de ce qu'ils révèlent."
pubDate: 2026-07-09
lang: fr
slug: non-ia-ne-fait-pas-de-vous-un-developpeur
translationKey: ia-developpeur
cover: ../../../assets/blog/ia-developpeur/cover.jpg
tags: []
---

Avant de commencer, autant le dire franchement : je suis développeur. Vous pouvez donc me lire avec cet œil-là, et c'est légitime. Mais ce n'est pas un plaidoyer pour mon gagne-pain — j'utilise l'IA tous les jours et je suis le premier à en vanter la puissance. Ce qui m'intéresse ici, c'est autre chose : la frontière, souvent invisible, entre ce que l'IA fait très bien et ce qu'elle ne fait pas encore seule.

## Concrètement, qu'est-ce qui n'a pas marché ?

### Cas n°1 : l'outil de gestion des commandes

La première personne voulait un outil professionnel pour se simplifier la semaine : suivi des commandes, création de commandes, suivi des stocks, et même ajustement automatique des quantités selon les prévisions météo. Un vrai petit logiciel métier, en somme.

Elle s'est tournée vers Google AI Studio. La promesse est séduisante : tout un panel d'outils pour mener un projet de code de la première idée jusqu'au déploiement. Sur le papier, ça donne envie — je le précise, je ne l'ai personnellement jamais testé.

Au début, tout roule. L'interface se construit en un rien de temps, les boutons répondent, les actions s'enchaînent. Puis viennent les vrais besoins : connecter l'application à une API pour passer commande, récupérer les données météo, envoyer des e-mails et des SMS. Dans l'environnement de Google AI Studio, tout fonctionne. Mais au moment du déploiement, tout s'effondre. Le build crache des erreurs incompréhensibles, les appels API ne passent plus. Bref, plus rien ne marche.

C'est là qu'elle me contacte pour comprendre ce qui se passe. Mes premières questions : comment contactes-tu l'API de ton fournisseur ? Comment t'authentifies-tu ? As-tu déjà réussi à faire tourner l'application en local ? Vous la voyez venir, la réponse ?

Blanc. Elle avait « juste demandé à Gemini de se connecter à tel endroit ». Le reste, elle n'en savait rien. Et c'est parfaitement normal : ce n'est pas son métier ! On parle quand même d'un outil qui gère une base de données, dialogue avec des API externes et s'appuie sur des services tiers pour l'envoi d'e-mails et de SMS. Rien d'insurmontable pour un développeur, mais cela suppose des connaissances de base. Ce n'est pas une page web statique, c'est une application avec toutes les couches techniques que cela implique. Et encore — même une simple page statique a ses pièges.

### Cas n°2 : le site vitrine

Vous avez vu la transition ? :)

Deuxième cas : un professionnel qui veut refondre le site vitrine de son activité. L'ancien date de dix ans, tombe en décrépitude, n'est plus à jour, plus grand-chose ne fonctionne. Un cas classique. Il me contacte pour qu'on échange sur ce que je pourrais lui proposer.

Le premier rendez-vous tombe à l'eau : il ne se présente pas, une urgence sur un dossier. Il n'a pas tort, rien de vital pour son site, son activité passe avant. Quelques jours plus tard, il me demande une fourchette tarifaire — que j'ai eu la maladresse de lui donner. Puis le couperet : « On va trouver une solution moins chère. » Traduction : « On va le faire nous-mêmes avec Claude Code. »

Par curiosité, je vais voir le résultat quelque temps après. Au premier coup d'œil, c'est propre, ça fait le job. Et c'est bien là le piège : ce qui cloche est précisément ce qu'un non-initié ne peut pas voir. Dès qu'on regarde de plus près, on repère une série de choses qu'un développeur averti n'aurait jamais laissé passer :

- des contrastes trop faibles entre les éléments et le fond à plusieurs endroits, y compris sur des boutons d'appel à l'action ;
- les photos du trombinoscope non compressées, qui plombent le temps de chargement de la page ;
- une structure de page brouillonne, qui rend la lecture pénible pour le visiteur ;
- des mentions légales et une politique de confidentialité collées en plein milieu de la page, entre le formulaire de contact et les tarifs — ce qui, au-delà du désordre visuel, pose un vrai problème de conformité et de lisibilité ;
- un menu mobile invisible quand on clique dessus ;
- aucune règle de base appliquée pour le référencement (SEO) ;
- et quelques autres coquilles dont je vous épargne la liste.

Et c'est là que ça fait mal. Prises isolément, ces erreurs semblent mineures. Mises bout à bout, elles sabordent le référencement du site : un temps de chargement trop long, une structure de page illisible pour un moteur de recherche, un affichage mobile cassé, aucune optimisation de base — ce sont exactement les critères que Google regarde pour décider s'il vous montre ou vous enterre. Résultat : un site quasiment introuvable. Et un site vitrine que personne ne trouve, c'est un site qui ne sert à rien. Je précise que je suis très loin d'être un expert du SEO — et c'est justement ce qui rend le constat parlant : si même moi je repère ces défauts au premier regard, l'algorithme, lui, ne les pardonne pas.

Le bilan ? Il a dû y passer près d'une journée. Pour une activité facturée sans doute autour de 300 à 400 € de l'heure. Je vous laisse faire le calcul — l'« économie » n'en est plus vraiment une.

Dans les deux cas, le même piège : ce qui compte vraiment est justement ce qui ne se voit pas. L'écran a beau paraître fonctionnel, l'essentiel se joue en dessous.

## Une objection honnête, avant d'aller plus loin

Je vous entends venir : deux échecs ne font pas une démonstration. Vous avez raison. Combien d'artisans ont sorti un site tout à fait correct avec l'IA et ne m'ont jamais appelé, justement parce que ça marchait ? Ceux-là, je ne les vois pas — par définition, seuls reviennent vers moi les cas qui ont coincé. Ces deux histoires ne prouvent donc pas que ça rate à tous les coups. Elles montrent autre chose, de plus subtil : ça rate là où on ne l'attend pas, sur ce que l'œil non averti ne peut pas contrôler.

## L'état de l'IA à l'instant T (parce que je ne suis pas un anti-IA)

Qu'on soit clair : je ne crache pas dans la soupe. Partout sur les réseaux, des enthousiastes clament que l'IA leur a permis de mener des projets de A à Z en quelques heures, que les développeurs n'ont plus de valeur ajoutée en 2026, que le secteur va profondément se transformer. Et sur le fond, ils n'ont pas tort.

Personnellement, je n'ai pas écrit une ligne de code à la main depuis janvier 2026. Alors oui, le métier de développeur tel qu'on l'a connu a déjà fondamentalement changé — plus ou moins vite selon les entreprises. Les développeurs vont sans doute monter en niveau : se concentrer sur la logique métier, affiner l'expérience utilisateur, surveiller les performances. Fini les tunnels de code interminables pour livrer une fonctionnalité, finies les heures d'analyse pour traquer un bug.

Mais voilà le nœud de l'affaire, et c'est ce qui explique la différence entre eux et moi : **l'IA ne remplace pas le développeur, elle démultiplie celui qui sait déjà.** Si je code dix fois plus vite qu'avant, ce n'est pas parce que l'IA pense à ma place — c'est parce que je sais quoi lui demander, repérer quand elle se trompe, et corriger le tir avant que ça parte en production. Retirez cette supervision, et l'outil produit exactement ce qu'on a vu plus haut : quelque chose qui a l'air de marcher. L'IA reste un outil, pas une intelligence autonome. On peut sans doute pousser encore plus loin l'autonomie des agents — mais à un coût que je ne peux, à titre personnel, pas assumer.

## Que faut-il en retenir ?

Ne nous trompons pas de procès. L'IA est un outil formidable, au même titre que Google ou Wikipédia à leur arrivée. Mais c'est un outil. On ne met pas un tour d'usinage entre les mains de quelqu'un qui n'en a jamais touché en espérant qu'il vous sorte une pièce de moteur de Formule 1.

Pour qui est loin du monde du développement, l'IA est une opportunité incroyable : donner forme à une idée de produit tech en un temps record, obtenir un visuel qui parle. Un excellent support, ensuite, pour échanger avec quelqu'un dont c'est le métier.

Mais ne vous y trompez pas : ce n'est pas parce qu'une application paraît simple à l'écran qu'elle l'est techniquement. Il y a des règles à respecter — de sécurité, d'accessibilité, de référencement, d'usage — et ce sont précisément elles qui séparent une démo d'un produit fiable.

Alors, concrètement, on fait quoi ? Utilisez l'IA pour ce qu'elle fait de mieux : prototyper, explorer, mettre une idée en forme pour la rendre tangible. Puis, avant de mettre quoi que ce soit en ligne ou entre les mains de vos clients, faites auditer — ou carrément reprendre — le travail par quelqu'un dont c'est le métier. Vous garderez la vitesse du premier jet sans hériter des pièges invisibles.

Car au final, il reste indispensable — et pour longtemps encore — de faire appel à un professionnel. Quelqu'un qui saura vous accompagner et mettre en place des systèmes durables, vraiment à la hauteur de votre besoin. L'IA vous donne le premier jet. Le professionnel vous donne ce qui tient dans le temps.
