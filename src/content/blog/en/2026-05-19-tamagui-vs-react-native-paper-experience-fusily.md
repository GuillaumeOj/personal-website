---
title: "Tamagui vs React Native Paper: why I switched UI frameworks on Fusily"
description: "A look back at the UI framework choice on Fusily: from Tamagui to React Native Paper, and why I eventually split mobile and web."
pubDate: 2026-05-19
lang: en
slug: tamagui-vs-react-native-paper-experience-fusily
translationKey: tamagui-paper
cover: ../../../assets/blog/tamagui-paper/cover.jpg
tags: []
---

Choosing a UI framework in React Native is one of those decisions you make early in a project, somewhat hastily, and sometimes regret for a long time. On Fusily, I went through exactly that: Tamagui first, then React Native Paper. Here's why.

## Tamagui, the framework that promised everything

Before starting development, I did what most developers do: browsed comparisons, lurked on a few sub-reddits, read experience reports. That's where Tamagui showed up on my radar.

The pitch was hard to ignore: a UI framework designed to work across both mobile (React Native / Expo) and the web, with a static compiler meant to boost performance. For a solo project or a small team, the idea of a single component base to cover everything is obviously tempting.

I integrated Tamagui and started building.

## A few months in

Problems surfaced gradually, then with increasing frequency.

First, the updates. Updating Tamagui was never straightforward — each new version brought its share of regressions. Components I had used everywhere would get deprecated overnight, sometimes without a clear changelog explaining what to do next. I spent entire afternoons fixing things that had worked perfectly fine the week before.

There was also the dependency management issue. The Tamagui ecosystem is split across dozens of packages that must all be on the same version. The slightest mismatch — often introduced by another project dependency — triggered cryptic errors that were hard to trace. On an Expo project, that's an extra layer of complexity you really don't need.

After a while, I did the math: too much of my time was going into managing the library rather than building the product. That's not sustainable.

## Switching to React Native Paper

The migration to **React Native Paper** wasn't instantaneous, but the difference showed fairly quickly.

React Native Paper is a Material Design library maintained by Callstack — a serious team, well-established in the React Native ecosystem. What changes in practice: APIs move rarely, breaking changes are infrequent and clearly documented, the community is large. You update, it works.

On paper, I was giving up built-in cross-platform support. In practice, it was an artificial constraint: trying to cover both mobile and web with a single framework, at the maturity stage Tamagui was at, cost me more than it ever gave back.

|  | Tamagui | React Native Paper |
| --- | --- | --- |
| Maturity | Still young | Solid |
| Breaking changes | Frequent | Rare, well documented |
| Cross-platform | Mobile + Web | Mobile |
| Dependency management | Constraining | Simple |
| Documentation | Inconsistent | Complete |

## What I use today

Rather than chasing a single tool that does everything, I opted for the right tool in the right place:

- **Mobile**: React Native + Expo + React Native Paper
- **Web**: Next.js + Tailwind CSS

It's perhaps less elegant in theory, but far more pleasant to maintain. Each part of the stack is stable, well-documented, and I no longer have to manage cross-layer incompatibilities.

## What I'd have done differently

Looking back, a few instincts I wish I'd developed earlier:

**Check the release history before committing.** The frequency and nature of breaking changes tell you far more about a library's real maturity than a polished README ever will.

**Be wary of cross-platform promises.** Covering both mobile and web from a single component base is a legitimate goal — but not all solutions that advertise it are equally ready. It's worth digging in.

**Test on a real use case.** Not a hello world, but a few screens close to what you'll actually build. Development friction shows up fast.

**Look at who's behind it.** A library maintained by an identifiable, active team in the ecosystem (Callstack, Software Mansion, Expo…) offers more continuity guarantees than a project maintained on the fly.

The best UI library is the one that disappears. The one you stop noticing because it just does its job.
