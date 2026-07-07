import Link from "next/link";
import { AccentBar } from "@/components/ui/AccentBar";
import { Reveal } from "@/components/fx/Reveal";
import { SanityImg } from "@/components/ui/SanityImg";
import { localizeHref } from "@/lib/links";
import type { AnnouncementSection as AnnouncementData } from "@/sanity/types";

export function AnnouncementSection({
  section,
  locale,
}: {
  section: AnnouncementData;
  locale: string;
}) {
  const link = section.link?.label ? (
    <Link
      href={localizeHref(section.link.href, locale)}
      className="text-[15px] font-bold text-lime-400 transition-colors hover:text-lime-300 lg:text-base"
    >
      {section.link.label} <span aria-hidden="true">→</span>
    </Link>
  ) : null;

  return (
    <section className="border-y border-white/8 bg-navy-800 py-14 lg:py-20">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-[18px] px-5 lg:grid lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-16 lg:px-20">
        <Reveal className="flex flex-col items-start gap-[18px] lg:gap-5">
          {section.tag && (
            <span className="rounded-full bg-lime-400 px-3.5 py-1.5 text-[13px] font-bold uppercase tracking-wide text-navy-900">
              {section.tag}
            </span>
          )}
          <h2 className="font-display text-h2 font-extrabold uppercase text-white">
            {section.heading}
          </h2>
          {section.body && (
            <p className="text-[15px] leading-relaxed text-navy-300 lg:text-[17px]">
              {section.body}
            </p>
          )}
          {/* Desktop: link in de tekstkolom */}
          <div className="hidden lg:block">{link}</div>
        </Reveal>

        <Reveal className="flex flex-col gap-3">
          <div className="group overflow-hidden rounded-[20px] border border-white/12">
            <SanityImg
              image={section.image}
              width={620}
              height={340}
              placeholderLabel="Dronefoto of render van de nieuwe hal"
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="block h-[220px] w-full object-cover transition-transform duration-[420ms] ease-brand group-hover:scale-[1.03] lg:h-[340px]"
            />
          </div>
          <AccentBar className="hidden lg:block" />
        </Reveal>

        {/* Mobiel: link onder de foto */}
        <div className="lg:hidden">{link}</div>
      </div>
    </section>
  );
}
