import imageUrlBuilder from "@sanity/image-url";
import type { SanityImage } from "./types";
import { dataset, isSanityConfigured, projectId } from "./env";

const builder = isSanityConfigured
  ? imageUrlBuilder({ projectId, dataset })
  : null;

/** Bouwt een geoptimaliseerde CDN-URL voor een Sanity-afbeelding. */
export function imageUrl(
  image: SanityImage | null | undefined,
  width: number,
  height?: number,
): string | null {
  if (!builder || !image?.asset?._id) return null;
  let url = builder.image(image).width(width).fit("crop").auto("format");
  if (height) url = url.height(height);
  return url.url();
}

export function hasImage(image: SanityImage | null | undefined): boolean {
  return Boolean(image?.asset?._id);
}
