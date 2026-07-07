export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion = "2026-02-01";

/**
 * Zonder project-ID (studio/scripts/setup-sanity.py nog niet gedraaid) valt
 * de site terug op de ingebouwde designcontent uit sanity/defaults.ts.
 */
export const isSanityConfigured = Boolean(projectId);
