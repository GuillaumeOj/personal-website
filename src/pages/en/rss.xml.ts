import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { SITE } from "../../config";
import { articlePath, t } from "../../i18n/ui";
import { getPostsForLocale } from "../../lib/posts";
import { typeset } from "../../lib/typography";

export async function GET(context: APIContext) {
  const posts = await getPostsForLocale("en");

  return rss({
    title: `${SITE.name} — ${t("en", "blog.title")}`,
    description: t("en", "blog.subtitle"),
    site: context.site ?? SITE.url,
    customData: "<language>en-US</language>",
    items: posts.map((post) => ({
      title: typeset(post.data.title, "en"),
      pubDate: post.data.pubDate,
      description: typeset(post.data.description, "en"),
      link: articlePath("en", post.data.slug),
    })),
  });
}
