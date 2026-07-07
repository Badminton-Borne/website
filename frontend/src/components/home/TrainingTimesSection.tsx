import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/fx/Reveal";
import { abbreviateDay, capitalizeDay } from "@/lib/format";
import { localizeHref } from "@/lib/links";
import type { TrainingTimesSection as TrainingTimesData } from "@/sanity/types";

export function TrainingTimesSection({
  section,
  locale,
}: {
  section: TrainingTimesData;
  locale: string;
}) {
  const rows = section.rows ?? [];
  const link = section.link?.label ? (
    <Link
      href={localizeHref(section.link.href, locale)}
      className="text-[15px] font-bold text-lime-400 transition-colors hover:text-lime-300 lg:text-base"
    >
      {section.link.label} <span aria-hidden="true">→</span>
    </Link>
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
                key={row._id}
                className={`grid grid-cols-[1fr_auto] items-center gap-3 border-t border-white/10 px-1 py-4 lg:grid-cols-[1fr_auto_auto] lg:gap-6 lg:px-2 lg:py-[22px] ${
                  index === rows.length - 1 ? "border-b" : ""
                }`}
              >
                <span className="text-[15px] font-bold text-white lg:text-[17px]">
                  {row.group}
                </span>
                <span
                  className="hidden font-display text-base font-bold uppercase text-lime-400 lg:block"
                  aria-hidden="true"
                >
                  {capitalizeDay(row.day)}
                </span>
                <span className="text-sm text-navy-300 lg:text-base lg:font-semibold">
                  <span
                    className="mr-2 font-display text-[13px] font-bold uppercase text-lime-400 lg:hidden"
                    aria-hidden="true"
                  >
                    {abbreviateDay(row.day)}
                  </span>
                  <span className="sr-only">{capitalizeDay(row.day)} </span>
                  {row.startTime} – {row.endTime}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>

        <div className="lg:hidden">{link}</div>
      </div>
    </section>
  );
}
