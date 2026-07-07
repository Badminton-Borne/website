import Image from "next/image";
import type { SanityImage } from "@/sanity/types";
import { hasImage, imageUrl } from "@/sanity/image";
import { MediaPlaceholder } from "./MediaPlaceholder";

interface SanityImgProps {
  image: SanityImage | null | undefined;
  width: number;
  height: number;
  /** Placeholder-tekst zolang de club nog geen foto heeft geüpload. */
  placeholderLabel?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

/** Sanity-afbeelding via next/image, of de brand-placeholder zonder asset. */
export function SanityImg({
  image,
  width,
  height,
  placeholderLabel,
  className = "",
  sizes,
  priority = false,
}: SanityImgProps) {
  if (!hasImage(image)) {
    return <MediaPlaceholder label={placeholderLabel} className={className} />;
  }

  const src = imageUrl(image, width * 2, height * 2);
  if (!src) {
    return <MediaPlaceholder label={placeholderLabel} className={className} />;
  }

  const lqip = image?.asset?.metadata?.lqip ?? undefined;

  return (
    <Image
      src={src}
      alt={image?.alt || ""}
      width={width}
      height={height}
      sizes={sizes}
      priority={priority}
      placeholder={lqip ? "blur" : "empty"}
      blurDataURL={lqip}
      className={className}
    />
  );
}
