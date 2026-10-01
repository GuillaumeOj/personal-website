import type { APIRoute, GetStaticPaths, InferGetStaticPropsType } from "astro";
import { SITE } from "@/config";
import { projectCardId } from "@/lib/og";
import {
  composeProjectCard,
  imageResponse,
  sourcePath,
} from "@/lib/og-compose";
import { localizedName, projects, resolveImage } from "@/lib/projects";

// One share card per project and locale: /og/project-{slug}-{locale}.png (see
// lib/og.ts), with the locale's light cover as the inset screenshot.
export const getStaticPaths = (() =>
  projects.flatMap((project) =>
    SITE.locales.map((locale) => ({
      params: { card: projectCardId(project.slug, locale) },
      props: {
        locale,
        name: localizedName(project, locale),
        screenshot: sourcePath(resolveImage(project.cover, locale).light),
      },
    })),
  )) satisfies GetStaticPaths;

type Props = InferGetStaticPropsType<typeof getStaticPaths>;

export const GET: APIRoute<Props> = async ({ props }) =>
  imageResponse(
    await composeProjectCard(props.screenshot, props.name, props.locale),
    "image/png",
  );
