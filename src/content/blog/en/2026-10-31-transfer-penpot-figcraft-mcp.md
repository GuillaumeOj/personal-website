---
title: "From Penpot to FigCraft: Moving a 100-Screen Design with Claude Code and MCP"
description: "Figma, Penpot, then FigCraft: why I switched design tools, how to install FigCraft and its MCP server, and how Claude Code migrated 100 screens without pushing them through the conversation."
seoTitle: "Move a Design from Penpot to FigCraft Using MCP"
seoDescription: "Migrating 9 pages, 100 screens and 49 components from Penpot to FigCraft with Claude Code: MCP setup, method, pitfalls and a ready-to-use prompt."
pubDate: 2026-10-31
lang: en
slug: transfer-design-penpot-figcraft-mcp
translationKey: penpot-to-figcraft
cover: ../../../assets/blog/penpot-figcraft/cover.jpg
coverCredit:
  author: Salah Ait Mokhtar
  authorUrl: https://unsplash.com/@motosha
  url: https://unsplash.com/photos/a-laptop-computer-sitting-on-top-of-a-wooden-desk--Px5V6LDxCo
tags: ["Penpot", "FigCraft", "MCP", "Claude", "Design"]
---

## Why switch design tools?

I've already told the story of [how I opened Figma for the first time with Claude](/blog/backend-developer-figma-claude/). Since then my design tool has changed twice. Here's why, since that's how I ended up having to move a 100-screen file from one tool to another.

### Figma: an MCP server that's too limited

I started with Figma, like everyone else. But I work with Claude every day, and for the AI to be really useful it has to **read from and write to the tool**. That's the job of an MCP server.

[Figma's MCP server](https://developers.figma.com/docs/figma-mcp-server/) exists, but its rate limits are tight, **even on a paid plan**:

| Seat | Starter | Professional | Organization | Enterprise |
| --- | --- | --- | --- | --- |
| View, Collab | Up to 20 per month | Up to 20 per month | Up to 20 per month | Up to 20 per month |
| Full, Dev | — | Up to 200 per day, 10 per minute | Up to 200 per day, 15 per minute | Up to 600 per day, 20 per minute |

When an agent chains calls to build screens, you hit those ceilings fast.

### Penpot: an excellent open source tool

I turned to [Penpot](https://penpot.app/) and wasn't disappointed. It's full-featured **open source** software and, above all, it has real MCP support: you can read a file, run code through its plugin API, create components… exactly what I needed.

### But Penpot renders slowly

The flip side: on large files, **Penpot's rendering is slow**. It's a known issue and the team is working on [a new rendering system](https://penpot.app/blog/penpots-new-rendering-system/), but at the time of writing it doesn't solve my case. With around 100 screens in light and dark modes, it gets painful.

### FigCraft: faster and lighter

That's when I found [FigCraft](https://github.com/storytold/figcraft), a newcomer from the [ArtCraft](https://getartcraft.com) team, who also make [PhotoCraft](https://getartcraft.com/apps/photocraft) and [DesignCraft](https://getartcraft.com/apps/designcraft). Its **rendering engine is more efficient and far less resource-hungry**: the same file stays smooth where Penpot struggles. And it exposes an MCP server too.

The catch: my design already lived in Penpot. Hence this article.

## Installing FigCraft and its MCP server

Installation is simple, but there's a catch: to open the control port, you have to start the application **from the binary the Rust build produces, not from the `.app`**. Here's the order that worked for me, from a clone of the [repository](https://github.com/storytold/figcraft) checked out at the latest release tag.

1. **Build the CLI**, which doubles as the MCP server:

   ```bash
   cargo build --release -p figcraft-cli
   ```

2. **Add both MCP servers to Claude Code**, as described in the project's [MCP documentation](https://github.com/storytold/figcraft/blob/main/docs/mcp.md) (adjust the path to your built CLI):

   ```bash
   claude mcp add figcraft -- /path/to/target/release/figcraft-cli mcp
   claude mcp add figcraft-app -- /path/to/target/release/figcraft-cli mcp --attach 7979
   ```

3. **Build and launch the application with the control port open**:

   ```bash
   cargo run --release -p figcraft -- --control 7979
   ```

   The `--control 7979` option opens the control port; without it, the MCP server can't drive the running app.

Once that's done, Claude Code sees two FigCraft servers: `figcraft` works **headless** (no window, on an in-memory document), `figcraft-app` **drives the running app** at `127.0.0.1:7979`. I also kept `penpot` connected to read the source.

## The problem: 100 screens to move

My Penpot file contained:

- 9 pages;
- about 100 screens, in light and dark;
- 49 components;
- color and spacing tokens.

The goal: a FigCraft file where components are **real components**, screens **reference** them, and light and dark share **one set of variables**.

## Why you shouldn't push everything through the conversation

The obvious approach is to use the two MCP servers as a pipe: the agent reads a page in Penpot, then writes the same structure into FigCraft with batch commands.

The problem is volume. One screen is about 30 KB of data, which the agent reads from Penpot and then sends back out as commands to FigCraft: roughly 60 KB of context per screen. Across 100 screens that's around 6 MB, well beyond what a context window holds, and every byte is paid for twice.

For small pieces this approach is perfectly fine. The foundation (pages, variables, 49 components, one showcase page) is light, so Claude Code recreated it directly through the MCP tools, components included.

## The fix: keep the bulk data out of the conversation

The principle: only scripts and file paths go through the agent, never the data itself. Two facts make that possible:

1. **Penpot's plugin API runs your JavaScript and returns the result.** When the result is too large for the model, the tool saves it to a file on disk and returns only a short message. So a script can dump an entire page and the agent never reads it.
2. **FigCraft can import a Figma-REST-style JSON file**, with pages, components, instances, auto layout, vectors, variable bindings and modes, through `file.import`.

With the foundation in place, the bulk transfer takes four steps.

### 1. Export from Penpot

One `execute_code` call per page serializes every shape into a compact tree: absolute position, size, fills and strokes, radii, shadows, text properties, path data, flex layout and layout-child sizing. Each result is written to disk by the tool.

### 2. Convert with a script

A Python converter reads those files and writes one REST-format file. It:

- turns shapes into frames, text, vectors and groups, with auto layout;
- converts paths to node-local coordinates;
- finds the 49 main Penpot components by name and position, already recreated in FigCraft;
- turns every drawn icon (`Icons / Tool / …`, `Icons / UI / …`) into an **instance** of the matching component;
- binds fills and strokes to the Light/Dark color variables by matching the hex value, and sets the Dark mode on every board whose name ends in "dark".

### 3. Import into the target file

`file.import` takes the converted file **together with the variables JSON exported from the target**, so that bindings resolve against the existing variables.

### 4. Verify and fix

Compare screenshots with the Penpot source, then fix issues in place.

## Lessons that cost me time

- **Stroke geometry.** If you give the importer both fill and stroke geometry for a stroke-only path, it renders the stroke outline as a filled shape. Icons come out as black blobs. Export only the fill geometry, and let the importer draw real strokes from the stroke properties.
- **Instance size.** The importer ignores an instance's own size and its children's geometry and takes the main component's. Instances that differ in size (81 of them here) need a resize after import. To find them: imported node IDs follow the converter's output order, so you can compute each one from a single known offset.
- **Scaling.** Set the constraints of the glyphs inside each component to Scale; otherwise resized instances end up with strokes that no longer fit.
- **Component detection.** Each icon board appears both as a plain drawing inside showcase cards and as the actual main component. Match on name plus position, keep only the first occurrence, and skip nested ones.
- **Re-importing appends pages.** Delete the previous import's pages each time to keep the file clean. Fixing a converter bug means re-importing, which is cheap once the pipeline exists.
- **Large tool outputs.** Dumping every variable or component into the conversation is wasteful. Prefer scripts that write to disk.

## What's still missing

In the Penpot file, screens didn't use the components, so only icons became instances. Buttons, tags and rows remain plain frames. Detecting repeated patterns and swapping them for instances would be a separate pass. Text styles, token bindings for spacing and radius, and text with mixed styles were also left out.

## How to ask Claude Code to do it

Here's my original prompt, updated with what I learned, so the agent takes the efficient route from the start. Replace the placeholders in angle brackets with your own paths and names.

> I created `<path>/<MyProject>.figcraft`. Move all the design from my Penpot file to it, using the `penpot`, `figcraft` and `figcraft-app` MCP servers.
>
> **Requirements**
> - Keep the Penpot page names.
> - Recreate the components as real components, and make the screens reference them as instances wherever a drawing matches a component.
> - Recreate the Light/Dark tokens as FigCraft variables and bind colors to them. Boards whose name ends in "dark" use the Dark mode.
>
> **Method (don't send large data through the conversation)**
> 1. Create the variables, the empty structure and the components first (small).
> 2. Dump each Penpot page with one `execute_code` call that returns a compact JSON tree. When the result is too large, the tool saves it to disk. Work from those files only.
> 3. Write a Python converter that builds a Figma-REST-style JSON file with instances of the existing components, auto layout, vector fill geometry (no stroke geometry), and variable bindings. Import it with `file.import`, passing the exported variables JSON.
> 4. After the import, fix what the importer ignores (instance sizes, Scale constraints on component glyphs), then delete the pages of any superseded import.
> 5. Verify with screenshots against Penpot, then save.
>
> Tell me what is left undone at the end, including what you couldn't check.

Two parts of this prompt do most of the work. The "Method" section spares the agent from rediscovering, at great context cost, that pushing 60 KB per screen through the conversation doesn't scale. And the last sentence forces an honest report: on a migration this size, that's what separates a file that's "done" from one you can actually use.

## What I take away

The transfer works, but the real lesson isn't about the tools; it's about understanding **where the data flows**. As long as the agent acts as a pipe, you pay for every byte twice in context. Once it writes scripts that read from and write to disk, moving 100 screens becomes a handful of commands, and fixing a converter bug just means re-running the import.

It's the same rule as in development: don't do by hand, or through an LLM, what a script does better.
