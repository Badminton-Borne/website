import { Eyebrow } from "@/components/ui/Eyebrow";
import { AccentBar } from "@/components/ui/AccentBar";
import { BrandButton } from "@/components/ui/BrandButton";
import { MiniGameZone } from "@/components/fx/MiniGameZone";
import { localizeHref } from "@/lib/links";
import { formatScore, stars } from "@/lib/format";
import { hasImage, imageUrl } from "@/sanity/image";
import type { HeroSection as HeroData } from "@/sanity/types";

export function HeroSection({
  section,
  locale,
}: {
  section: HeroData;
  locale: string;
}) {
  const poster = hasImage(section.videoPoster)
    ? (imageUrl(section.videoPoster, 1280, 1040) ?? undefined)
    : undefined;

  return (
    <section className="bg-navy-900">
      <MiniGameZone>
        <div className="mx-auto grid max-w-[1440px] gap-10 px-5 pb-14 pt-[calc(var(--header-h)+48px)] lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-[72px] lg:px-20 lg:pb-24 lg:pt-[calc(var(--header-h)+88px)]">
          <div className="flex flex-col items-start gap-5 lg:gap-6">
            {section.eyebrow && <Eyebrow>{section.eyebrow}</Eyebrow>}
            <h1 className="font-display text-hero font-black uppercase text-white">
              {section.heading}
            </h1>
            {section.tagline && (
              <p className="max-w-[44ch] text-base leading-relaxed text-navy-300 lg:text-[19px]">
                {section.tagline}
              </p>
            )}

            <div className="flex w-full flex-col gap-2.5 lg:w-auto">
              <div className="flex w-full flex-col gap-2.5 lg:w-auto lg:flex-row lg:flex-wrap lg:items-center lg:gap-3.5">
                {section.primaryCta?.label && (
                  <BrandButton
                    href={localizeHref(section.primaryCta.href, locale)}
                    variant="primary"
                    size="lg"
                    className="w-full lg:w-auto"
                  >
                    {section.primaryCta.label}
                  </BrandButton>
                )}
                {section.microcopy && (
                  <p className="text-center text-[13px] text-navy-300 lg:hidden">
                    {section.microcopy}
                  </p>
                )}
                {section.secondaryCta?.label && (
                  <BrandButton
                    href={localizeHref(section.secondaryCta.href, locale)}
                    variant="outline-light"
                    size="lg"
                    className="w-full max-lg:h-[46px] max-lg:text-[15px] lg:w-auto"
                  >
                    {section.secondaryCta.label}
                  </BrandButton>
                )}
              </div>
              {section.microcopy && (
                <p className="hidden text-sm text-navy-300 lg:block">
                  {section.microcopy}
                </p>
              )}
            </div>

            {section.rating?.score != null && (
              <div className="flex flex-wrap items-center gap-2.5 text-[13px] text-navy-300 lg:mt-2 lg:gap-3.5 lg:text-sm">
                <span
                  aria-hidden="true"
                  className="text-[15px] tracking-[3px] text-lime-400"
                >
                  {stars(5)}
                </span>
                <span>
                  <strong className="font-bold text-white">
                    {formatScore(section.rating.score)}
                  </strong>{" "}
                  {section.rating.source}
                </span>
                {section.rating.note && (
                  <>
                    <span
                      aria-hidden="true"
                      className="hidden h-1 w-1 rounded-full bg-navy-500 lg:inline-block"
                    />
                    <span className="max-lg:before:content-['·_']">
                      {section.rating.note}
                    </span>
                  </>
                )}
              </div>
            )}
          </div>

          {section.videoUrl && (
            <div className="flex flex-col gap-3">
              <div className="relative overflow-hidden rounded-[20px] border border-white/12">
                <video
                  src={section.videoUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  poster={poster}
                  className="block h-[300px] w-full bg-navy-800 object-cover lg:h-[520px]"
                  aria-label="Sfeerbeelden van badminton bij Badminton Borne"
                />
              </div>
              <AccentBar />
            </div>
          )}
        </div>
      </MiniGameZone>
    </section>
  );
}
