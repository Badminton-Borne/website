import Image from "next/image";
import Link from "next/link";

/**
 * Minimale funnel-header (artboard 4b, variant C) voor inschrijf- en
 * formulierpagina's: terug-link, logo, stappenindicator. Geen nav, geen CTA's.
 */
export function FunnelHeader({
  step,
  totalSteps,
  backHref,
  backLabel = "Terug naar de site",
}: {
  step: number;
  totalSteps: number;
  backHref: string;
  backLabel?: string;
}) {
  return (
    <header className="grid grid-cols-[1fr_auto_1fr] items-center border-b border-white/8 bg-navy-950 px-5 py-4 lg:px-12">
      <Link
        href={backHref}
        className="justify-self-start text-[15px] font-semibold text-navy-300 transition-colors hover:text-lime-400"
      >
        <span aria-hidden="true">←</span>{" "}
        <span className="max-sm:sr-only">{backLabel}</span>
      </Link>
      <Image
        src="/logos/logo-borne-horizontaal.svg"
        alt="Badminton Borne"
        width={155}
        height={56}
        className="h-10 w-auto lg:h-14"
      />
      <div className="flex items-center gap-3 justify-self-end">
        <p className="text-sm text-navy-300">
          Stap <strong className="font-bold text-white">{step}</strong> van{" "}
          {totalSteps}
        </p>
        <div className="flex gap-1.5" aria-hidden="true">
          {Array.from({ length: totalSteps }, (_, i) => (
            <span
              key={i}
              className={`h-1 w-7 rounded-full ${
                i < step ? "bg-lime-400" : "bg-navy-600"
              }`}
            />
          ))}
        </div>
      </div>
    </header>
  );
}
