import { createClient } from "next-sanity";
import { apiVersion, dataset, isSanityConfigured, projectId } from "./env";

/**
 * Server-side client mét schrijfrechten, uitsluitend voor API-routes
 * (contactformulier, nieuwsbrief). Vereist SANITY_API_WRITE_TOKEN in
 * frontend/.env.local — een token met Editor-rechten, nooit in de browser.
 */
const token = process.env.SANITY_API_WRITE_TOKEN;

export const canWriteToSanity = Boolean(isSanityConfigured && token);

export const writeClient = createClient({
  projectId: isSanityConfigured ? projectId : "unconfigured",
  dataset,
  apiVersion,
  token,
  useCdn: false,
});
