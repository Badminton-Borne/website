"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";
import { imageUrl } from "@/sanity/image";
import type { GallerySection as GalleryData, SanityImage } from "@/sanity/types";

const PLACEHOLDER_LABELS = [
  "Drone — de hal van boven",
  "Actie — mid-rally",
  "Community — high-five",
  "Jeugd — training",
];

const FRAME_CLASSES =
  "overflow-hidden rounded-2xl border border-white/12 lg:rounded-[20px]";
const IMG_CLASSES = "block h-[150px] w-full object-cover lg:h-[240px]";

function GalleryImage({ image }: { image: SanityImage & { _key: string } }) {
  const src = imageUrl(image, 640, 500);
  return (
    <div className={`group ${FRAME_CLASSES}`}>
      {src ? (
        <Image
          src={src}
          alt={image.alt || ""}
          width={320}
          height={250}
          sizes="(min-width: 1024px) 25vw, 50vw"
          className={`${IMG_CLASSES} transition-transform duration-[420ms] ease-brand group-hover:scale-[1.03]`}
        />
      ) : (
        <MediaPlaceholder className={IMG_CLASSES} />
      )}
    </div>
  );
}

function ArrowButton({
  direction,
  onClick,
  disabled,
}: {
  direction: "prev" | "next";
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "prev" ? "Vorige foto's" : "Volgende foto's"}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/16 text-lg text-white transition-[border-color,color,opacity] duration-200 hover:border-lime-400 hover:text-lime-400 disabled:pointer-events-none disabled:opacity-30"
    >
      <span aria-hidden="true">{direction === "prev" ? "←" : "→"}</span>
    </button>
  );
}

/**
 * Fotogalerij uit Sanity: groeit mee met het aantal foto's. Tot en met
 * vier foto's een rustige grid; daarboven maximaal twee rijen die
 * horizontaal bladeren met pijltjes (en swipen op mobiel).
 */
export function GallerySection({ section }: { section: GalleryData }) {
  const images = section.images ?? [];
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [pageCount, setPageCount] = useState(1);
  const [activePage, setActivePage] = useState(0);

  const measure = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    const pages = Math.max(1, Math.ceil(el.scrollWidth / el.clientWidth));
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft < maxScroll - 8);
    setPageCount(pages);
    // Verdeel de dots over de echte scrollafstand, zodat de laatste dot ook
    // oplicht als de laatste pagina maar half gevuld is.
    setActivePage(
      maxScroll > 0
        ? Math.round((el.scrollLeft / maxScroll) * (pages - 1))
        : 0,
    );
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure, images.length]);

  const scrollBy = (direction: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth, behavior: "smooth" });
  };

  const goTo = (index: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    const left =
      pageCount > 1 ? (index / (pageCount - 1)) * maxScroll : 0;
    el.scrollTo({ left, behavior: "smooth" });
  };

  const scrollable = images.length > 4;

  return (
    <section className="bg-navy-950 py-14 lg:py-24">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-5 px-5 lg:gap-9 lg:px-20">
        <div className="flex items-center justify-between gap-6">
          {section.eyebrow && <Eyebrow>{section.eyebrow}</Eyebrow>}
          {scrollable && (
            <div className="flex gap-2.5">
              <ArrowButton
                direction="prev"
                onClick={() => scrollBy(-1)}
                disabled={!canPrev}
              />
              <ArrowButton
                direction="next"
                onClick={() => scrollBy(1)}
                disabled={!canNext}
              />
            </div>
          )}
        </div>

        {images.length === 0 ? (
          /* Nog geen foto's in het CMS: toon de vier slots uit het design */
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">
            {PLACEHOLDER_LABELS.map((label) => (
              <div key={label} className={FRAME_CLASSES}>
                <MediaPlaceholder label={label} className={IMG_CLASSES} />
              </div>
            ))}
          </div>
        ) : !scrollable ? (
          /* Tot en met 4 foto's: gewone grid (mobiel max 2 rijen) */
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">
            {images.map((image) => (
              <GalleryImage key={image._key} image={image} />
            ))}
          </div>
        ) : (
          <>
            {/* Meer foto's: kolommen van 2 hoog, horizontaal bladerbaar */}
            <div
              ref={scrollerRef}
              onScroll={measure}
              aria-label="Fotogalerij"
              className="-mx-5 grid snap-x snap-mandatory auto-cols-[calc((100%-0.75rem)/2)] grid-flow-col grid-rows-2 gap-3 overflow-x-auto px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:mx-0 lg:auto-cols-[calc((100%-3.75rem)/4)] lg:gap-5 lg:px-0"
            >
              {images.map((image) => (
                <div key={image._key} className="snap-start">
                  <GalleryImage image={image} />
                </div>
              ))}
            </div>

            {pageCount > 1 && (
              <div className="flex items-center gap-2">
                {Array.from({ length: pageCount }, (_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => goTo(index)}
                    aria-label={`Ga naar fotopagina ${index + 1}`}
                    aria-current={activePage === index ? "true" : undefined}
                    className={`h-1 rounded-full transition-[width,background-color] duration-200 ease-brand ${
                      activePage === index
                        ? "w-7 bg-lime-400 lg:w-8"
                        : "w-3.5 bg-navy-600 hover:bg-navy-500 lg:w-4"
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
