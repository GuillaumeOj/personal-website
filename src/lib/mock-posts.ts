import type { CollectionEntry } from "astro:content";

type BlogData = CollectionEntry<"blog">["data"];

const guillaume = {
  name: "Guillaume Ojardias",
  avatarUrl:
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop",
};

const guest = {
  name: "Alice Martin",
  avatarUrl: null,
};

const FR_BODY = `
  <h2>Introduction</h2>
  <p>Ceci est un article fictif servi en l'absence d'un jeton Notion. Il existe pour vérifier le rendu en local et lors des tests.</p>
  <p>Quelques exemples de rendu :</p>
  <ul>
    <li>Liste à puces</li>
    <li>Mise en forme <strong>en gras</strong> et <em>en italique</em></li>
    <li>Un peu de <code>code en ligne</code></li>
  </ul>
  <h2>Bloc de code</h2>
  <pre><code>const greet = (name) =&gt; \`Bonjour, \${name} !\`;</code></pre>
  <h2>Conclusion</h2>
  <p>Ce contenu n'est jamais affiché en production : il dépend de l'absence de la variable <code>NOTION_TOKEN</code>.</p>
`;

const EN_BODY = `
  <h2>Introduction</h2>
  <p>This is a fixture article served when no Notion token is configured. It exists so the local stack and tests have something to render.</p>
  <p>Examples of rendered formatting:</p>
  <ul>
    <li>Bulleted list</li>
    <li><strong>Bold</strong> and <em>italic</em> text</li>
    <li>A bit of <code>inline code</code></li>
  </ul>
  <h2>Code block</h2>
  <pre><code>const greet = (name) =&gt; \`Hello, \${name}!\`;</code></pre>
  <h2>Conclusion</h2>
  <p>This content never appears in production: it is gated on the absence of <code>NOTION_TOKEN</code>.</p>
`;

const mock = (id: string, data: BlogData, html: string) => ({
  post: { id, collection: "blog", data } as unknown as CollectionEntry<"blog">,
  html,
});

const entries = [
  mock(
    "mock-fr-astro",
    {
      title: "Pourquoi Astro pour ce blog",
      description:
        "Retour d’expérience sur le choix d’Astro pour un site statique multilingue connecté à Notion.",
      pubDate: new Date("2026-04-15"),
      lang: "fr",
      slug: "pourquoi-astro",
      translationKey: "why-astro",
      tags: ["astro", "notion"],
      draft: false,
      cover:
        "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=1200&h=675&fit=crop",
      author: guillaume,
    },
    FR_BODY,
  ),
  mock(
    "mock-fr-i18n",
    {
      title: "Astro et l’internationalisation",
      description:
        "Comment configurer i18n avec Astro 6, et comment relier des paires d’articles en deux langues.",
      pubDate: new Date("2026-03-20"),
      lang: "fr",
      slug: "i18n-avec-astro",
      translationKey: "i18n-astro",
      tags: ["astro", "i18n"],
      draft: false,
      cover:
        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=675&fit=crop",
      author: guest,
    },
    FR_BODY,
  ),
  mock(
    "mock-fr-tailwind",
    {
      title: "Tailwind CSS sans cover",
      description:
        "Cas de test sans image de couverture — vérifie le dégradé par défaut de la carte.",
      pubDate: new Date("2026-02-10"),
      lang: "fr",
      slug: "tailwind-sans-cover",
      translationKey: "tailwind-no-cover",
      tags: ["tailwind"],
      draft: false,
      cover: undefined,
      author: guillaume,
    },
    FR_BODY,
  ),
  mock(
    "mock-fr-orphan",
    {
      title: "Article sans auteur",
      description:
        "Cas de test sans auteur — vérifie le rendu lorsque la propriété author est absente.",
      pubDate: new Date("2026-01-05"),
      lang: "fr",
      slug: "sans-auteur",
      translationKey: "orphan",
      tags: [],
      draft: false,
      cover:
        "https://images.unsplash.com/photo-1506765515384-028b60a970df?w=1200&h=675&fit=crop",
      author: undefined,
    },
    FR_BODY,
  ),
  mock(
    "mock-en-astro",
    {
      title: "Why Astro for this blog",
      description:
        "A short retrospective on picking Astro for a multilingual static site backed by Notion.",
      pubDate: new Date("2026-04-15"),
      lang: "en",
      slug: "why-astro",
      translationKey: "why-astro",
      tags: ["astro", "notion"],
      draft: false,
      // No cover: inherited from the FR sibling via `withPrimaryLocaleCovers`.
      cover: undefined,
      author: guillaume,
    },
    EN_BODY,
  ),
  mock(
    "mock-en-i18n",
    {
      title: "Astro and internationalisation",
      description:
        "Setting up i18n in Astro 6 and linking translation pairs together.",
      pubDate: new Date("2026-03-20"),
      lang: "en",
      slug: "i18n-with-astro",
      translationKey: "i18n-astro",
      tags: ["astro", "i18n"],
      draft: false,
      // No cover: inherited from the FR sibling via `withPrimaryLocaleCovers`.
      cover: undefined,
      author: guest,
    },
    EN_BODY,
  ),
];

export const mockPosts: CollectionEntry<"blog">[] = entries.map((e) => e.post);

const mockHtmlById = new Map(entries.map((e) => [e.post.id, e.html]));

export function getMockHtml(post: CollectionEntry<"blog">): string | undefined {
  return mockHtmlById.get(post.id);
}

export const useMocks = !import.meta.env.NOTION_TOKEN;
