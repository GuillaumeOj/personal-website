---
title: "Vercel : un hébergement avec un tier gratuit généreux"
description: "Retour d'expérience sur Vercel et Neon pour héberger gratuitement des sites statiques, des applications Django et leur base PostgreSQL : ce que ça permet, et les limites à connaître."
seoDescription: "Ce que les offres gratuites de Vercel et Neon permettent d'héberger (sites statiques, applis Django, base PostgreSQL) et les limites à connaître."
pubDate: 2026-09-29
lang: fr
slug: vercel-hebergement-tier-gratuit-genereux
translationKey: vercel-free-tier
cover: ../../../assets/blog/vercel-free-tier/cover.jpg
coverCredit:
  author: Sonny Mauricio
  authorUrl: https://unsplash.com/@northernstatemedia
  url: https://unsplash.com/photos/kIr8e-01eAw
tags: ["Vercel", "Neon", "Django", "Hébergement"]
---

À chaque nouveau projet, la même question revient : comment mettre en ligne quelque chose de propre, rapidement, sans payer un serveur qui tournera à vide 95 % du temps ? [Ce blog](/projects/personal-website/), [dotcraft](/projects/dotcraft/), [Ma Garde Sereine](/projects/ma-garde-sereine/), [Re-Source Et Moi](/projects/re-source-et-moi/), le [site de Maître Eva Biezunski](/projects/eva-biezunski-avocate/)… tous tournent aujourd'hui sur **Vercel**. Voici comment j'en suis arrivé là, et ce qu'il faut savoir avant de faire de même.

## D'abord, des sites statiques

Au départ, je voyais Vercel comme beaucoup de monde : un hébergeur pour le frontend. On connecte un dépôt GitHub, on pousse son code, et quelques dizaines de secondes plus tard le site est en ligne, HTTPS et nom de domaine compris, sans même y penser.

C'est exactement ce qu'il me fallait pour ce blog (Astro et des articles en Markdown versionnés) ou pour le site vitrine de Maître Biezunski (Next.js). Pas de serveur à maintenir, pas de configuration Nginx, pas de certificat à renouveler.

## Pourquoi le déploiement est si simple

- **L'intégration GitHub** : chaque push sur `main` déclenche un déploiement en production. Aucun pipeline à écrire.
- **Les déploiements de prévisualisation** : chaque pull request obtient sa propre URL. Faire relire un article ou montrer une fonctionnalité avant de la fusionner devient un jeu d'enfant.
- **Le retour arrière en un clic** : chaque déploiement est conservé tel quel ; revenir à la version précédente prend quelques secondes.
- **Des variables d'environnement distinctes** pour la production, les prévisualisations et le développement, que l'on récupère en local avec `vercel env pull`.

## La découverte : Vercel sait aussi faire tourner Django

Pendant longtemps, j'ai cru que Vercel s'arrêtait au frontend. Pour mes projets avec un backend Django, je cherchais donc un autre hébergeur… jusqu'à ce que je découvre que Vercel exécute aussi du **Python**. Une application Django s'y déploie comme n'importe quel autre projet : Vercel détecte l'application WSGI et la sert au travers de ses fonctions serverless.

C'est ainsi que tourne le backend Django / DRF de Re-Source Et Moi et de Ma Garde Sereine, aux côtés d'un frontend au choix (React, Next.js…). Un seul fournisseur et une seule façon de déployer, pour le frontend comme pour l'API.

Django impose tout de même quelques précautions dans ce contexte.

### Les fichiers statiques

Il n'y a pas de serveur dédié aux fichiers : `collectstatic` doit être lancé pendant le build, et les fichiers statiques servis par Vercel (ou par WhiteNoise).

### Les migrations

Elles ne se lancent pas toutes seules. Je les exécute soit dans la commande de build, soit depuis mon poste, en pointant sur la base de production.

### Pas de tâches de fond au long cours

Impossible de garder un worker Celery allumé en permanence : les traitements asynchrones passent par les Cron Jobs de Vercel ou par des files de messages. Pour un petit projet, c'est rarement bloquant.

## Neon, la base PostgreSQL qui complète le tableau

Un backend sans base de données ne sert pas à grand-chose. C'est là qu'intervient **Neon**, un PostgreSQL serverless disponible directement depuis la Marketplace de Vercel. Son offre gratuite permet de créer **plusieurs projets**, et donc d'avoir une base dédiée par application. L'intégration injecte en prime la variable `DATABASE_URL` dans l'environnement du projet.

Côté Django, la configuration tient en quelques lignes :

```python
import dj_database_url

DATABASES = {
    "default": dj_database_url.config(conn_max_age=0, ssl_require=True),
}
```

Autre avantage : Neon peut créer une **branche de la base de données** pour chaque déploiement de prévisualisation. On teste ainsi les migrations de chaque pull request sur une copie des données, sans toucher à la production.

Au final : un frontend, une API Django et une base PostgreSQL, déployés automatiquement depuis GitHub et, pour un projet personnel, sans débourser un centime grâce aux offres gratuites.

## Les limites à connaître

Gratuit ne veut pas dire illimité, et mieux vaut le savoir avant de se lancer.

- **Une base aux ressources réduites** : avec l'offre gratuite de Neon, le processeur, la mémoire et surtout le stockage (0,5 Go par projet) sont limités. C'est largement suffisant pour un blog, le site d'une association ou une application qui démarre, mais pas pour une base de plusieurs gigaoctets.
- **Le réveil de la base** : une base inactive se met en veille, et la première requête qui suit prend quelques centaines de millisecondes de plus. Imperceptible sur le site d'une association, plus gênant pour une API très sollicitée.
- **Le démarrage à froid des fonctions** : c'est la même logique côté Python. Une instance restée inactive un moment met un peu plus de temps à répondre.
- **L'usage commercial** : l'offre Hobby de Vercel est réservée à un usage personnel et non commercial. Dès qu'un projet génère des revenus, il faut passer à l'offre Pro.
- **La dépendance à la plateforme** : tout reste simple tant qu'on ne sort pas du cadre prévu. Un projet qui grandit (workers, WebSockets intensifs, gros volumes de données) finira peut-être ailleurs. Mieux vaut donc garder une application Django standard et portable, plutôt que de s'enfermer dans les spécificités de la plateforme.

## À qui s'adresse cette solution ?

Pour un blog, un MVP ou un projet personnel, l'offre gratuite est à mon sens l'une des meilleures options du moment : on consacre son temps au produit, pas à l'infrastructure. Pour un site vitrine ou tout projet commercial, il faut prévoir l'offre Pro : la plateforme et le code restent les mêmes. Pour une application à fort trafic ou qui manipule beaucoup de données, l'offre gratuite deviendra vite trop juste, mais le passage aux offres payantes se fait sans toucher une ligne de code.

## En résumé

Vercel pour le frontend et le backend Django, Neon pour PostgreSQL : ce duo me permet de lancer une application complète en un après-midi, sans sortir la carte bancaire. Les limites existent (ressources de la base, mise en veille, usage non commercial), mais pour mes projets personnels, je ne les ressens quasiment jamais.

Vous avez un projet à mettre en ligne et hésitez sur l'hébergement ? [Parlons-en](/contact/).
