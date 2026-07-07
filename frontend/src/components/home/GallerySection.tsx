"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";
import { imageUrl } from "@/sanity/image";
import type { GallerySection as GalleryData } from "@/sanity/types";

const PAGE_SIZE = 4;

const PLACEHOLDER_LABELS = [
  "Drone — de hal van boven",
  "Actie — mid-rally",
  "Community — high-five",
  "Jeugd — training",
];

function chunk<T>(items: T[], size: number): T[][] {
  const pages: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    pages.push(items.slice(i, i + size));
  }
  return pages;
}

export function GallerySection({ section }: { section: GalleryData }) {
  const images = section.images ?? [];
  const pages = chunk(images, PAGE_SIZE);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activePage, setActivePage] = useState(0);

  const onScroll = () => {
    const el = scrollerRef.current;
    if (!el) return;
    setActivePage(Math.round(el.scrollLeft / el.clientWidth));
  };

  const goTo = (index: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({ left: index * el.clientWidth, behavior: "smooth" });
  };

  const frameClasses =
    "overflow-hidden rounded-2xl border border-white/12 lg:rounded-[20px]";
  const imgClasses = "block h-[150px] w-full object-cover lg:h-[260px]";

  return (
    <section className="bg-navy-950 py-14 lg:py-24">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-5 px-5 lg:gap-9 lg:px-20">
        {section.eyebrow && <Eyebrow>{section.eyebrow}</Eyebrow>}

        {images.length === 0 ? (
          /* Nog geen foto's in het CMS: toon de vier slots uit het design */
          <>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">
              {PLACEHOLDER_LABELS.map((label) => (
                <div key={label} className={frameClasses}>
                  <MediaPlaceholder label={label} className={imgClasses} />
                </div>
              ))}
            </div>
            <div aria-hidden="true" className="flex items-center gap-2">
              <span className="h-1 w-7 rounded-full bg-lime-400 lg:w-8" />
              <span className="h-1 w-3.5 rounded-full bg-navy-600 lg:w-4" />
              <span className="h-1 w-3.5 rounded-full bg-navy-600 lg:w-4" />
            </div>
          </>
        ) : (
          <>
            <div
              ref={scrollerRef}
              onScroll={onScroll}
              className={
                pages.length > 1
                  ? "-mx-5 flex snap-x snap-mandatory overflow-x-auto px-5 [scrollbar-width:none] lg:-mx-0 lg:px-0"
                  : ""
              }
              aria-label="Fotogalerij"
            >
              {pages.map((page, pageIndex) => (
                <div
                  key={pageIndex}
                  className="grid w-full shrink-0 snap-start grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5"
                >
                  {page.map((image) => {
                    const src = imageUrl(image, 640, 520);
                    return (
                      <div key={image._key} className={`group ${frameClasses}`}>
                        {src ? (
                          <Image
                            src={src}
                            alt={image.alt || ""}
                            width={320}
                            height={260}
                            sizes="(min-width: 1024px) 25vw, 50vw"
                            className={`${imgClasses} transition-transform duration-[420ms] ease-brand group-hover:scale-[1.03]`}
                          />
                        ) : (
                          <MediaPlaceholder className={imgClasses} />
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {pages.length > 1 && (
              <div className="flex items-center gap-2">
                {pages.map((_, index) => (
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
