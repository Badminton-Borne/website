import { ArrowLink } from "@/components/ui/ArrowLink";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/fx/Reveal";
import { abbreviateDay, capitalizeDay } from "@/lib/format";
import { localizeHref, mapsHref } from "@/lib/links";
import type {
  TrainingTimesSection as TrainingTimesData,
  TrainingTimeRow,
} from "@/sanity/types";

/**
 * Eén rij van het rooster, met de aangepaste tijd/locatie verwerkt zodra de
 * redactie de override aanzet (lege override-velden vallen terug op het
 * gewone rooster). Een afwijkende locatie is vrije tekst en vervangt de
 * gekoppelde locatie.
 */
function effectiveRow(row: TrainingTimeRow) {
  const override = row.override?.enabled ? row.override : null;
  return {
    id: row._id,
    group: row.group ?? "",
    activity: row.activity,
    day: override?.day || row.day,
    startTime: override?.startTime || row.startTime,
    endTime: override?.endTime || row.endTime,
    location: override?.location
      ? { name: override.location, city: row.location?.city ?? "Borne" }
      : row.location,
    adjusted: Boolean(override),
    note: override?.note ?? null,
  };
}

type EffectiveRow = ReturnType<typeof effectiveRow>;

/** Tertiaire kaartlink: naam + adres, opent Google Maps in een nieuw tabblad. */
function LocationLink({ location }: { location: EffectiveRow["location"] }) {
  if (!location?.name) return null;
  const address = [location.street, location.city].filter(Boolean).join(", ");
  return (
    <a
      href={mapsHref(location)}
      target="_blank"
      rel="noopener noreferrer"
      className="group/loc flex flex-col lg:items-end"
    >
      <span className="text-[13px] font-semibold text-navy-300 underline decoration-white/25 underline-offset-2 transition-colors group-hover/loc:text-lime-400 group-hover/loc:decoration-lime-400/60 lg:text-sm">
        {location.name}{" "}
        <span aria-hidden="true" className="text-[11px]">
          ↗
        </span>
      </span>
      {address && (
        <span className="text-xs text-navy-300/90">{address}</span>
      )}
      <span className="sr-only">(opent Google Maps in een nieuw tabblad)</span>
    </a>
  );
}

function GroupSchedule({ label, rows }: { label: string; rows: EffectiveRow[] }) {
  if (rows.length === 0) return null;
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-[13px] font-bold uppercase tracking-[0.14em] text-navy-300">
        {label}
      </h3>
      <ul className="flex flex-col">
        {rows.map((row, index) => {
          // Zelfde dag als de rij erboven (bv. training + vrij spelen op
          // maandag): dagnaam niet herhalen. Voor screenreaders blijft de
          // dag wel op elke rij staan (sr-only).
          const repeatDay = index > 0 && rows[index - 1].day === row.day;
          return (
          <li
            key={row.id}
            className={`flex flex-col gap-1.5 border-t border-white/10 px-1 py-4 lg:grid lg:grid-cols-[130px_1fr_auto_minmax(0,1.15fr)] lg:items-center lg:gap-6 lg:px-2 lg:py-[18px] ${
              index === rows.length - 1 ? "border-b" : ""
            }`}
          >
            {/* Dag */}
            <span
              className="hidden font-display text-base font-bold uppercase text-lime-400 lg:block"
              aria-hidden="true"
            >
              {!repeatDay && capitalizeDay(row.day)}
            </span>

            {/* Activiteit (+ aangepast-chip); mobiel met dag ervoor */}
            <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
              {!repeatDay && (
                <span
                  className="font-display text-[13px] font-bold uppercase text-lime-400 lg:hidden"
                  aria-hidden="true"
                >
                  {abbreviateDay(row.day)}
                </span>
              )}
              <span className="sr-only">{capitalizeDay(row.day)} </span>
              <span className="text-[15px] font-bold text-white lg:text-base">
                {row.activity
                  ? row.activity.charAt(0).toUpperCase() + row.activity.slice(1)
                  : "Badminton"}
              </span>
              {row.adjusted && (
                <span className="rounded-full bg-lime-400 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-navy-900">
                  Aangepast
                </span>
              )}
            </span>

            {/* Tijd */}
            <span className="text-sm text-navy-300 lg:text-right lg:text-base lg:font-semibold lg:text-white">
              {row.startTime} – {row.endTime}
            </span>

            {/* Locatie (tertiair, klikbaar naar Google Maps) */}
            <LocationLink location={row.location} />

            {/* Toelichting bij aangepast schema */}
            {row.adjusted && row.note && (
              <span className="text-[13px] text-navy-300 lg:col-span-4 lg:-mt-2">
                <span aria-hidden="true">↳</span> {row.note}
              </span>
            )}
          </li>
          );
        })}
      </ul>
    </div>
  );
}

export function TrainingTimesSection({
  section,
  locale,
}: {
  section: TrainingTimesData;
  locale: string;
}) {
  const rows = (section.rows ?? []).map(effectiveRow);
  // Groepen in volgorde van eerste voorkomen (volgorde-veld bepaalt dus ook
  // welke groep bovenaan staat)
  const groups: { label: string; rows: EffectiveRow[] }[] = [];
  for (const row of rows) {
    const existing = groups.find((g) => g.label === row.group);
    if (existing) existing.rows.push(row);
    else groups.push({ label: row.group, rows: [row] });
  }

  const link = section.link?.label ? (
    <ArrowLink href={localizeHref(section.link.href, locale)}>
      {section.link.label}
    </ArrowLink>
  ) : null;

  return (
    <section className="bg-navy-900 py-14 lg:py-24">
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

        <Reveal className="flex flex-col gap-8 lg:gap-10">
          {groups.map((group) => (
            <GroupSchedule key={group.label} label={group.label} rows={group.rows} />
          ))}
        </Reveal>

        <div className="lg:hidden">{link}</div>
      </div>
    </section>
  );
}
