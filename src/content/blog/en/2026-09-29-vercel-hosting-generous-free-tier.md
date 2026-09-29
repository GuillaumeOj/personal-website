---
title: "Vercel: hosting with a generous free tier"
description: "What I learned using Vercel and Neon to host static sites, Django apps and their PostgreSQL database for free: what it makes possible, and the limits to know about."
pubDate: 2026-09-29
lang: en
slug: vercel-hosting-generous-free-tier
translationKey: vercel-free-tier
cover: ../../../assets/blog/vercel-free-tier/cover.jpg
tags: []
---

For each of my recent projects, the hosting question came up the same way: how do I put something clean online, quickly, without paying for a server that sits idle 95% of the time? This blog, [Dotcraft](https://dotcraft.fr), [Ma Garde Sereine](https://ma-garde-sereine.fr), [Re-Source Et Moi](https://re-source-et-moi.fr), the website of [Maître Eva Biezunski](https://biezunski-avocat.fr)… they all run on **Vercel** today. And most of them cost me nothing. Here's how I got there, and what you should know before doing the same.

## Static sites first

At first, I saw Vercel the way many people do: a front-end host. You connect a GitHub repository, you push, and a few dozen seconds later the site is live, with HTTPS and a domain name set up without a second thought.

That's exactly what I needed for this blog (Astro, version-controlled Markdown) or for Maître Biezunski's business website (Next.js). No server to maintain, no Nginx configuration, no certificate to renew.

## What makes deploying so easy

- **The GitHub integration**: every push to `main` triggers a production deployment. No pipeline to write.
- **Preview deployments**: every pull request gets its own URL. Proofreading a post or showing a feature to someone before merging it becomes trivial.
- **One-click rollback**: every deployment is immutable; going back to the previous version takes a few seconds.
- **Environment variables** per environment (production, preview, development), which you can pull locally with `vercel env pull`.

## The discovery: you can run a Django backend there too

For a long time, I thought Vercel stopped at the front end. For my projects with a Django backend, I was looking for another host… until I found out that Vercel runs **Python** too. A Django application deploys like any other project: Vercel detects the WSGI application and serves it through its serverless functions.

That's what runs the Django / DRF backend of Re-Source Et Moi and Ma Garde Sereine, next to a front end of your choice (React, Next.js…). One provider, one deployment workflow, for the front end and the API alike.

A few things to watch out for with Django in this setup:

### Static files

There's no file server behind it: `collectstatic` has to run at build time, and static files are served by Vercel (or by WhiteNoise).

### Migrations

They don't run by themselves. I run them in the build command or from my machine, pointed at the production database.

### No long-running background jobs

No permanent Celery worker: asynchronous work goes through Vercel Cron Jobs or message queues. For a small project, that's rarely a blocker.

## Neon: the PostgreSQL database that completes the picture

A backend without a database isn't much use. That's where **Neon** comes in, a serverless PostgreSQL available straight from the Vercel marketplace. Its free plan lets you create **several projects**, so one dedicated database per application, and the integration automatically injects `DATABASE_URL` into your environment variables.

On the Django side, the configuration fits in a few lines:

```python
import dj_database_url

DATABASES = {
    "default": dj_database_url.config(conn_max_age=0, ssl_require=True),
}
```

Another bonus: Neon can create a **database branch** for every preview deployment. Each pull request can test its migrations on a copy of the data without touching production.

The result: front end, Django API and PostgreSQL database, deployed automatically from GitHub… for **$0**.

## The limits to know about

Free doesn't mean unlimited, and it's better to know that before you start.

- **A database with limited resources**: on Neon's free plan, CPU, RAM and above all storage (0.5 GB per project) are limited. Plenty for a blog, a non-profit's website or an app that's just starting; not for a database of several gigabytes.
- **Database wake-up**: an idle database goes to sleep. The first query after a pause takes a few hundred extra milliseconds. Invisible for a non-profit's website, noticeable on a busy API.
- **Function cold starts**: same idea on the Python side, an instance that hasn't served in a while takes a little longer to respond.
- **Commercial use**: Vercel's Hobby plan is for personal, non-commercial use only. As soon as a project makes money, you need to move to the Pro plan.
- **Platform lock-in**: everything is simple as long as you stay within the intended boundaries. A growing project (workers, heavy WebSockets, large volumes) may end up elsewhere, so it's better to keep a standard, portable Django application rather than lock yourself into platform specifics.

## Who is it for?

For a blog, a business website, a non-profit's website, an MVP or a side project, it's in my view one of the best options right now: you spend your time on the product, not on the infrastructure. For a high-traffic or data-heavy application, the free tier will quickly be too tight, but moving to the paid plans doesn't require changing any code.

## In short

Vercel for the front end and the Django backend, Neon for PostgreSQL: this combination lets me launch a complete application in an afternoon, without a credit card. The limits are real (database resources, sleep, non-commercial use) but, for the projects I work on, I almost never run into them.

Have a project to put online and unsure about hosting? [Let's talk](/en#contact).
