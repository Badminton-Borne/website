import Link from "next/link";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SanityImg } from "@/components/ui/SanityImg";
import { Reveal } from "@/components/fx/Reveal";
import { hasImage } from "@/sanity/image";
import { localizeHref } from "@/lib/links";
import type { SponsorItem, SponsorsSection as SponsorsData } from "@/sanity/types";

function SponsorTile({ sponsor }: { sponsor: SponsorItem }) {
  const inner = hasImage(sponsor.logo) ? (
    <SanityImg
      image={sponsor.logo}
      width={220}
      height={56}
      className="h-14 w-[70%] object-contain"
      sizes="220px"
    />
  ) : (
    <span className="px-4 text-center text-sm font-bold text-navy-300">
      {sponsor.name}
    </span>
  );

  const tileClasses =
    "flex h-24 items-center justify-center rounded-2xl border border-white/10 bg-navy-800 transition-[border-color] duration-200 hover:border-lime-400/40";

  if (sponsor.url) {
    return (
      <a
        href={sponsor.url}
        target="_blank"
        rel="noopener noreferrer"
        className={tileClasses}
        aria-label={sponsor.name ?? "Sponsor"}
      >
        {inner}
      </a>
    );
  }
  return <div className={tileClasses}>{inner}</div>;
}

/**
 * Sponsorband (artboard 4f, midden). De laatste tegel is altijd de
 * dashed-lime "Jouw logo hier?"-uitnodiging.
 */
export function SponsorsSection({
  section,
  locale,
}: {
  section: SponsorsData;
  locale: string;
}) {
  const sponsors = section.sponsors ?? [];

  return (
    <section className="border-t border-white/8 bg-navy-900 py-12 lg:py-16">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-7 px-5 lg:px-20">
        <Reveal className="flex flex-wrap items-center justify-between gap-6">
          {section.eyebrow && <Eyebrow>{section.eyebrow}</Eyebrow>}
          {section.link?.label && (
            <ArrowLink href={localizeHref(section.link.href, locale)}>
              {section.link.label}
            </ArrowLink>
          )}
        </Reveal>

        <Reveal>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,150px),1fr))] gap-4 lg:gap-5">
            {sponsors.map((sponsor) => (
              <SponsorTile key={sponsor._id} sponsor={sponsor} />
            ))}
            <Link
              href={localizeHref(section.joinHref, locale)}
              className="flex h-24 items-center justify-center rounded-2xl border border-dashed border-lime-400/50 bg-navy-800 px-4 text-center text-sm font-bold text-lime-400 transition-colors duration-200 hover:border-lime-400 hover:bg-navy-800/60"
            >
              {section.joinLabel || "Jouw logo hier?"}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
