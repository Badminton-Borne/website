"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BrandButton } from "@/components/ui/BrandButton";
import { localizeHref } from "@/lib/links";
import type { SiteSettingsData } from "@/sanity/types";

/**
 * Conversiebalk onderin beeld op mobiel. Verbergt zichzelf zodra er elders
 * op de pagina een knop/link met dezelfde bestemming in beeld staat (hero,
 * CTA-banden) — dan is de balk dubbelop.
 */
export function MobileStickyBar({
  settings,
  locale,
}: {
  settings: SiteSettingsData;
  locale: string;
}) {
  const cta = settings.stickyBarCta;
  const href = localizeHref(cta?.href, locale);
  const pathname = usePathname();
  const [duplicateInView, setDuplicateInView] = useState(false);

  useEffect(() => {
    if (!cta?.label) return;
    // Alle andere links naar dezelfde bestemming op de pagina volgen
    const candidates = [
      ...document.querySelectorAll<HTMLAnchorElement>(
        `main a[href="${CSS.escape(href)}"]`,
      ),
    ];
    // Geen dubbele CTA op deze pagina: de cleanup van de vorige route heeft
    // de balk al zichtbaar gemaakt, dus hier is niets te doen.
    if (candidates.length === 0) return;
    const visible = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target);
          else visible.delete(entry.target);
        }
        setDuplicateInView(visible.size > 0);
      },
      // De balk zelf staat onderin: tel een CTA pas mee als hij echt in het
      // zichtbare deel boven de balk staat.
      { rootMargin: "0px 0px -88px 0px" },
    );
    candidates.forEach((el) => observer.observe(el));
    return () => {
      observer.disconnect();
      setDuplicateInView(false);
    };
  }, [cta?.label, href, pathname]);

  if (!cta?.label) return null;

  return (
    <div
      aria-hidden={duplicateInView}
      className={`fixed inset-x-0 bottom-0 z-50 flex flex-col gap-1.5 border-t border-white/12 bg-[rgba(19,30,54,0.97)] px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_24px_rgba(6,12,26,0.5)] transition-[transform,opacity] duration-300 ease-brand lg:hidden ${
        duplicateInView ? "pointer-events-none translate-y-full opacity-0" : ""
      }`}
    >
      <BrandButton
        href={href}
        variant="primary"
        size="md"
        fullWidth
      >
        {cta.label}
      </BrandButton>
      {settings.stickyBarMicrocopy && (
        <p className="text-center text-xs text-navy-300">
          {settings.stickyBarMicrocopy}
        </p>
      )}
    </div>
  );
}
