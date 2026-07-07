import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/fx/Reveal";
import type { FeatureGridSection as FeatureGridData } from "@/sanity/types";

export function FeatureGridSection({ section }: { section: FeatureGridData }) {
  return (
    <section className="bg-navy-950 py-14 lg:py-24">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-6 px-5 lg:gap-10 lg:px-20">
        <Reveal className="flex flex-col items-start gap-4">
          {section.eyebrow && <Eyebrow>{section.eyebrow}</Eyebrow>}
          <h2 className="font-display text-h2 font-extrabold uppercase text-white">
            {section.heading}
          </h2>
        </Reveal>

        <div className="flex flex-col gap-3.5 lg:grid lg:grid-cols-4 lg:gap-5">
          {(section.features ?? []).map((feature, index) => (
            <Reveal key={feature._key} delay={index * 70}>
              <div className="flex h-full items-baseline gap-4 rounded-2xl border border-white/10 bg-navy-800 p-5 transition-[transform,border-color] duration-200 ease-brand hover:-translate-y-1 hover:border-lime-400/40 lg:flex-col lg:gap-3.5 lg:rounded-[20px] lg:p-7">
                <span
                  aria-hidden="true"
                  className="shrink-0 font-display text-2xl font-black leading-none text-lime-400 lg:text-[34px]"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="flex flex-col gap-1 lg:gap-3.5">
                  <h3 className="text-base font-bold text-white lg:text-[17px]">
                    {feature.title}
                  </h3>
                  {feature.description && (
                    <p className="text-sm leading-normal text-navy-300 lg:text-[15px]">
                      {feature.description}
                    </p>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
