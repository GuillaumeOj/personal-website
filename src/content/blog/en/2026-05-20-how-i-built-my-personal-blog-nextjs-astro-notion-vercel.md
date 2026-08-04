---
title: "How I Built My Personal Blog: Next.js, Astro, Notion, and Vercel"
description: "A detailed look at the technical choices behind my personal blog: a Next.js + Astro stack with Notion as a bilingual headless CMS, an automated deployment pipeline via Vercel, and image handling with Vercel Blob."
pubDate: 2026-05-20
lang: en
slug: how-i-built-my-personal-blog-nextjs-astro-notion-vercel
translationKey: blog-stack
cover: ../../../assets/blog/blog-stack/cover.jpg
tags: []
---

My personal blog is the technical project I keep coming back to and improving. It's also the perfect playground for testing stacks, tools, and architectures. Here's a detailed look at the technical choices I made and how everything fits together.

## The Stack: Why Next.js *and* Astro?

The first question people usually ask me is: why two JavaScript frameworks? The answer lies in the very nature of the project.

**Astro** handles the blog proper — listing pages, articles, editorial layout. Astro is built for this: it generates static HTML by default, ships minimal JavaScript to the client, and its "islands" component model is perfect for a site where 95% of the content is purely static. Performance is excellent and the bundle is minimal.

**Next.js** takes care of the rest of the site — in this case a single page presenting myself and my professional experience. This part has different requirements than the blog: potentially richer interactions and rendering flexibility (SSR, ISR) that Next.js handles very well, while leaving room for future evolution of the site.

Both coexist in the same repository with a clear routing that delimits each one's responsibilities. It's not the simplest stack to bootstrap, but once in place it offers the best of both worlds: the lightness of Astro for editorial content, the power of Next.js for everything else.

## Notion as a Bilingual CMS

Articles are written directly in Notion, in a `Personal blog` database. Each article is a Notion page with a set of structured properties:

- **title** — the article title
- **slug** — the URL identifier
- **lang** — the language (`fr` or `en`)
- **translationKey** — a shared key between the French and English versions to link both translations
- **pubDate** — the publication date
- **author** — the author
- **related** — related articles
- **status** — `draft` or `published`

Content is written in both French and English directly in Notion. Each language corresponds to a separate page in the database, linked by the `translationKey`. This allows the blog to offer a language switcher and navigate between the two versions of the same article.

Notion thus acts as a true headless CMS: a pleasant editing interface, rich Markdown support, image management, and possible collaboration. The Notion API is queried at build time to retrieve all published articles.

## The Deployment Pipeline: From Notion to Vercel

The publishing mechanism relies on a webhook. When an article is modified or published in Notion, an event is triggered and intercepted on the Vercel side. Vercel then kicks off a rebuild of the site, which re-queries the Notion API to fetch the updated content and regenerates the corresponding static pages.

The complete flow looks like this:

```
┌─────────────────────────────┐
│    Change in Notion         │
└─────────────┬───────────────┘
              ↓
┌─────────────────────────────┐
│  Webhook → Vercel endpoint  │
└─────────────┬───────────────┘
              ↓
┌─────────────────────────────┐
│  Vercel triggers a build    │
└─────────────┬───────────────┘
              ↓
┌─────────────────────────────┐
│  Astro queries the Notion   │
│  API                        │
└─────────────┬───────────────┘
              ↓
┌─────────────────────────────┐
│  Static generation of       │
│  article pages              │
└─────────────┬───────────────┘
              ↓
┌─────────────────────────────┐
│  Deployment to Vercel CDN   │
└─────────────────────────────┘
```

This pipeline ensures the blog is always up to date without requiring manual deployments. Static rendering guarantees very fast load times and maximum resilience: once pages are generated, they no longer depend on Notion to be served.

The only delay is the build itself — typically a few tens of seconds — which is perfectly acceptable for a personal blog.

## Images: Vercel Blob to the Rescue

Image handling is one of the trickiest points when using Notion as a CMS. By default, image URLs in Notion are temporary and expirable. An image uploaded to a Notion page generates a signed URL with a limited lifespan. After a few hours, that URL is no longer valid.

For a statically generated site built at build time, this is a major problem: images displayed in articles could become inaccessible shortly after the site is generated.

The chosen solution is **Vercel Blob**: during the build, images referenced in Notion articles are downloaded and re-hosted in Vercel Blob. Blob URLs are stable and permanent. The generated pages point to these Blob URLs rather than to Notion's temporary URLs.

This mechanism ensures images remain accessible indefinitely, regardless of what happens on the Notion side. It's an essential robustness layer for a production site.

## Wrap-up

This stack isn't the simplest to set up, but it precisely meets the needs of a bilingual personal blog with performant static content:

- **Notion** for the editing experience and bilingual content management
- **Astro** for lightweight, fast static generation of articles
- **Next.js** for the parts of the site that need more dynamism
- **Vercel** for hosting, CI/CD via webhooks, and image storage with Blob
- **Vercel Blob** for making Notion-extracted images permanent

Everything forms a coherent system where each component has a clear role. Publishing an article from Notion all the way to the live blog is fully automated, and performance remains solid thanks to static rendering.

This stack is still recent, and I don't have enough hindsight to draw a definitive conclusion. Some choices may evolve after extended use — whether that's image handling, the Next.js / Astro split, or the Notion integration. I'll update this article if that happens.

This is the kind of "composed" architecture I enjoy, in backend development as well as frontend: choosing the right tool for each problem rather than making everything depend on a single one.
