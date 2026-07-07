import { createClient } from "next-sanity";
import { apiVersion, dataset, isSanityConfigured, projectId } from "./env";

export const client = createClient({
  // Placeholder-ID houdt de client construeerbaar zolang Sanity nog niet is
  // gekoppeld; er wordt dan nooit gefetcht (zie lib/content.ts).
  projectId: isSanityConfigured ? projectId : "unconfigured",
  dataset,
  apiVersion,
  useCdn: true,
});
