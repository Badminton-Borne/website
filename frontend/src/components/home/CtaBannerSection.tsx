import { stegaClean } from "next-sanity";
import { BrandButton } from "@/components/ui/BrandButton";
import { MiniGameZone } from "@/components/fx/MiniGameZone";
import { Reveal } from "@/components/fx/Reveal";
import { localizeHref } from "@/lib/links";
import type { CtaBannerSection as CtaBannerData } from "@/sanity/types";

export function CtaBannerSection({
  section,
  locale,
}: {
  section: CtaBannerData;
  locale: string;
}) {
  const theme = stegaClean(section.theme) === "navy" ? "navy" : "lime";
  const isNavy = theme === "navy";

  const inner = (
    <div className="mx-auto flex max-w-[1080px] flex-col items-center gap-5 px-6 py-14 text-center lg:gap-[26px] lg:px-20 lg:py-[88px]">
      <Reveal>
        <h2
          className={`whitespace-pre-line font-display font-black uppercase ${
            isNavy ? "text-display-sm text-white" : "text-display text-navy-900"
          }`}
        >
          {section.heading}
        </h2>
      </Reveal>
      <div className="flex w-full flex-col items-center gap-2.5">
        {section.cta?.label && (
          <BrandButton
            href={localizeHref(section.cta.href, locale)}
            variant={isNavy ? "primary" : "secondary"}
            size="lg"
            className="w-full sm:w-auto"
          >
            {section.cta.label}
          </BrandButton>
        )}
        {section.microcopy && (
          <p
            className={`text-[13px] lg:text-sm ${
              isNavy ? "text-navy-300" : "font-semibold text-navy-900"
            }`}
          >
            {section.microcopy}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <section
      className={
        isNavy ? "border-t border-white/8 bg-navy-900" : "bg-lime-400"
      }
    >
      {section.enableGame && isNavy ? (
        <MiniGameZone>{inner}</MiniGameZone>
      ) : (
        inner
      )}
    </section>
  );
}
