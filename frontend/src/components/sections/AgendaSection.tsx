import { ArrowLink } from "@/components/ui/ArrowLink";
import { BrandButton } from "@/components/ui/BrandButton";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/fx/Reveal";
import { formatEventDay, formatEventMonth, formatNewsDate } from "@/lib/format";
import { localizeHref } from "@/lib/links";
import type { AgendaSection as AgendaData } from "@/sanity/types";

/**
 * Agenda (artboard 4f, boven): eerstvolgende events als rijen met datumblok.
 * Het eerstvolgende event krijgt het lime datumblok.
 */
export function AgendaSection({
  section,
  locale,
}: {
  section: AgendaData;
  locale: string;
}) {
  const events = section.events ?? [];
  const link = section.link?.label ? (
    <ArrowLink href={localizeHref(section.link.href, locale)}>
      {section.link.label}
    </ArrowLink>
  ) : null;

  return (
    <section className="bg-navy-950 py-14 lg:py-24">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-6 px-5 lg:gap-9 lg:px-20">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex flex-col items-start gap-4">
            {section.eyebrow && (
              <Eyebrow className="max-lg:hidden">{section.eyebrow}</Eyebrow>
            )}
            <h2 className="font-display text-h2 font-extrabold uppercase text-white">
              {section.heading}
            </h2>
          </div>
          <div className="max-lg:hidden">{link}</div>
        </Reveal>

        <Reveal>
          <ul className="flex flex-col">
            {events.map((event, index) => (
              <li
                key={event._id}
                className={`grid grid-cols-[84px_1fr] items-center gap-x-4 gap-y-3 border-t border-white/10 px-1 py-5 lg:grid-cols-[110px_1fr_auto] lg:gap-7 lg:px-2 lg:py-6 ${
                  index === events.length - 1 ? "border-b" : ""
                }`}
              >
                <div
                  className={`flex flex-col items-center rounded-[14px] py-2.5 ${
                    index === 0
                      ? "bg-lime-400"
                      : "border border-white/12 bg-navy-800"
                  }`}
                >
                  <span
                    className={`font-display text-[22px] font-black leading-none lg:text-[26px] ${
                      index === 0 ? "text-navy-900" : "text-white"
                    }`}
                  >
                    {formatEventDay(event.date)}
                  </span>
                  <span
                    className={`text-xs font-bold uppercase tracking-[0.12em] ${
                      index === 0 ? "text-navy-900" : "text-navy-300"
                    }`}
                  >
                    {formatEventMonth(event.date)}
                  </span>
                  <span className="sr-only">{formatNewsDate(event.date)}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-[17px] font-bold text-white lg:text-lg">
                    {event.title}
                  </h3>
                  {event.description && (
                    <p className="text-sm text-navy-300 lg:text-[15px]">
                      {event.description}
                    </p>
                  )}
                </div>
                {event.ctaLabel && (
                  <div className="col-start-2 lg:col-start-3">
                    <BrandButton
                      href={localizeHref(event.ctaLink, locale)}
                      variant={event.featured ? "primary" : "outline-light"}
                      size="sm"
                    >
                      {event.ctaLabel}
                    </BrandButton>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </Reveal>

        {events.length === 0 && (
          <p className="text-[15px] text-navy-300">
            Er staat op dit moment niets in de agenda — kom snel terug!
          </p>
        )}

        <div className="lg:hidden">{link}</div>
      </div>
    </section>
  );
}
