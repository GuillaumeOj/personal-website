---
title: "Markdown or Database: Two Paths for a Blog"
description: "Markdown files in Git, or a database with an admin interface: what I learned building two blogs, and why the right choice depends first and foremost on who does the writing."
seoDescription: "Markdown files in Git, or a database with an admin interface? Two blogs I built, and why the right choice depends on who does the writing."
pubDate: 2026-10-01
lang: en
slug: markdown-or-database-two-paths-for-a-blog
translationKey: blog-two-paths
cover: ../../../assets/blog/blog-two-paths/cover.jpg
coverCredit:
  author: Jens Lelie
  authorUrl: https://unsplash.com/@madebyjens
  url: https://unsplash.com/photos/u0vgcIOQG08
tags: ["Blog", "Markdown", "Django", "Notion", "MCP"]
---

"What's the best way to build a blog?" I get asked this a lot, and I never have a ready-made answer. Not for lack of tools, but because it's the wrong question. The better question is: **who is going to write, and which tool are they comfortable with?**

This year, I built two blogs that illustrate this well. Mine, the one you're reading, and the publications section of the website I built for [Maître Eva Biezunski](/en/projects/eva-biezunski-avocate/), a corporate lawyer. Much the same need on the surface (publishing articles), two opposite author profiles, and in the end two architectures with almost nothing in common.

## WordPress, the default I left behind

For a long time, the default answer to "I need a blog" was WordPress. I've used it in the past, and I understand why it's so popular: the editor is approachable, the ecosystem is huge, and just about every host supports it.

But over time, a few things wore me down:

- **The monolith**: the editor, page rendering, administration and database all live in the same application. Out of the box, you can't change one without dragging the others along.
- **The "need" for plugins**: SEO, caching, forms, security, backups… Almost every common need means a plugin, some better maintained than others, that you update with your fingers crossed that it still plays well with the rest.
- **Slowness**: as plugins pile up, pages get heavier, and you end up adding… a caching plugin to compensate.
- **The attack surface**: because it's everywhere, WordPress is a permanent target, and plugins are often where the breach starts. Leaving it unattended for a few months isn't really an option.

Whether for a personal blog or a client site, I wanted something lighter, easier to keep under control, and that wouldn't turn me into a system administrator.

## Notion as a CMS: appealing on paper

For the previous version of my blog, I'd made Notion both the editor and the database. I described that architecture in [a previous post](/en/blog/how-i-built-my-personal-blog-nextjs-astro-notion-vercel/): each article was a page in a Notion database, with its properties (title, slug, language, date…), and a webhook told Vercel to rebuild the site on every change.

It was a neat idea: a pleasant editor I already use every day, and a fast static site as output. In practice, three problems came up.

**Fragile webhooks.** In my case, Notion webhooks proved fragile: after some changes on the platform, calls to my endpoint started failing, and after several failures, Notion paused the webhook. The result: I'd publish an article, nothing would happen, and I'd only notice when I went to check the site.

**Invisible changes.** Not every field triggered an event. Changing an article's cover, for instance, notified no one: the site kept the old image until the next "detected" change.

**Too many deployments.** Conversely, in my case, each detected change sent its own event. Fixing the title, then the description, then the body: three events, so three deployments for a single update. You can batch events, wait a few minutes before starting a build… but I was ending up with increasingly complex plumbing for a simple blog.

The lesson I took away: by putting a third-party tool at the heart of my publishing system, I'd made myself dependent on an API whose behavior and roadmap I had no control over. For a tool that just needs to work, that was a lot of uncertainty.

## Path 1: Markdown files, for those who live in Git

For my blog, the answer ended up being as simple as possible: **Markdown files, versioned in the site's repository**. The site now runs on Astro alone, and each article has one `.md` file per language, stored in `src/content/blog/fr/` and `src/content/blog/en/`.

The header of each file (the *frontmatter*) holds the article's metadata. Here's an excerpt:

```yaml
---
title: "Markdown or Database: Two Paths for a Blog"
pubDate: 2026-10-01
lang: en
slug: markdown-or-database-two-paths-for-a-blog
translationKey: blog-two-paths
cover: ../../../assets/blog/blog-two-paths/cover.jpg
tags: ["Blog", "Markdown", "Django", "Notion", "MCP"]
# … description, cover credit, etc.
---
```

The French and English versions share the same `translationKey`: that's what links the two translations and powers the language switcher and the `hreflang` tags. Astro validates this metadata schema at build time: a missing or malformed field, and the site doesn't build.

The publishing cycle comes down to a few steps:

1. I create a branch and write the article in my editor.
2. I open a pull request: Vercel creates a preview deployment, and CI runs the tests.
3. I proofread the article on the preview URL, exactly as it will appear live.
4. I merge into `main`: the article goes live.

What I get out of it:

- **A complete history**: every change is a commit I can compare or revert.
- **Built-in review**: the pull request is the ideal place to comment and fix things before publishing.
- **No backend for the blog**: no database, no admin interface to secure. Articles are fully static pages.
- **Tested content**: tests check, for example, that every article exists in both languages, that both versions share the same cover, or that titles and descriptions fit in search results.
- **Instant rollback**, since every deployment is kept on Vercel.

But this simplicity has an obvious prerequisite: **being comfortable with Git, a code editor, Markdown syntax and the idea of a pull request**. For a developer, that's everyday life. For most people, it's a non-starter. And even among developers, having several regular contributors work this way takes some discipline.

## Path 2: a database and an admin interface, for those who just want to write

Maître Biezunski's needs were quite different. She wanted to publish articles on her business website without ever thinking about code: a visual editor, a "publish" button, and that's it. Asking her to open a pull request made no sense.

So I built a proper backend, with **Django and Django REST Framework**, and a **PostgreSQL** database hosted on Neon. Here, articles live in a database rather than in files, and the Next.js site fetches them through the API.

On the writing side, everything happens in a private admin interface, designed to be easier to pick up than the Django admin:

- **A Notion-style editor**: you write and format directly, without knowing Markdown syntax. Behind the scenes, Markdown stays the source of truth, rendered and sanitized on the server.
- **Drafts and scheduled publishing**: an article stays a draft until it's published, and a future publication date schedules it.
- **Automatically processed images**: uploaded images are auto-rotated, stripped of their metadata and converted to WebP.
- **Categories** that act as filters on the publications page.
- **Three roles** (administrator, editor, author) that define who can do what. If a colleague who wants to write joins the practice, all it takes is creating an account.

Another big difference: publishing an article triggers no deployment. Content is served from the database, and the article shows up as soon as it's published, or on its scheduled date.

### Writing from an AI assistant

I also added something I couldn't have imagined just two years ago: **an `/mcp` endpoint**. It exposes the blog through the Model Context Protocol, so articles can be managed from any compatible AI assistant, such as Claude Desktop. Listing, creating, editing, publishing or unpublishing an article can all be done conversationally.

Two safeguards keep this in check: an article created from a chat is a **draft by default**, and every action is bound by the **role of the token's owner**. Through the AI, an author can't do more than they could in the interface.

### The price of comfort

This solution obviously has a cost: a backend to host, a database to back up, an admin interface to secure, dependencies to update. Whereas my blog needs nothing more than static hosting, this one is a full-fledged application. To keep those updates stress-free, I relied on solid safeguards: the front end's TypeScript types are generated from the API's OpenAPI schema, so a test fails if the two drift apart, and the backend test suite fails below 90% coverage.

## Two paths, side by side

| | Markdown files + Git | Database + admin interface |
|---|---|---|
| **Best for** | A developer comfortable with Git and code | Anyone who wants to write without dealing with the tech |
| **Editing** | Code editor, Markdown syntax | Visual editor in the browser |
| **Publishing** | Pull request merged into `main` | "Publish" button or scheduled date |
| **Multiple authors** | Possible, but takes discipline | Built in, with roles |
| **Infrastructure** | Static pages, no dedicated backend | API, database, image storage |
| **Maintenance** | Low | Ongoing: updates, backups, security |
| **History** | Native, thanks to Git | Has to be built if you need it |

## How do you choose?

Before talking technology, I now ask a few questions:

- **Who is going to write?** If the answer is "me, and I'm a developer", it's hard to find anything simpler than Markdown files. If it's someone who doesn't want to hear about Git, you need an interface.
- **How many authors, today and tomorrow?** A single author can live with almost anything. Several authors with different permissions call for role management.
- **How often?** For a few articles a year, a non-technical person can hand their texts to someone who publishes them; once publishing becomes regular, an admin interface is a must.
- **Who will maintain the system?** A backend needs maintenance. If no one is lined up to handle it, a hosted platform, where someone else takes care of maintenance, is the better bet.

None of this is set in stone. A blog can start with Markdown and move to a database once new authors come on board. Since the content is Markdown in both cases, you can switch from one to the other without rewriting it.

## In short

My blog and Maître Biezunski's publications section meet the same need — publishing articles — with opposite architectures. Neither is "the right one" in absolute terms: each fits the person who writes. That's the principle behind all my projects: the tool should adapt to its user, not the other way around.

Need to set up a blog or a publications section? [Let's talk](/en/contact/).
