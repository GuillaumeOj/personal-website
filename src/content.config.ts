import { defineCollection } from 'astro:content';
import { notionLoader, notionPageSchema } from '@astro-notion/loader';
import { transformedPropertySchema } from '@astro-notion/loader/schemas';
import type { Loader } from 'astro/loaders';
import { z } from 'astro/zod';

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
    tags: transformedPropertySchema.multi_select.optional(),
    draft: transformedPropertySchema.checkbox,
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
      slug: page.properties.slug,
      tags: page.properties.tags ?? [],
      draft: page.properties.draft,
      cover,
    };
  }),
});

export const collections = { blog };
