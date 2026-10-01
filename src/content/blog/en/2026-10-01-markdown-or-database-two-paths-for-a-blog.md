---
title: "Markdown or Database: Two Paths for a Blog"
description: "Markdown files versioned in Git or a database with an admin interface: what I learned building two blogs, and why the right choice depends first on the person who writes."
seoDescription: "Markdown versioned in Git or a database with an admin interface: two blogs I built, and why the right choice depends on the person who writes."
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

"What's the best way to build a blog?" People ask me regularly, and I never have a ready-made answer. Not because tools are lacking, but because the question is framed the wrong way. The right question is: **who is going to write, and which tool are they comfortable with?**

This year, I built two blogs that illustrate this perfectly. Mine, the one you're reading, and the publications space on [Maître Eva Biezunski's website](/en/projects/eva-biezunski-avocate/), a corporate lawyer. Two similar needs on paper (publishing articles), two opposite author profiles, and in the end two architectures with almost nothing in common.

## WordPress, the Reflex I Gave Up

For a long time, the default answer to "I need a blog" was WordPress. I've used it in the past, and I understand why it's so popular: the editor is approachable, the ecosystem is huge, and there's a host on every corner.

But over time, a few things wore me down:

- **The monolith**: the editor, page rendering, administration and database all live in the same application. You can't evolve one without dragging the others along.
- **The "need" for plugins**: SEO, caching, forms, security, backups… Every common need goes through a plugin, more or less well maintained, that you update while hoping it stays compatible with the rest.
- **Slowness**: as plugins pile up, pages get heavier, and you end up adding… a caching plugin to compensate.
- **The attack surface**: a WordPress site exposed to the Internet is a permanent target. Leaving it unattended for a few months isn't an option.

For a personal blog as for a client site, I wanted something lighter, more under control, and that wouldn't turn me into a system administrator.

## Notion as a CMS: Appealing on Paper

My first attempt for my own blog was to make Notion both the editor and the database. I described that architecture in [a previous post](/en/blog/how-i-built-my-personal-blog-nextjs-astro-notion-vercel/): each article was a page in a Notion database, with its properties (title, slug, language, date…), and a webhook told Vercel to rebuild the site on every change.

The idea was appealing: a pleasant editor I already use every day, and a fast static site as output. In practice, three problems came up.

**Fragile webhooks.** Notion webhooks turned out to be sensitive to changes on the platform. After some Notion updates, calls started failing; and after several failed attempts, Notion pauses the webhook. The result: I'd publish an article, nothing would happen, and I'd only notice when I went to check the site.

**Invisible changes.** Not every field triggers an event. Changing an article's cover, for instance, notified no one: the site kept the old image until the next "detected" change.

**Too many deployments.** Conversely, each detected change sent its own event. Fixing the title, then the description, then the body: three events, so three deployments for a single update. You can batch events, wait a few minutes before starting a build… but I found myself building more and more complex plumbing for a simple blog.

The lesson I took from it: by putting a third-party tool at the heart of my publishing system, I depended on an API whose behavior and release schedule I didn't control. For a tool that just needs to work, that was a lot of uncertainty.

## Path 1: Markdown Files, for Those Who Live in Git

For my blog, the answer ended up being as simple as possible: **Markdown files, versioned in the site's repository**. The site now runs on Astro alone, and each article is one `.md` file per language, stored in `src/content/blog/fr/` or `src/content/blog/en/`.

The header of each file (the *frontmatter*) holds the article's metadata:

```yaml
---
title: "Markdown or Database: Two Paths for a Blog"
pubDate: 2026-10-01
lang: en
slug: markdown-or-database-two-paths-for-a-blog
translationKey: blog-two-paths
cover: ../../../assets/blog/blog-two-paths/cover.jpg
tags: ["Blog", "Markdown", "Django", "Notion", "MCP"]
---
```

The French and English versions share the same `translationKey`: that's what links the two translations and powers the language switcher and the `hreflang` tags. Astro validates this metadata schema at build time: a missing or malformed field, and the site doesn't build.

The publishing cycle comes down to a few steps:

1. I create a branch and write the article in my editor.
2. I open a pull request: Vercel creates a preview deployment, and CI runs the tests.
3. I proofread the article in real conditions on the preview URL.
4. I merge into `main`: the article goes to production.

What I get out of it:

- **A complete history**: every change is a commit I can compare or revert.
- **Natural review**: the pull request is the ideal place to proofread, comment and fix.
- **No backend**: no database, no admin interface, no server to secure. The site stays fully static.
- **Tested content**: tests check, for example, that every article exists in both languages, that both versions share the same cover, or that titles fit the length shown in search results.
- **Instant rollback**, since every deployment is kept on Vercel.

But this simplicity has an obvious prerequisite: **being comfortable with Git, a code editor, Markdown syntax and the idea of a pull request**. For a developer, that's everyday life. For most people, it's an insurmountable barrier. And even among developers, running several regular authors on this model takes some discipline.

## Path 2: A Database and an Admin Interface, for Those Who Just Want to Write

Maître Biezunski's need was entirely different. She wanted to publish articles on her professional website without ever thinking about code: a visual editor, a "publish" button, and that's it. Asking her to open a pull request made no sense.

So I built a real backend, with **Django and Django REST Framework**, and a **PostgreSQL** database hosted on Neon. Articles no longer live in files but in the database, and the Next.js site fetches them through the API.

On the writing side, everything happens in a private admin interface, designed to be easier to pick up than the Django admin:

- **A Notion-style editor**: you write and format directly, without knowing the syntax. Behind the scenes, Markdown stays the source of truth, rendered and sanitized on the server.
- **Drafts and scheduled publishing**: an article stays a draft until it's published, and a future date schedules it.
- **Automatically processed images**: uploaded images are straightened, stripped of their metadata and converted to WebP.
- **Categories** that act as filters on the publications page.
- **Three roles** (administrator, editor, author) that define who can do what. The day the practice welcomes a colleague who wants to write, creating an account is all it takes.

Another big difference: publishing an article triggers no deployment. Content is served from the database, and the article shows up as soon as it's published.

### Writing From an AI Chat

I added a piece I wouldn't have imagined two years ago: **an `/mcp` endpoint**. It exposes the blog through the Model Context Protocol, so articles can be managed from any compatible AI chat, such as Claude Desktop. Listing, creating, editing, publishing or unpublishing an article happens in conversation.

Two safeguards frame this: an article created from a chat is a **draft by default**, and every action follows the **role of the token's owner**. Through the AI, an author can't do more than they could in the interface.

### The Price of Comfort

This solution obviously has a cost: a backend to host, a database to back up, an admin interface to secure, dependencies to update. Where my blog needs nothing more than static hosting, this one is a real application. To keep that load manageable, I relied on a solid test base: the front end's TypeScript types are generated from the API's OpenAPI schema, and the backend test suite fails below 90% coverage.

## Two Paths, Side by Side

| | Markdown files + Git | Database + admin interface |
|---|---|---|
| **For whom** | A developer comfortable with Git and code | Anyone who wants to write without the technical side |
| **Editing** | Code editor, Markdown syntax | Visual editor in the browser |
| **Publishing** | Pull request merged into `main` | "Publish" button or scheduled date |
| **Multiple authors** | Possible, but takes rigor | Built in, with roles |
| **Infrastructure** | Static site, no backend | API, database, image storage |
| **Maintenance** | Close to none | Real: updates, backups, security |
| **History** | Native, thanks to Git | To build if you need it |

## How to Choose?

Before talking technology, I now ask a few questions:

- **Who is going to write?** If the answer is "me, and I'm a developer", Markdown files are hard to beat. If it's someone who doesn't want to hear about Git, you need an interface.
- **How many authors, today and tomorrow?** A single author can live with almost anything. Several authors with different permissions call for role management.
- **How often?** One article a month doesn't necessarily justify an admin interface; a weekly post by a non-technical person does.
- **Who will maintain the system?** A backend needs maintenance. If no one is lined up to handle it, a simpler solution is the better bet.

None of this is set in stone. A blog can start with Markdown and move to a database the day new authors join. Since the content is Markdown in both cases, switching from one to the other stays reasonable.

## In Short

My blog and Maître Biezunski's meet the same need, publishing articles, with two opposite architectures. Neither is "the right one" in absolute terms: each fits the person who writes. That's the principle behind all my projects: the tool should adapt to its user, not the other way around.

Need to set up a blog or a publications space? [Let's talk](/en/contact/).
