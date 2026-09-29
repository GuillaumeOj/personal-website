---
title: "Vercel : un hébergement avec un tier gratuit généreux"
description: "Retour d'expérience sur Vercel et Neon pour héberger gratuitement des sites statiques, des applications Django et leur base PostgreSQL : ce que ça permet, et les limites à connaître."
pubDate: 2026-09-29
lang: fr
slug: vercel-hebergement-tier-gratuit-genereux
translationKey: vercel-free-tier
cover: ../../../assets/blog/vercel-free-tier/cover.jpg
tags: []
---

Pour chacun de mes projets récents, la question de l'hébergement s'est posée de la même façon : comment mettre en ligne quelque chose de propre, rapidement, sans payer un serveur qui tournera à vide 95 % du temps ? Ce blog, [Dotcraft](https://dotcraft.fr), [Ma Garde Sereine](https://ma-garde-sereine.fr), [Re-Source Et Moi](https://re-source-et-moi.fr), le site de [Maître Eva Biezunski](https://biezunski-avocat.fr)… tous tournent aujourd'hui sur **Vercel**. Et la plupart ne me coûtent rien. Voici pourquoi j'en suis arrivé là, et ce qu'il faut savoir avant de faire pareil.

## D'abord, des sites statiques

Au départ, je voyais Vercel comme beaucoup de monde : un hébergeur de front-end. On connecte un dépôt GitHub, on pousse, et quelques dizaines de secondes plus tard le site est en ligne, avec HTTPS et un nom de domaine configurés sans y penser.

C'est exactement ce qu'il me fallait pour ce blog (Astro, Markdown versionné) ou pour le site vitrine de Maître Biezunski (Next.js). Pas de serveur à maintenir, pas de configuration Nginx, pas de certificat à renouveler.

## Ce qui rend le déploiement si simple

- **L'intégration GitHub** : chaque push sur `main` déclenche un déploiement en production. Aucun pipeline à écrire.
- **Les preview deployments** : chaque pull request obtient sa propre URL. Relire un article ou montrer une fonctionnalité à quelqu'un avant de la fusionner devient trivial.
- **Le rollback en un clic** : chaque déploiement est immuable ; revenir à la version précédente prend quelques secondes.
- **Les variables d'environnement** par environnement (production, preview, développement), récupérables en local avec `vercel env pull`.

## La découverte : on peut aussi y mettre un backend Django

Pendant longtemps, j'ai cru que Vercel s'arrêtait au front. Pour mes projets avec un backend Django, je cherchais donc un autre hébergeur… jusqu'à ce que je découvre que Vercel exécute aussi du **Python**. Une application Django s'y déploie comme n'importe quel projet : Vercel détecte l'application WSGI et la sert via ses fonctions serverless.

C'est ce qui fait tourner le backend Django / DRF de Re-Source Et Moi et de Ma Garde Sereine, à côté d'un front-end au choix (React, Next.js…). Un seul fournisseur, un seul workflow de déploiement, pour le front comme pour l'API.

Quelques points d'attention propres à Django dans ce contexte :

### Les fichiers statiques

Pas de serveur de fichiers derrière : `collectstatic` doit tourner au build, et les statiques être servis par Vercel (ou par WhiteNoise).

### Les migrations

Elles ne se lancent pas toutes seules. Je les exécute dans la commande de build ou depuis mon poste, pointé sur la base de production.

### Pas de tâches de fond longues

Pas de worker Celery permanent : les traitements asynchrones passent par des Cron Jobs Vercel ou des files de messages. Pour un petit projet, c'est rarement bloquant.

## Neon : la base PostgreSQL qui complète le tableau

Un backend sans base de données ne sert pas à grand-chose. C'est là qu'intervient **Neon**, un PostgreSQL serverless disponible directement depuis la marketplace Vercel. Son offre gratuite permet de créer **plusieurs projets**, donc une base dédiée par application, et l'intégration injecte automatiquement `DATABASE_URL` dans les variables d'environnement.

Côté Django, la configuration tient en quelques lignes :

```python
import dj_database_url

DATABASES = {
    "default": dj_database_url.config(conn_max_age=0, ssl_require=True),
}
```

Autre bonus : Neon sait créer une **branche de base de données** pour chaque preview deployment. Chaque pull request peut donc tester ses migrations sur une copie des données, sans toucher à la production.

Résultat : front-end, API Django et base PostgreSQL, déployés automatiquement depuis GitHub… pour **0 $**.

## Les limites à connaître

Gratuit ne veut pas dire illimité, et il vaut mieux le savoir avant de se lancer.

- **Une base aux ressources réduites** : sur l'offre gratuite de Neon, le CPU, la RAM et surtout le stockage (0,5 Go par projet) sont limités. Largement suffisant pour un blog, un site associatif ou une application qui démarre ; pas pour une base de plusieurs gigaoctets.
- **Le réveil de la base** : une base inactive se met en veille. La première requête après une pause prend quelques centaines de millisecondes de plus. Invisible pour un site associatif, perceptible sur une API très sollicitée.
- **Le cold start des fonctions** : même logique côté Python, une instance qui n'a pas servi depuis longtemps met un peu plus de temps à répondre.
- **L'usage commercial** : le plan Hobby de Vercel est réservé à un usage personnel et non commercial. Dès qu'un projet génère du revenu, il faut passer au plan Pro.
- **La dépendance à une plateforme** : tout est simple tant qu'on reste dans le cadre prévu. Un projet qui grossit (workers, WebSockets intensifs, gros volumes) finira peut-être ailleurs, et mieux vaut garder une application Django standard, portable, plutôt que de s'enfermer dans des spécificités.

## Pour qui c'est fait ?

Pour un blog, un site vitrine, le site d'une association, un MVP ou un projet perso, c'est à mon sens l'une des meilleures options du moment : on passe son temps sur le produit, pas sur l'infrastructure. Pour une application à fort trafic ou à gros volume de données, le tier gratuit sera vite trop juste, mais la migration vers les offres payantes se fait sans rien changer au code.

## En résumé

Vercel pour le front et le backend Django, Neon pour PostgreSQL : cette combinaison me permet de lancer une application complète en une après-midi, sans carte bancaire. Les limites existent (ressources de la base, veille, usage non commercial) mais, pour les projets que je mène, elles ne se font presque jamais sentir.

Vous avez un projet à mettre en ligne et hésitez sur l'hébergement ? [Parlons-en](/#contact).
