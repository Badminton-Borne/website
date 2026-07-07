import Image from "next/image";
import Link from "next/link";
import { localizeHref } from "@/lib/links";
import type { SiteSettingsData } from "@/sanity/types";

interface SiteFooterProps {
  settings: SiteSettingsData;
  locale: string;
}

export function SiteFooter({ settings, locale }: SiteFooterProps) {
  const columns = settings.footerColumns ?? [];

  return (
    <footer className="border-t border-white/8 bg-navy-950">
      {/* Extra padding onderaan op mobiel zodat de sticky CTA-balk niets afdekt */}
      <div className="mx-auto flex max-w-[1280px] flex-col gap-7 px-5 pb-32 pt-12 lg:gap-12 lg:px-20 lg:pb-10 lg:pt-16">
        <div className="grid gap-7 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:gap-12">
          <div className="flex flex-col items-start gap-4 lg:gap-4">
            <Image
              src="/logos/logo-borne-horizontaal.svg"
              alt="Badminton Borne"
              width={232}
              height={84}
              className="h-[68px] w-auto lg:h-[84px]"
            />
            {settings.footerTagline && (
              <p className="max-w-[32ch] text-sm leading-relaxed text-navy-300 lg:text-[15px]">
                {settings.footerTagline}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-6 lg:col-span-2 lg:grid-cols-2 lg:gap-12">
            {columns.map((column) => (
              <div key={column._key} className="flex flex-col gap-2.5 lg:gap-3">
                <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-lime-400 lg:text-[13px]">
                  {column.title}
                </h2>
                {(column.links ?? []).map((link) => (
                  <Link
                    key={link._key}
                    href={localizeHref(link.href, locale)}
                    className="text-sm text-white transition-colors hover:text-lime-400 lg:text-[15px]"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            {settings.contactTitle && (
              <h2 className="hidden text-[13px] font-bold uppercase tracking-[0.14em] text-lime-400 lg:block">
                {settings.contactTitle}
              </h2>
            )}
            {settings.addressLines && (
              <p className="hidden text-[15px] leading-relaxed lg:block">
                {settings.addressLines.split("\n").map((line, i) => (
                  <span
                    key={i}
                    className={i > 0 ? "block text-navy-300" : "block text-white"}
                  >
                    {line}
                  </span>
                ))}
              </p>
            )}
            {settings.email && (
              <a
                href={`mailto:${settings.email}`}
                className="text-sm text-white transition-colors hover:text-lime-400 lg:text-[15px]"
              >
                {settings.email}
              </a>
            )}
            {(settings.socialLinks?.length ?? 0) > 0 && (
              <div className="hidden gap-4 lg:flex">
                {settings.socialLinks!.map((link) => (
                  <a
                    key={link._key}
                    href={link.href ?? "#"}
                    className="text-sm font-semibold text-navy-300 transition-colors hover:text-lime-400"
                    {...(link.href?.startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/8 pt-5 lg:gap-6 lg:pt-6">
          <p className="text-xs text-navy-300 lg:text-[13px]">
            {settings.copyright}
          </p>
          <div className="flex items-center gap-4 text-xs text-navy-300 lg:gap-5 lg:text-[13px]">
            {(settings.legalLinks ?? []).map((link) =>
              link.href?.startsWith("/") && !link.href.includes(".") ? (
                <Link
                  key={link._key}
                  href={localizeHref(link.href, locale)}
                  className="transition-colors hover:text-lime-400"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link._key}
                  href={link.href ?? "#"}
                  className="transition-colors hover:text-lime-400"
                >
                  {link.label}
                </a>
              ),
            )}
            <span>
              <Link
                href={`/nl`}
                className={locale === "nl" ? "text-white" : "transition-colors hover:text-lime-400"}
              >
                NL
              </Link>
              <span> / </span>
              <Link
                href={`/en`}
                className={locale === "en" ? "text-white" : "transition-colors hover:text-lime-400"}
              >
                EN
              </Link>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
