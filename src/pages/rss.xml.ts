import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { SITE } from "../config";
import { articlePath, t } from "../i18n/ui";
import { getPostsForLocale } from "../lib/posts";
import { typeset } from "../lib/typography";

export async function GET(context: APIContext) {
  const posts = await getPostsForLocale("fr");

  return rss({
    title: `${SITE.name} — ${t("fr", "blog.title")}`,
    description: t("fr", "blog.subtitle"),
    site: context.site ?? SITE.url,
    customData: "<language>fr-FR</language>",
    items: posts.map((post) => ({
      title: typeset(post.data.title, "fr"),
      pubDate: post.data.pubDate,
      description: typeset(post.data.description, "fr"),
      link: articlePath("fr", post.data.slug),
    })),
  });
}
