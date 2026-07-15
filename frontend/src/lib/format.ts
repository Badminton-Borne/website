/** "maandag" → "Maandag" */
export function capitalizeDay(day: string | null | undefined): string {
  if (!day) return "";
  return day.charAt(0).toUpperCase() + day.slice(1);
}

/** "maandag" → "Ma" (mobiele weergave in het trainingstijden-blok) */
export function abbreviateDay(day: string | null | undefined): string {
  if (!day) return "";
  return capitalizeDay(day).slice(0, 2);
}

/** 4.8 → "4,8" */
export function formatScore(score: number | null | undefined): string {
  if (score == null) return "";
  return score.toLocaleString("nl-NL", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

/** 5 → "★★★★★" */
export function stars(rating: number | null | undefined): string {
  const n = Math.max(0, Math.min(5, Math.round(rating ?? 5)));
  return "★".repeat(n);
}

/** "2026-07-06T…" → "6 juli 2026" (nieuwskaarten en detailpagina, nl-NL) */
export function formatNewsDate(date: string | null | undefined): string {
  if (!date) return "";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** "2026-08-15T…" → "15" (datumblok in de agenda) */
export function formatEventDay(date: string | null | undefined): string {
  if (!date) return "";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "";
  return String(parsed.getDate());
}

/** "2026-08-15T…" → "Aug" (datumblok in de agenda) */
export function formatEventMonth(date: string | null | undefined): string {
  if (!date) return "";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "";
  const month = parsed.toLocaleDateString("nl-NL", { month: "short" });
  return capitalizeDay(month.replace(/\.$/, ""));
}

/**
 * Startjaartal → "X jaar ervaring", berekend t.o.v. vandaag zodat het nooit
 * handmatig bijgewerkt hoeft. 2008 → "18 jaar ervaring" (in 2026).
 * Leeg of korter dan een jaar actief → "" (chip verbergen).
 */
export function experienceChip(activeSince: number | null | undefined): string {
  if (activeSince == null) return "";
  const years = new Date().getFullYear() - activeSince;
  if (years < 1) return "";
  return `${years} jaar ervaring`;
}
