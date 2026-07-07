import { BrandButton } from "@/components/ui/BrandButton";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/fx/Reveal";
import { localizeHref } from "@/lib/links";
import type {
  MembershipPackage,
  PricingSection as PricingData,
} from "@/sanity/types";

function PricingCard({
  pkg,
  locale,
}: {
  pkg: MembershipPackage;
  locale: string;
}) {
  const highlighted = Boolean(pkg.highlighted);

  return (
    <article
      className={`relative flex h-full flex-col gap-[22px] rounded-[20px] bg-navy-800 px-8 py-9 transition-[transform,border-color] duration-200 ease-brand hover:-translate-y-1 ${
        highlighted
          ? "border-2 border-lime-400 shadow-[0_0_0_4px_rgba(194,240,60,0.12)]"
          : "border border-white/10 hover:border-lime-400/40"
      }`}
    >
      {highlighted && (
        <span className="absolute -top-3.5 left-8 rounded-full bg-lime-400 px-3.5 py-1.5 text-[13px] font-bold uppercase tracking-wide text-navy-900">
          {pkg.highlightLabel || "Meest gekozen"}
        </span>
      )}
      <div className="flex flex-col gap-2">
        <h3 className="font-display text-[22px] font-extrabold uppercase tracking-tight text-white">
          {pkg.title}
        </h3>
        {pkg.description && (
          <p className="text-[15px] leading-normal text-navy-300">
            {pkg.description}
          </p>
        )}
      </div>
      {pkg.price != null && (
        <div className="flex items-baseline gap-2">
          <span
            className={`font-display text-[44px] font-black tracking-tight ${
              highlighted ? "text-lime-400" : "text-white"
            }`}
          >
            €{pkg.price}
          </span>
          {pkg.priceSuffix && (
            <span className="text-[15px] text-navy-300">{pkg.priceSuffix}</span>
          )}
        </div>
      )}
      <ul className="flex flex-col gap-3">
        {(pkg.features ?? []).map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className="mt-px flex h-5 w-5 flex-none items-center justify-center rounded-full bg-lime-400 text-xs font-extrabold text-navy-900"
            >
              ✓
            </span>
            <span className="text-[15px] leading-normal text-white">
              {feature}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-auto flex flex-col gap-2.5 pt-1">
        {pkg.ctaLabel && (
          <BrandButton
            href={localizeHref(pkg.ctaHref, locale)}
            variant={highlighted ? "primary" : "outline-light"}
            size="md"
            fullWidth
          >
            {pkg.ctaLabel}
          </BrandButton>
        )}
      </div>
    </article>
  );
}

/** Lidmaatschappen (artboard 4a): pakket-kaarten met optionele "Meest gekozen". */
export function PricingSection({
  section,
  locale,
}: {
  section: PricingData;
  locale: string;
}) {
  const packages = section.packages ?? [];
  // Auto-fit grid; bij 1–2 pakketten begrensd zodat kaarten niet absurd breed worden.
  const gridMaxWidth =
    packages.length > 0
      ? Math.min(1280, packages.length * 416 + (packages.length - 1) * 24)
      : undefined;

  return (
    <section className="bg-navy-950 py-14 lg:py-24">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-8 px-5 lg:gap-11 lg:px-20">
        <Reveal className="flex flex-col items-start gap-4">
          {section.eyebrow && <Eyebrow>{section.eyebrow}</Eyebrow>}
          <h2 className="font-display text-h2 font-extrabold uppercase text-white">
            {section.heading}
          </h2>
          {section.intro && (
            <p className="max-w-[52ch] text-[15px] leading-relaxed text-navy-300 lg:text-[17px]">
              {section.intro}
            </p>
          )}
        </Reveal>

        <div
          className="grid w-full grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] items-stretch gap-6 pt-3.5"
          style={gridMaxWidth ? { maxWidth: gridMaxWidth } : undefined}
        >
          {packages.map((pkg, index) => (
            <Reveal key={pkg._id} delay={index * 70} className="h-full">
              <PricingCard pkg={pkg} locale={locale} />
            </Reveal>
          ))}
        </div>

        {section.footnote && (
          <p className="text-[13px] text-navy-400">{section.footnote}</p>
        )}
      </div>
    </section>
  );
}
