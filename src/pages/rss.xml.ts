import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITE } from '../config';
import { articlePath, t } from '../i18n/ui';
import { getPostsForLocale } from '../lib/posts';

export async function GET(context: APIContext) {
  const posts = await getPostsForLocale('fr');

  return rss({
    title: `${SITE.name} — ${t('fr', 'blog.title')}`,
    description: t('fr', 'blog.subtitle'),
    site: context.site ?? SITE.url,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: articlePath('fr', post.data.slug),
    })),
  });
}
