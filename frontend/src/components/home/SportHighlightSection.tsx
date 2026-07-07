import { Eyebrow } from "@/components/ui/Eyebrow";
import { AccentBar } from "@/components/ui/AccentBar";
import { Reveal } from "@/components/fx/Reveal";
import { SanityImg } from "@/components/ui/SanityImg";
import type { SportHighlightSection as SportHighlightData } from "@/sanity/types";

export function SportHighlightSection({
  section,
}: {
  section: SportHighlightData;
}) {
  const header = (
    <>
      {section.eyebrow && <Eyebrow>{section.eyebrow}</Eyebrow>}
      <h2 className="font-display text-h2 font-extrabold uppercase text-white">
        {section.heading}
      </h2>
    </>
  );

  return (
    <section className="bg-navy-900 py-14 lg:py-24">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-5 px-5 lg:grid lg:grid-cols-2 lg:items-center lg:gap-[72px] lg:px-20">
        {/* Mobiel: kop boven de foto */}
        <Reveal className="flex flex-col items-start gap-4 lg:hidden">
          {header}
        </Reveal>

        <Reveal className="flex flex-col gap-2.5 lg:gap-3">
          <div className="group overflow-hidden rounded-[20px] border border-white/12">
            <SanityImg
              image={section.image}
              width={620}
              height={480}
              placeholderLabel="Actiefoto — smash of sprong, bevroren beweging"
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="block h-[280px] w-full object-cover transition-transform duration-[420ms] ease-brand group-hover:scale-[1.03] lg:h-[480px]"
            />
          </div>
          <AccentBar />
        </Reveal>

        <Reveal className="flex flex-col items-start gap-5 lg:gap-6">
          <div className="hidden flex-col items-start gap-4 lg:flex">{header}</div>
          {section.body && (
            <p className="max-w-[48ch] text-[15px] leading-relaxed text-navy-300 lg:text-[17px]">
              {section.body}
            </p>
          )}
          {(section.stats?.length ?? 0) > 0 && (
            <dl className="flex gap-9 lg:mt-2 lg:gap-12">
              {section.stats!.map((stat) => (
                <div key={stat._key} className="flex flex-col gap-1">
                  <dd className="order-1 font-display text-[26px] font-extrabold leading-none text-lime-400 lg:text-[30px]">
                    {stat.value}
                  </dd>
                  <dt className="order-2 text-[13px] text-navy-300 lg:text-sm">
                    {stat.label}
                  </dt>
                </div>
              ))}
            </dl>
          )}
          {section.footnote && (
            <p className="text-xs text-navy-400">{section.footnote}</p>
          )}
        </Reveal>
      </div>
    </section>
  );
}
