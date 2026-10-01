import type { APIRoute, GetStaticPaths, InferGetStaticPropsType } from "astro";
import portrait from "@/assets/portrait.jpg";
import { SITE } from "@/config";
import {
  composeDefaultCard,
  imageResponse,
  sourcePath,
} from "@/lib/og-compose";

// The locale's default share card: /og/default-{locale}.jpg (see lib/og.ts).
export const getStaticPaths = (() =>
  SITE.locales.map((locale) => ({
    params: { locale },
    props: { locale },
  }))) satisfies GetStaticPaths;

type Props = InferGetStaticPropsType<typeof getStaticPaths>;

export const GET: APIRoute<Props> = async ({ props }) =>
  imageResponse(
    await composeDefaultCard(sourcePath(portrait), props.locale),
    "image/jpeg",
  );
