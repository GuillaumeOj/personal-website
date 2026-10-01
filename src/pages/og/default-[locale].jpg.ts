import type { APIRoute, GetStaticPaths } from "astro";
import portrait from "@/assets/portrait.jpg";
import { type Locale, SITE } from "@/config";
import { composeDefaultCard, sourcePath } from "@/lib/og-compose";

// The locale's default share card: /og/default-{locale}.jpg (see lib/og.ts).
export const getStaticPaths = (() =>
  SITE.locales.map((locale) => ({
    params: { locale },
  }))) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ params }) => {
  const card = await composeDefaultCard(
    sourcePath(portrait),
    params.locale as Locale,
  );
  return new Response(new Uint8Array(card), {
    headers: { "Content-Type": "image/jpeg" },
  });
};
