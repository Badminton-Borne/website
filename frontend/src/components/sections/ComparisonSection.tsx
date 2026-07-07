import { BrandButton } from "@/components/ui/BrandButton";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/fx/Reveal";
import { localizeHref } from "@/lib/links";
import type { ComparisonSection as ComparisonData } from "@/sanity/types";

/**
 * Vergelijkingstabel (artboard 4e). CSS-grid met een doorlopende lime kolom
 * voor de uitgelichte sport (default: de eerste kolom). Op mobiel scrollt de
 * tabel horizontaal zodat de lime kolom herkenbaar blijft.
 */
export function ComparisonSection({
  section,
  locale,
}: {
  section: ComparisonData;
  locale: string;
}) {
  const columns = section.columns ?? [];
  const rows = section.rows ?? [];
  if (columns.length === 0 || rows.length === 0) return null;

  const highlightIndex = Math.max(
    0,
    columns.findIndex((col) => col.highlighted),
  );
  const gridTemplateColumns = `1.3fr ${"1fr ".repeat(columns.length).trim()}`;

  const highlightCell = (rowIndex: number, isLast: boolean) =>
    [
      "bg-lime-400 px-4 py-5 text-center text-base font-extrabold text-navy-900 lg:px-6",
      rowIndex > 0 ? "border-t border-[rgba(9,18,37,0.12)]" : "",
      isLast ? "rounded-b-[20px]" : "",
    ]
      .filter(Boolean)
      .join(" ");

  return (
    <section className="bg-navy-900 py-14 lg:py-24">
      <div className="mx-auto flex max-w-[1080px] flex-col gap-8 px-5 lg:gap-11 lg:px-20">
        <Reveal className="flex flex-col items-start gap-4">
          {section.eyebrow && <Eyebrow>{section.eyebrow}</Eyebrow>}
          <h2 className="font-display text-h2 font-extrabold uppercase text-white">
            {section.heading}
          </h2>
        </Reveal>

        <Reveal>
          <div className="overflow-x-auto pb-1">
            <div
              role="table"
              aria-label={section.heading ?? "Vergelijking"}
              className="grid min-w-[640px]"
              style={{ gridTemplateColumns }}
            >
              {/* Kopregel */}
              <div role="columnheader" />
              {columns.map((col, colIndex) => (
                <div
                  key={col._key}
                  role="columnheader"
                  className={
                    colIndex === highlightIndex
                      ? "rounded-t-[20px] bg-lime-400 px-4 py-5 text-center font-display text-lg font-extrabold uppercase tracking-tight text-navy-900 lg:px-6"
                      : "px-4 py-5 text-center font-display text-lg font-bold uppercase tracking-tight text-navy-300 lg:px-6"
                  }
                >
                  {col.label}
                </div>
              ))}

              {/* Rijen */}
              {rows.map((row, rowIndex) => {
                const isLast = rowIndex === rows.length - 1;
                return (
                  <div key={row._key} role="row" className="contents">
                    <div
                      role="rowheader"
                      className={`border-t border-white/10 px-2 py-5 text-base font-bold text-white ${
                        isLast ? "border-b" : ""
                      }`}
                    >
                      {row.label}
                    </div>
                    {columns.map((col, colIndex) => (
                      <div
                        key={col._key}
                        role="cell"
                        className={
                          colIndex === highlightIndex
                            ? highlightCell(rowIndex, isLast)
                            : `border-t border-white/10 px-4 py-5 text-center text-base text-navy-300 lg:px-6 ${
                                isLast ? "border-b" : ""
                              }`
                        }
                      >
                        {row.values?.[colIndex] ?? "—"}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>

        {(section.footnote || section.ctaLabel) && (
          <Reveal className="flex flex-wrap items-center justify-between gap-6">
            <p className="text-[13px] text-navy-400">{section.footnote}</p>
            {section.ctaLabel && (
              <BrandButton
                href={localizeHref(section.ctaLink, locale)}
                variant="primary"
                size="md"
                className="max-sm:w-full"
              >
                {section.ctaLabel}
              </BrandButton>
            )}
          </Reveal>
        )}
      </div>
    </section>
  );
}
