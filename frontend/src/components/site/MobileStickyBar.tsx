import { BrandButton } from "@/components/ui/BrandButton";
import { localizeHref } from "@/lib/links";
import type { SiteSettingsData } from "@/sanity/types";

/** Altijd zichtbare conversiebalk onderin beeld op mobiel. */
export function MobileStickyBar({
  settings,
  locale,
}: {
  settings: SiteSettingsData;
  locale: string;
}) {
  const cta = settings.stickyBarCta;
  if (!cta?.label) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex flex-col gap-1.5 border-t border-white/12 bg-[rgba(19,30,54,0.97)] px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_24px_rgba(6,12,26,0.5)] lg:hidden">
      <BrandButton
        href={localizeHref(cta.href, locale)}
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
