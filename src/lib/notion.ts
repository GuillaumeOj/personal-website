import bookmarkPlugin from '@notion-render/bookmark-plugin';
import { NotionRenderer } from '@notion-render/client';
import hljsPlugin from '@notion-render/hljs-plugin';
import { Client } from '@notionhq/client';

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
  // biome-ignore lint/suspicious/noExplicitAny: NotionRenderer.render expects a loose Block union
  return renderer.render(...(blocks as any[]));
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
