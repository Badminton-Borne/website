import Link from "next/link";
import { AccentBar } from "@/components/ui/AccentBar";

export interface Crumb {
  label: string;
  /** Zonder href is dit de huidige pagina (lime, geen link). */
  href?: string;
}

/**
 * Subpagina-hero (artboard 4b, variant A): breadcrumb, H1, intro en
 * lime accentlijn op navy-900 met hairline eronder.
 */
export function PageHero({
  title,
  intro,
  crumbs,
  meta,
}: {
  title: string;
  intro?: string | null;
  /** Breadcrumb ná "Home" — laatste item is de huidige pagina. */
  crumbs: Crumb[];
  /** Optionele extra regel (bv. Tag + datum op de nieuws-detailpagina). */
  meta?: React.ReactNode;
}) {
  return (
    <div className="border-b border-white/8 bg-navy-900 px-5 pb-12 pt-[calc(var(--header-h)+40px)] lg:px-20 lg:pb-[72px] lg:pt-[calc(var(--header-h)+64px)]">
      <div className="mx-auto flex max-w-[1280px] flex-col items-start gap-[18px]">
        <nav aria-label="Kruimelpad" className="text-sm">
          <ol className="flex flex-wrap items-center gap-2.5">
            {crumbs.map((crumb, index) => (
              <li key={index} className="flex items-center gap-2.5">
                {index > 0 && (
                  <span aria-hidden="true" className="text-navy-500">
                    /
                  </span>
                )}
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="text-navy-300 transition-colors hover:text-lime-400"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="font-semibold text-lime-400">
                    {crumb.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <h1 className="font-display text-display font-black uppercase text-white">
          {title}
        </h1>
        {intro && (
          <p className="max-w-[52ch] text-base leading-relaxed text-navy-300 lg:text-lg">
            {intro}
          </p>
        )}
        {meta}
        <AccentBar />
      </div>
    </div>
  );
}
