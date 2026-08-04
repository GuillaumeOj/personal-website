---
title: "Dotcraft: Building an Open-Source QR Code Generator in a Few Hours with Claude Code"
description: "How I built Dotcraft, an open-source, privacy-first styled QR code editor, in a few hours with Claude Code — and why it stores everything in the browser."
pubDate: 2026-06-13
lang: en
slug: dotcraft-open-source-qr-code-generator-claude-code
translationKey: dotcraft
cover: ../../../assets/blog/dotcraft/cover.jpg
tags: []
---

I just needed a QR code. Styled, clean, with my logo in the center. A trivial request — except looking for one reminded me how the web is flooded with tools you don't really want to hand anything over to. Out of that frustration came [Dotcraft](https://dotcraft.fr), a QR code editor I built from A to Z, open source, in a few hours. Here's how, and above all why.

## The problem with online QR code generators

If you've ever searched "QR code generator" on Google, you know the drill. A dozen look-alike sites, plastered with ads, promising a "free" QR code… before asking you to create an account to download it, or slipping a subscription between you and your image.

Three things bothered me in particular:

First, trust. A QR code encodes a URL, sometimes more sensitive data. Generating it on some obscure site means handing over that information without knowing what's done with it. For such a simple tool, that's a lot of grey area.

Second, the mandatory account. On most of these services, the moment you want to keep your QR codes or find them again later, you have to sign up. You trade your data for a feature that, technically, needs no server at all.

Third, the output. Many generators spit out a raw, square QR code with no styling options whatsoever. Yet a QR code is also a design element: it deserves colors, module shapes consistent with a brand, a well-integrated logo.

## What Dotcraft does

Dotcraft is a styled QR code editor that runs entirely in the browser. You start from a URL or some text, then shape the result:

The **module shapes** can be square, rounded, circles, or dots. The QR code's **eyes** — the three large markers in the corners — can likewise be square, rounded, circular, or droplet-shaped, a form where each corner points toward the center of the code. You pick the **foreground and background colors**, adjust the margin, and you can drop a **logo** (PNG, JPG, or SVG) in the center, with its own background, padding, and rounded corners. When a logo is present, error correction automatically switches to the highest level so the code stays scannable.

At the end, you export to **PNG** (512, 1024, or 2048px) or to a self-contained **SVG**, ready to use anywhere.

## The real stance: no data leaves the browser

This is where Dotcraft stands apart. There's no account, no server, no remote database. Everything you create is saved locally, in your browser's `localStorage` and `IndexedDB`. Your QR codes stay on your machine, full stop.

That choice answers the original frustrations head-on. You can close the tab and find your creations again later, no sign-up required. Nothing is sent anywhere, so nothing is harvested. And since everything is computed client-side — the QR code is generated from its raw matrix, then drawn to SVG right in the page — the tool works even offline once loaded.

That left one classic downside of local storage: it's tied to a single browser. To get around it, Dotcraft lets you **export your data to a file**, then **re-import** it on another browser or another machine. You keep the simplicity of local storage, without being locked into it.

I also wanted the tool to hold up when you have a lot of QR codes to manage. So you can **organize them by projects and subfolders**, the way you'd sort files — one project per client, per campaign, whatever fits. It's the kind of comfort you almost never find in free generators.

## The making-of: A to Z in a few hours

The detail I care about most in this story is the speed of execution. Dotcraft went from idea to a working online tool in a few hours, leaning on Claude Code.

The stack is deliberately lightweight: **Vite + React + TypeScript**, deployed to Vercel as a static site. No backend to maintain, no environment variables, no infrastructure.

The very first version of Dotcraft, in fact, was nothing like a web app: it was a plain Python command-line script. As a backend Python developer, that was my natural reflex — and technically, it worked just fine. The problem is that a QR code is above all a **visual** object. Tweaking a color, trying a module shape, nudging a logo by a few pixels… doing all that by editing arguments and re-running the command to go open the generated image is frustratingly slow. As powerful as it is, a CLI is the wrong medium for iterating on design: you need to see the result change in real time.

That's exactly what drove the move to the web — and here, Claude Code changed my relationship with the project. Frontend isn't my most natural ground, and turning that script into a real visual editor would have been a job I'd probably have put off indefinitely. Being able to describe what I wanted, iterate on the geometry of the shapes, debug a stubborn SVG export, all through conversation, let me stay focused on product decisions instead of getting bogged down in implementation. Going from the Python CLI to a real web app took a single afternoon.

## An open-source project end to end

Beyond the tool itself, Dotcraft let me carry an **open-source project from A to Z**: thinking through the product, writing the code, documenting it, deploying it, and making it public. The repository is available on [GitHub](https://github.com/GuillaumeOj/dotcraft) — the code is readable, the README explains the architecture, and anyone can draw inspiration from it, fork it, or contribute.

It's also a way to close the loop on my initial frustration. Rather than yet another opaque generator, I wanted a tool you can literally verify isn't doing anything behind your back. The code is open, storage is local, and there's no account to create.

## In short

Dotcraft was born from a trivial need and a very real annoyance: generating a good-looking QR code without handing over your data or creating an account. It first went through a Python script — effective, but frustrating for shaping something so visual — before becoming a true web editor. The result is a styled, privacy-friendly tool, organizable by projects, exportable, and open source — built in a few hours with the help of Claude Code.

If you have a QR code to create, [give Dotcraft a try](https://dotcraft.fr). And if the tech side interests you, the [code is on GitHub](https://github.com/GuillaumeOj/dotcraft).
