import Image from "next/image";
import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/fx/Reveal";
import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";
import { hasImage, imageUrl } from "@/sanity/image";
import { localizeHref } from "@/lib/links";
import type { AudienceSegmentsSection as SegmentsData } from "@/sanity/types";

export function AudienceSegmentsSection({
  section,
  locale,
}: {
  section: SegmentsData;
  locale: string;
}) {
  return (
    <section className="bg-navy-950 py-14 lg:py-24">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-6 px-5 lg:gap-10 lg:px-20">
        <Reveal className="flex flex-col items-start gap-4">
          {section.eyebrow && <Eyebrow>{section.eyebrow}</Eyebrow>}
          <h2 className="font-display text-h2 font-extrabold uppercase text-white">
            {section.heading}
          </h2>
        </Reveal>

        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-3 lg:gap-6 lg:pt-[38px]">
          {(section.segments ?? []).map((segment, index) => {
            const personUrl = hasImage(segment.image)
              ? imageUrl(segment.image, 640)
              : null;
            return (
              <Reveal key={segment._key} delay={index * 80} className="mt-[26px] lg:mt-0">
                <Link
                  href={localizeHref(segment.link?.href, locale)}
                  className="group flex flex-col rounded-[20px] border border-white/10 bg-navy-800 transition-[transform,border-color] duration-200 ease-brand hover:-translate-y-1 hover:border-lime-400/50"
                >
                  {/* Fotovak: uitgeknipte persoon steekt boven de kaart uit
                      (geen overflow-hidden op de kaart!) */}
                  <div className="relative h-[168px] rounded-t-[19px] bg-gradient-to-b from-navy-700 to-navy-800 lg:h-[236px]">
                    {personUrl ? (
                      <div className="absolute bottom-0 left-1/2 h-[208px] w-[78%] -translate-x-1/2 lg:h-[290px] lg:w-[82%]">
                        <Image
                          src={personUrl}
                          alt={segment.image?.alt || ""}
                          fill
                          sizes="(min-width: 1024px) 30vw, 80vw"
                          className="object-contain object-bottom"
                        />
                      </div>
                    ) : (
                      <div className="absolute inset-0 overflow-hidden rounded-t-[19px]">
                        <MediaPlaceholder label="Foto van een speler volgt" />
                      </div>
                    )}
                    <span
                      aria-hidden="true"
                      className="absolute bottom-3 left-4 h-1 w-11 rounded-full bg-lime-400 lg:bottom-3.5 lg:left-5 lg:w-14 lg:h-[5px]"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 p-5 lg:gap-2.5 lg:px-[26px] lg:pb-7 lg:pt-6">
                    <h3 className="font-display text-[19px] font-extrabold uppercase tracking-tight text-white lg:text-[22px]">
                      {segment.title}
                    </h3>
                    {segment.description && (
                      <p className="text-sm leading-normal text-navy-300 lg:text-[15px]">
                        {segment.description}
                      </p>
                    )}
                    {segment.link?.label && (
                      <p className="inline-flex items-baseline gap-1.5 text-sm font-bold text-lime-400 lg:text-[15px]">
                        {segment.link.label}
                        <span
                          aria-hidden="true"
                          className="transition-transform duration-200 ease-brand group-hover:translate-x-1"
                        >
                          →
                        </span>
                      </p>
                    )}
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
