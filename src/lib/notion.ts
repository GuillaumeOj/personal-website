import type { CollectionEntry } from 'astro:content';
import bookmarkPlugin from '@notion-render/bookmark-plugin';
import { NotionRenderer } from '@notion-render/client';
import hljsPlugin from '@notion-render/hljs-plugin';
import { Client } from '@notionhq/client';
import { uploadNotionFileIfMissing } from './blob-images';
import { getMockHtml } from './mock-posts';

export interface TocHeading {
  id: string;
  text: string;
}

export interface RenderedPost {
  html: string;
  headings: TocHeading[];
}

const slugify = (text: string): string =>
  text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

export function processHeadings(html: string): RenderedPost {
  const headings: TocHeading[] = [];
  const seen = new Map<string, number>();

  const processed = html.replace(
    /<h2(\s[^>]*)?>([\s\S]*?)<\/h2>/g,
    (_match, attrs = '', inner) => {
      const text = inner
        .replace(/<[^>]+>/g, '')
        .replace(/\s+/g, ' ')
        .trim();
      const base = slugify(text) || 'section';
      const count = seen.get(base) ?? 0;
      seen.set(base, count + 1);
      const id = count === 0 ? base : `${base}-${count}`;
      headings.push({ id, text });
      return `<h2${attrs} id="${id}">${inner}</h2>`;
    },
  );

  return { html: processed, headings };
}

const notion = new Client({ auth: import.meta.env.NOTION_TOKEN });

const renderer = new NotionRenderer({ client: notion });
let pluginsReady: Promise<void> | undefined;

function ensurePlugins() {
  if (!pluginsReady) {
    pluginsReady = (async () => {
      await renderer.use(hljsPlugin({}));
      await renderer.use(bookmarkPlugin(undefined));
    })();
  }
  return pluginsReady;
}

export async function renderNotionPage(pageId: string): Promise<string> {
  await ensurePlugins();
  const blocks = await fetchAllBlocks(pageId);
  const rewritten = await rewriteImageBlocks(blocks);
  // biome-ignore lint/suspicious/noExplicitAny: NotionRenderer.render expects a loose Block union
  return renderer.render(...(rewritten as any[]));
}

// biome-ignore lint/suspicious/noExplicitAny: Notion block union is wide; we only inspect image blocks
async function rewriteImageBlocks(blocks: any[]): Promise<any[]> {
  return Promise.all(
    blocks.map(async (block) => {
      if (block?.type !== 'image' || block.image?.type !== 'file') return block;
      const newUrl = await uploadNotionFileIfMissing(block.image.file.url);
      return {
        ...block,
        image: {
          ...block.image,
          file: { ...block.image.file, url: newUrl },
        },
      };
    }),
  );
}

export async function renderPostBody(
  post: CollectionEntry<'blog'>,
): Promise<RenderedPost> {
  const mockHtml = getMockHtml(post);
  const raw =
    mockHtml !== undefined ? mockHtml : await renderNotionPage(post.id);
  return processHeadings(raw);
}

async function fetchAllBlocks(blockId: string) {
  const out: unknown[] = [];
  let cursor: string | undefined;
  do {
    const res = await notion.blocks.children.list({
      block_id: blockId,
      start_cursor: cursor,
    });
    out.push(...res.results);
    cursor = res.next_cursor ?? undefined;
  } while (cursor);
  return out;
}
