import { getImage } from "astro:assets";
import portrait from "../assets/portrait.jpg";
import { absoluteUrl } from "../i18n/ui";

/**
 * Absolute URL of a JPEG rendition of the portrait: the Person node's `image`
 * on Home and About. (The share card is the default /og/ card, set by
 * BaseLayout.) Astro-only (`astro:assets`), so it lives apart from the pure,
 * unit-tested schema builders.
 */
export const personImageUrl = async (): Promise<string> =>
  absoluteUrl(
    (await getImage({ src: portrait, format: "jpeg", quality: 80 })).src,
  );
