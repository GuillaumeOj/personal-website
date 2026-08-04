---
title: "No, AI Doesn't Make You a Developer"
description: 'Two people, two jobs with nothing to do with code, one shared idea: "why pay a developer when AI can do it?" One wanted a custom tool to run their business; the other, to rebuild their company''s website. Both went it alone, carried along by the promises of AI. Spoiler: it didn''t end well. Two stories of failure — and what they reveal.'
pubDate: 2026-07-09
lang: en
slug: ai-doesnt-make-you-a-developer
translationKey: ia-developpeur
cover: ../../../assets/blog/ia-developpeur/cover.jpg
tags: []
---

Let me be upfront before we start: I'm a developer. So yes, feel free to read me with that in mind — it's fair. But this isn't a plea to protect my livelihood. I use AI every day and I'm the first to sing its praises. What interests me here is something else: the line — often invisible — between what AI does brilliantly and what it can't yet do on its own.

## So what actually went wrong?

### Case #1: the order-management tool

The first person wanted a professional tool to make their week easier: tracking orders, creating orders, managing stock, even automatically adjusting quantities based on the weather forecast. A proper little business application, in other words.

They turned to Google AI Studio. The pitch is appealing: a whole suite of tools to carry a coding project from the first idea all the way to deployment. On paper, it's tempting — and I'll admit I've never tried it myself.

At first, everything runs smoothly. The interface comes together in no time, the buttons respond, actions follow one another. Then the real requirements show up: connecting the app to an API to place orders, pulling in weather data, sending emails and texts. Inside the Google AI Studio environment, it all works. But the moment it's deployed, everything falls apart. The build spits out errors no one understands, the API calls stop going through. In short, nothing works anymore.

That's when they reach out to me to figure out what's going on. My first questions: how are you calling your provider's API? How are you authenticating? Have you ever managed to run the app locally? You can see the answer coming, can't you?

Silence. They had "just asked Gemini to connect to such-and-such endpoint." The rest, they had no idea. And that's perfectly normal — it's not their job! We're still talking about a tool that manages a database, talks to external APIs, and relies on third-party services to send emails and texts. Nothing insurmountable for a developer, but it does take some baseline knowledge. This isn't a static web page; it's an application, with all the technical layers that implies. And even then — even a plain static page has its traps.

### Case #2: the company website

See what I did there? :)

Second case: a professional who wants to rebuild the marketing website for their business. The old one is ten years old, falling apart, out of date, barely anything still works. A textbook case. They get in touch so we can discuss what I could offer.

The first meeting falls through: they don't show up — an emergency on a file. Fair enough; nothing about the website is urgent, the business comes first. A few days later, they ask me for a ballpark price — which I made the mistake of giving. Then the verdict drops: "We're going to find something cheaper." Translation: "We'll do it ourselves with Claude Code."

Out of curiosity, I check the result some time later. At first glance, it's clean, it does the job. And that's exactly the trap: what's wrong is precisely what an untrained eye can't see. Look a little closer and you spot a string of things a seasoned developer would never have let slide:

- contrast too weak between elements and the background in several places, including on call-to-action buttons;
- uncompressed team photos that drag down the page's load time;
- a messy page structure that makes the site hard to read for visitors;
- legal notices and a privacy policy dropped right in the middle of the page, between the contact form and the pricing — which, beyond the visual clutter, raises a real problem of compliance and readability;
- a mobile menu that becomes invisible when you tap it;
- not a single basic rule applied to help with search-engine ranking (SEO);
- and a few other slip-ups I'll spare you.

And that's where it hurts. Taken one by one, these mistakes look minor. Stacked together, they sink the site's SEO: a load time that's too long, a page structure a search engine can't read, a broken mobile display, no basic optimization at all — these are exactly the criteria Google uses to decide whether to show you or bury you. The result: a site that's practically impossible to find. And a marketing website nobody can find is a website that serves no purpose. I should say I'm very far from being an SEO expert — and that's precisely what makes the point land: if even I spot these flaws at first glance, the algorithm certainly won't forgive them.

The bottom line? They must have spent close to a full day on it. For a business that likely bills somewhere around €300 to €400 an hour. I'll let you do the math — the "saving" isn't really one anymore.

In both cases, the same trap: what truly matters is exactly what you can't see. The screen may look functional, but the essentials play out underneath.

## An honest objection, before we go on

I can hear it coming: two failures don't make a case. You're right. How many tradespeople have shipped a perfectly decent website with AI and never called me, precisely because it worked? Those, I don't see — by definition, only the cases that broke find their way back to me. So these two stories don't prove it fails every time. They show something subtler: it fails where you don't expect it, on the very things an untrained eye can't check.

## A quick reality check on AI (because I'm no AI skeptic)

Let's be clear: I'm not knocking it. All over social media, enthusiasts proclaim that AI let them ship projects end to end in a matter of hours, that developers add no value anymore in 2026, that the industry is about to be transformed. And on the substance, they're not wrong.

Personally, I haven't hand-written a line of code since January 2026. So yes, the developer's job as we knew it has already fundamentally changed — faster or slower depending on the company. Developers will likely move up a level: focusing on business logic, refining the user experience, keeping an eye on performance. Gone are the endless coding marathons to ship a feature; gone are the hours of investigation to track down a bug.

But here's the crux of it, and it's what explains the difference between them and me: **AI doesn't replace the developer — it amplifies the one who already knows.** If I code ten times faster than before, it's not because AI thinks for me; it's because I know what to ask it, I can spot when it's wrong, and I can course-correct before anything hits production. Take that supervision away and the tool produces exactly what we saw above: something that looks like it works. AI is still a tool, not an autonomous intelligence. We can probably push agent autonomy even further — but at a cost I, personally, can't take on.

## So what's the takeaway?

Let's not put the wrong thing on trial. AI is a remarkable tool — just as Google or Wikipedia were when they arrived. But it's a tool. You don't hand a lathe to someone who's never touched one and expect them to turn out a part for a Formula 1 engine.

For anyone outside the world of development, AI is an incredible opportunity: giving shape to a tech-product idea in record time, getting a visual that speaks for itself. And then an excellent basis for a conversation with someone who does this for a living.

But make no mistake: just because an application looks simple on screen doesn't mean it's simple under the hood. There are rules to respect — around security, accessibility, search ranking, usability — and those are exactly what separate a demo from a reliable product.

So, concretely, what do you do? Use AI for what it does best: prototyping, exploring, giving an idea enough shape to make it tangible. Then, before you put anything online or in your customers' hands, have the work audited — or simply taken over — by someone who does this professionally. You keep the speed of the first draft without inheriting the invisible traps.

Because in the end, it remains essential — and will for a long time yet — to call on a professional. Someone who can guide you and put durable systems in place, genuinely fit for your needs. AI gives you the first draft. The professional gives you what lasts.
