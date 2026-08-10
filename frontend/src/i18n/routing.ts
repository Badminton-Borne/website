import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // NL-only tot na de livegang. De en/ar-berichten in i18n/messages blijven
  // staan: zet de locale hier terug zodra de vertalingen echt worden opgepakt.
  locales: ["nl"],
  defaultLocale: "nl",
  // De standaardtaal draait zonder prefix (/over-ons i.p.v. /nl/over-ons).
  // Een extra taal krijgt straks wél een prefix, dus deze URL's blijven geldig.
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];
