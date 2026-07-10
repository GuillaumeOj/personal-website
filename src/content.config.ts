import { defineCollection } from "astro:content";
import { notionLoader, notionPageSchema } from "@astro-notion/loader";
import {
  propertySchema,
  transformedPropertySchema,
} from "@astro-notion/loader/schemas";
import type { Loader } from "astro/loaders";
import { z } from "astro/zod";
import { SITE } from "./config";
import {
  uploadAvatarIfMissing,
  uploadNotionFileIfMissing,
} from "./lib/blob-images";

type RawPeopleProperty = z.infer<typeof propertySchema.people>;
type RawNotionUser = {
  id: string;
  name?: string | null;
  avatar_url?: string | null;
};

const authorSchema = propertySchema.people.transform(
  async (property: RawPeopleProperty) => {
    const first = property.people[0] as RawNotionUser | undefined;
    if (!first?.name) return undefined;
    const avatarUrl = first.avatar_url
      ? await uploadAvatarIfMissing(first.avatar_url)
      : null;
    return { name: first.name, avatarUrl };
  },
);

function buildBlogLoader(): Loader {
  const auth = import.meta.env.NOTION_TOKEN;
  const database_id = import.meta.env.NOTION_DATABASE_ID;
  if (!auth || !database_id) {
    return {
      name: "notion-loader-stub",
      load: async () => {},
    };
  }
  const loader = notionLoader({
    auth,
    database_id,
    filter: { property: "draft", checkbox: { equals: false } },
    sorts: [{ property: "pubDate", direction: "descending" }],
  });
  delete (loader as { schema?: unknown }).schema;

  // The loader downloads body images to `src/assets/images/notion/…` and records
  // them as `assetImports` in the content store. We never use the loader's
  // rendered HTML — bodies are re-rendered through Vercel Blob in
  // `renderPostBody` — but Astro's content-assets plugin still resolves every
  // recorded path at build time. Those local files aren't committed and aren't
  // re-downloaded when the store is served from a build cache, so resolution
  // fails (ImageNotFound). Drop `rendered`/`assetImports` before they land in
  // the store; only the frontmatter `data` is needed.
  const originalLoad = loader.load.bind(loader);
  loader.load = (ctx) => {
    const patchedStore = new Proxy(ctx.store, {
      get(target, prop, receiver) {
        if (prop === "set") {
          return (entry: Parameters<typeof target.set>[0]) =>
            target.set({
              ...entry,
              rendered: undefined,
              assetImports: undefined,
            });
        }
        const value = Reflect.get(target, prop, receiver);
        return typeof value === "function" ? value.bind(target) : value;
      },
    });
    return originalLoad({ ...ctx, store: patchedStore });
  };

  return loader;
}

const pageSchema = notionPageSchema({
  properties: z.object({
    Name: transformedPropertySchema.title,
    description: transformedPropertySchema.rich_text,
    pubDate: transformedPropertySchema.date,
    lang: transformedPropertySchema.select,
    slug: transformedPropertySchema.rich_text,
    translationKey: transformedPropertySchema.rich_text,
    tags: transformedPropertySchema.multi_select.optional(),
    draft: transformedPropertySchema.checkbox,
    author: authorSchema.optional(),
  }),
});

type NotionPage = z.infer<typeof pageSchema>;

const blog = defineCollection({
  loader: buildBlogLoader(),
  schema: pageSchema.transform(async (page: NotionPage) => {
    const lang = page.properties.lang;
    if (lang !== "fr" && lang !== "en") {
      throw new Error(
        `Notion page has invalid lang "${lang}" (expected fr|en)`,
      );
    }
    const slug = page.properties.slug;
    const translationKey = page.properties.translationKey;
    if (!page.properties.draft && !translationKey) {
      throw new Error(
        `Notion page "${page.properties.Name}" (slug "${slug}") is missing the translationKey property — set a shared key on FR/EN pairs`,
      );
    }
    const pubDate = page.properties.pubDate?.start ?? new Date();
    // Covers live only on the primary-locale version of each article; other
    // languages inherit it at query time (see `withPrimaryLocaleCovers` in
    // `lib/posts.ts`). Skip resolving/uploading covers for other locales.
    let cover: string | undefined;
    if (lang === SITE.defaultLocale && page.cover) {
      cover =
        page.cover.type === "external"
          ? page.cover.external.url
          : await uploadNotionFileIfMissing(page.cover.file.url);
    }
    return {
      title: page.properties.Name,
      description: page.properties.description,
      pubDate,
      lang,
      slug,
      translationKey,
      tags: page.properties.tags ?? [],
      draft: page.properties.draft,
      cover,
      author: page.properties.author,
    };
  }),
});

export const collections = { blog };
