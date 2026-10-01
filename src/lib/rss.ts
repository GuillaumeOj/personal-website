import rss from "@astrojs/rss";
import { type Locale, SITE } from "../config";
import { articlePath, localizedUrl, t } from "../i18n/ui";
import { getPostsForLocale } from "./posts";
import { inLanguage } from "./schema";
import { typeset } from "./typography";

/** The RSS feed of one locale's blog, served at `/rss.xml` and `/en/rss.xml`. */
export async function blogFeed(locale: Locale): Promise<Response> {
  const posts = await getPostsForLocale(locale);

  return rss({
    title: `${SITE.name} — ${t(locale, "blog.title")}`,
    description: t(locale, "blog.subtitle"),
    // The channel <link> is this locale's blog index (item links are absolute
    // paths, so they still resolve against the origin).
    site: localizedUrl(locale, "/blog"),
    xmlns: { atom: "http://www.w3.org/2005/Atom" },
    customData: [
      `<language>${inLanguage(locale)}</language>`,
      `<atom:link href="${localizedUrl(locale, "/rss.xml")}" rel="self" type="application/rss+xml"/>`,
    ].join(""),
    items: posts.map((post) => ({
      title: typeset(post.data.title, locale),
      pubDate: post.data.pubDate,
      description: typeset(post.data.description, locale),
      link: articlePath(locale, post.data.slug),
    })),
  });
}
