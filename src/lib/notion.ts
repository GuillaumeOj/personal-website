import type { CollectionEntry } from 'astro:content';
import bookmarkPlugin from '@notion-render/bookmark-plugin';
import { NotionRenderer } from '@notion-render/client';
import hljsPlugin from '@notion-render/hljs-plugin';
import { Client } from '@notionhq/client';
import { uploadNotionFileIfMissing } from './blob-images';
import { getMockHtml } from './mock-posts';

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
): Promise<string> {
  const mockHtml = getMockHtml(post);
  if (mockHtml !== undefined) return mockHtml;
  return renderNotionPage(post.id);
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
