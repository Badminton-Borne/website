"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandButton } from "@/components/ui/BrandButton";
import { localizeHref } from "@/lib/links";
import type { SiteSettingsData } from "@/sanity/types";

interface SiteHeaderProps {
  settings: SiteSettingsData;
  locale: string;
}

function LocaleSwitch({
  locale,
  className = "",
}: {
  locale: string;
  className?: string;
}) {
  const pathname = usePathname();

  function pathFor(target: string) {
    const segments = pathname.split("/");
    if (segments[1] === locale) segments[1] = target;
    else segments.splice(1, 0, target);
    return segments.join("/") || `/${target}`;
  }

  return (
    <span
      className={`text-sm font-semibold ${className}`}
      role="navigation"
      aria-label="Taalkeuze"
    >
      {(["nl", "en"] as const).map((l, i) => (
        <span key={l}>
          {i > 0 && <span className="text-navy-300"> / </span>}
          {l === locale ? (
            <span className="text-white" aria-current="true">
              {l.toUpperCase()}
            </span>
          ) : (
            <Link
              href={pathFor(l)}
              className="text-navy-300 transition-colors hover:text-lime-400"
            >
              {l.toUpperCase()}
            </Link>
          )}
        </span>
      ))}
    </span>
  );
}

export function SiteHeader({ settings, locale }: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  const nav = settings.mainNav ?? [];
  const primary = settings.headerPrimaryCta;
  const secondary = settings.headerSecondaryCta;
  const announcement = settings.announcement;
  const showAnnouncement = Boolean(announcement?.enabled && announcement?.text);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-lock + Escape + focus wanneer het mobiele menu open is
  useEffect(() => {
    if (!menuOpen) return;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  // Home (de locale-root, bv. /nl) telt alleen bij een exacte match —
  // anders "begint" elke pagina met de home-URL en is Home altijd actief.
  const isActive = (href: string) =>
    href === `/${locale}`
      ? pathname === href || pathname === `${href}/`
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
    <header
      data-site-header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ease-brand ${
        scrolled
          ? "border-b border-white/8 bg-[rgba(9,18,37,0.85)] backdrop-blur-[12px]"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      {/* Aankondigingsbalk (artboard 4b, variant B) — sitewide aan/uit via Sanity */}
      {showAnnouncement && (
        <div
          data-announcement-bar
          className="flex h-10 items-center justify-center gap-3.5 bg-lime-400 px-4"
        >
          <p className="truncate text-sm font-bold text-navy-900">
            {announcement!.text}
          </p>
          {announcement!.linkLabel && announcement!.link && (
            <Link
              href={localizeHref(announcement!.link, locale)}
              className="whitespace-nowrap text-sm font-extrabold text-navy-900 underline"
            >
              {announcement!.linkLabel} <span aria-hidden="true">→</span>
            </Link>
          )}
        </div>
      )}
      <div className="flex items-center justify-between gap-6 px-5 py-3.5 lg:px-12 lg:py-[18px]">
        <Link
          href={`/${locale}`}
          className="shrink-0"
          aria-label="Badminton Borne — naar de homepage"
        >
          <Image
            src="/logos/logo-borne-horizontaal.svg"
            alt="Badminton Borne"
            width={177}
            height={64}
            priority
            className="h-[38px] w-auto lg:h-16"
          />
        </Link>

        {/* Desktop-navigatie */}
        <nav className="hidden gap-7 xl:flex" aria-label="Hoofdmenu">
          {nav.map((item) => (
            <Link
              key={item._key}
              href={localizeHref(item.href, locale)}
              className={`text-[15px] transition-colors hover:text-lime-400 ${
                isActive(localizeHref(item.href, locale))
                  ? "border-b-[3px] border-lime-400 pb-1 font-bold text-lime-400"
                  : "font-semibold text-white"
              }`}
              aria-current={
                isActive(localizeHref(item.href, locale)) ? "page" : undefined
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-5 xl:flex">
          <LocaleSwitch locale={locale} />
          {secondary?.label && (
            <BrandButton
              href={localizeHref(secondary.href, locale)}
              variant="outline-light"
              size="sm"
            >
              {secondary.label}
            </BrandButton>
          )}
          {primary?.label && (
            <BrandButton
              href={localizeHref(primary.href, locale)}
              variant="primary"
              size="sm"
            >
              {primary.label}
            </BrandButton>
          )}
        </div>

        {/* Hamburger (mobiel) */}
        <button
          type="button"
          className="flex flex-col gap-[5px] p-2 xl:hidden"
          onClick={() => setMenuOpen(true)}
          aria-expanded={menuOpen}
          aria-haspopup="dialog"
          aria-label="Menu openen"
        >
          <span className="h-[2.5px] w-6 rounded-full bg-white" />
          <span className="h-[2.5px] w-6 rounded-full bg-white" />
          <span className="h-[2.5px] w-4 rounded-full bg-lime-400" />
        </button>
      </div>
    </header>

      {/* Mobiel menu: fullscreen navy overlay met grote lime links.
          Bewust buiten <header>: de backdrop-filter daar zou dit fixed
          element anders aan de headerbox koppelen. */}
      {menuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-navy-950 xl:hidden"
          onClick={(e) => {
            // Sluit het menu zodra er ergens op een link wordt geklikt
            if ((e.target as Element).closest("a")) setMenuOpen(false);
          }}
        >
          <div className="flex items-center justify-between px-5 py-3.5">
            <Image
              src="/logos/logo-borne-horizontaal.svg"
              alt="Badminton Borne"
              width={106}
              height={38}
              className="h-[38px] w-auto"
            />
            <button
              ref={closeButtonRef}
              type="button"
              className="p-2 text-white transition-colors hover:text-lime-400"
              onClick={() => setMenuOpen(false)}
              aria-label="Menu sluiten"
            >
              <svg
                className="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.2}
                aria-hidden="true"
              >
                <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav
            className="flex flex-1 flex-col gap-5 px-6 py-10"
            aria-label="Hoofdmenu"
          >
            {nav.map((item) => (
              <Link
                key={item._key}
                href={localizeHref(item.href, locale)}
                className="font-display text-[26px] font-extrabold uppercase tracking-tight text-lime-400 transition-colors hover:text-lime-300"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-3 border-t border-white/8 px-6 py-8 pb-[max(2rem,env(safe-area-inset-bottom))]">
            {primary?.label && (
              <BrandButton
                href={localizeHref(primary.href, locale)}
                variant="primary"
                size="lg"
                fullWidth
              >
                {primary.label}
              </BrandButton>
            )}
            {secondary?.label && (
              <BrandButton
                href={localizeHref(secondary.href, locale)}
                variant="outline-light"
                size="md"
                fullWidth
              >
                {secondary.label}
              </BrandButton>
            )}
            <div className="pt-2 text-center">
              <LocaleSwitch locale={locale} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
