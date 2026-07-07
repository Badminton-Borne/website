import { ArrowLink } from "@/components/ui/ArrowLink";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/fx/Reveal";
import { abbreviateDay, capitalizeDay } from "@/lib/format";
import { localizeHref } from "@/lib/links";
import type {
  TrainingTimesSection as TrainingTimesData,
  TrainingTimeRow,
} from "@/sanity/types";

/**
 * Eén rij van het rooster, met de aangepaste tijd/locatie verwerkt zodra de
 * redactie de override aanzet (lege override-velden vallen terug op het
 * gewone rooster).
 */
function effectiveRow(row: TrainingTimeRow) {
  const override = row.override?.enabled ? row.override : null;
  return {
    group: row.group,
    activity: row.activity,
    day: override?.day || row.day,
    startTime: override?.startTime || row.startTime,
    endTime: override?.endTime || row.endTime,
    location: override?.location || row.location,
    adjusted: Boolean(override),
    note: override?.note ?? null,
  };
}

export function TrainingTimesSection({
  section,
  locale,
}: {
  section: TrainingTimesData;
  locale: string;
}) {
  const rows = (section.rows ?? []).map(effectiveRow);
  const showLocation = rows.some((row) => row.location);
  const link = section.link?.label ? (
    <ArrowLink href={localizeHref(section.link.href, locale)}>
      {section.link.label}
    </ArrowLink>
  ) : null;

  return (
    <section className="bg-navy-900 py-14 lg:py-24">
      <div className="mx-auto flex max-w-[1080px] flex-col gap-6 px-5 lg:gap-9 lg:px-20">
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
            {rows.map((row, index) => (
              <li
                key={section.rows![index]._id}
                className={`flex flex-col gap-1.5 border-t border-white/10 px-1 py-4 lg:grid lg:grid-cols-[1.2fr_auto_auto_1fr] lg:items-center lg:gap-6 lg:px-2 lg:py-[22px] ${
                  index === rows.length - 1 ? "border-b" : ""
                }`}
              >
                {/* Groep + activiteit (+ aangepast-chip) */}
                <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                  <span className="text-[15px] font-bold text-white lg:text-[17px]">
                    {row.group}
                  </span>
                  {row.activity && (
                    <span className="text-[13px] font-bold uppercase tracking-[0.12em] text-lime-400">
                      {row.activity}
                    </span>
                  )}
                  {row.adjusted && (
                    <span className="rounded-full bg-lime-400 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-navy-900">
                      Aangepast
                    </span>
                  )}
                </span>

                {/* Dag (desktop voluit) */}
                <span
                  className="hidden font-display text-base font-bold uppercase text-lime-400 lg:block"
                  aria-hidden="true"
                >
                  {capitalizeDay(row.day)}
                </span>

                {/* Tijd (mobiel met dag-afkorting ervoor) */}
                <span className="text-sm text-navy-300 lg:text-right lg:text-base lg:font-semibold lg:text-white">
                  <span
                    className="mr-2 font-display text-[13px] font-bold uppercase text-lime-400 lg:hidden"
                    aria-hidden="true"
                  >
                    {abbreviateDay(row.day)}
                  </span>
                  <span className="sr-only">{capitalizeDay(row.day)} </span>
                  {row.startTime} – {row.endTime}
                </span>

                {/* Locatie */}
                {showLocation && (
                  <span className="text-[13px] text-navy-300 lg:text-right lg:text-sm">
                    {row.location}
                  </span>
                )}

                {/* Toelichting bij aangepast schema */}
                {row.adjusted && row.note && (
                  <span className="text-[13px] text-navy-300 lg:col-span-4 lg:-mt-2.5">
                    <span aria-hidden="true">↳</span> {row.note}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </Reveal>

        <div className="lg:hidden">{link}</div>
      </div>
    </section>
  );
}
