import { describe, expect, it } from "vitest";
import { typeset, typesetHtml } from "../../src/lib/typography";

const NBSP = "\u00a0";
const NNBSP = "\u202f";

describe("typeset (fr)", () => {
  it("binds high punctuation to the previous word", () => {
    expect(typeset("Un projet ? Parlons-en !", "fr")).toBe(
      `Un projet${NNBSP}? Parlons-en${NNBSP}!`,
    );
    expect(typeset("Stack : Astro ; Vercel", "fr")).toBe(
      `Stack${NBSP}: Astro${NNBSP}; Vercel`,
    );
  });

  it("adds the missing space before a closing ? ! ;", () => {
    expect(typeset("Combien coûte votre projet?", "fr")).toBe(
      `Combien coûte votre projet${NNBSP}?`,
    );
    expect(typeset("Vraiment?! Oui.", "fr")).toBe(`Vraiment${NNBSP}?! Oui.`);
    expect(typeset("web &amp; mobile, l&#39;IA", "fr")).toBe(
      "web &amp; mobile, l’IA",
    );
  });

  it("leaves URLs and times alone", () => {
    expect(typeset("voir /contact/?type=web à 10:30", "fr")).toBe(
      "voir /contact/?type=web à 10:30",
    );
  });

  it("binds numbers to their unit and groups thousands", () => {
    expect(typeset("réponse sous 24 h, 100 % côté client", "fr")).toBe(
      `réponse sous 24${NBSP}h, 100${NBSP}% côté client`,
    );
    expect(typeset("dès 1 500 €", "fr")).toBe(`dès 1${NNBSP}500${NBSP}€`);
    expect(typeset("en 3 heures", "fr")).toBe("en 3 heures");
    // Every group of a long number is bound, not just the first.
    expect(typeset("SIREN : 993 870 955", "fr")).toBe(
      `SIREN${NBSP}: 993${NNBSP}870${NNBSP}955`,
    );
  });

  it("spaces guillemets and converts English quotes", () => {
    expect(typeset("« islands »", "fr")).toBe(`«${NNBSP}islands${NNBSP}»`);
    expect(typeset("les “islands” d’Astro", "fr")).toBe(
      `les «${NNBSP}islands${NNBSP}» d’Astro`,
    );
  });

  it("curls apostrophes between letters", () => {
    expect(typeset("Comment j'ai appris l'IA", "fr")).toBe(
      "Comment j’ai appris l’IA",
    );
  });
});

describe("typeset (en)", () => {
  it("curls apostrophes but keeps English spacing", () => {
    expect(typeset("AI doesn't make you a developer?", "en")).toBe(
      "AI doesn’t make you a developer?",
    );
    expect(typeset("Stack : 24 h", "en")).toBe("Stack : 24 h");
  });
});

describe("typesetHtml", () => {
  it("typesets text and prose attributes, decoding escaped apostrophes", () => {
    const html =
      '<h1 class="page-title">Comment j&#39;ai fait ?</h1>' +
      '<img alt="L&#39;écran : accueil" src="/a?b=c">' +
      '<meta name="description" content="Réponse sous 24 h !">';
    expect(typesetHtml(html, "fr")).toBe(
      `<h1 class="page-title">Comment j’ai fait${NNBSP}?</h1>` +
        `<img alt="L’écran${NBSP}: accueil" src="/a?b=c">` +
        `<meta name="description" content="Réponse sous 24${NBSP}h${NNBSP}!">`,
    );
  });

  it("never touches code, scripts or JSON-LD", () => {
    const html =
      "<p>Exemple :</p><pre><code>if (a) { b ? c : d }</code></pre>" +
      '<script type="application/ld+json">{"name":"j\'ai ?"}</script>' +
      "<script>const x = a ? 'b' : 'c';</script><code>l'API ?</code>";
    expect(typesetHtml(html, "fr")).toBe(
      `<p>Exemple${NBSP}:</p><pre><code>if (a) { b ? c : d }</code></pre>` +
        '<script type="application/ld+json">{"name":"j\'ai ?"}</script>' +
        "<script>const x = a ? 'b' : 'c';</script><code>l'API ?</code>",
    );
  });
});
