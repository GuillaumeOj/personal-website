import { defineCollection } from 'astro:content';
import { notionLoader, notionPageSchema } from '@astro-notion/loader';
import {
  propertySchema,
  transformedPropertySchema,
} from '@astro-notion/loader/schemas';
import type { Loader } from 'astro/loaders';
import { z } from 'astro/zod';

type RawPeopleProperty = z.infer<typeof propertySchema.people>;
type RawNotionUser = {
  id: string;
  name?: string | null;
  avatar_url?: string | null;
};

const authorSchema = propertySchema.people.transform(
  (property: RawPeopleProperty) => {
    const first = property.people[0] as RawNotionUser | undefined;
    if (!first?.name) return undefined;
    return { name: first.name, avatarUrl: first.avatar_url ?? null };
  },
);

function buildBlogLoader(): Loader {
  const auth = import.meta.env.NOTION_TOKEN;
  const database_id = import.meta.env.NOTION_DATABASE_ID;
  if (!auth || !database_id) {
    return {
      name: 'notion-loader-stub',
      load: async () => {},
    };
  }
  const loader = notionLoader({
    auth,
    database_id,
    filter: { property: 'draft', checkbox: { equals: false } },
    sorts: [{ property: 'pubDate', direction: 'descending' }],
  });
  delete (loader as { schema?: unknown }).schema;
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
  schema: pageSchema.transform((page: NotionPage) => {
    const lang = page.properties.lang;
    if (lang !== 'fr' && lang !== 'en') {
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
    let cover: string | undefined;
    if (page.cover) {
      cover =
        page.cover.type === 'external'
          ? page.cover.external.url
          : page.cover.file.url;
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
