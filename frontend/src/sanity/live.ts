import { defineLive } from "next-sanity/live";
import { client } from "./client";

const token = process.env.SANITY_API_READ_TOKEN;

export const { sanityFetch, SanityLive } = defineLive({
  client,
  // `false` = bewust zonder token draaien (alleen gepubliceerde content);
  // met token werken ook live drafts / de Presentation-tool.
  serverToken: token || false,
  browserToken: token || false,
});
