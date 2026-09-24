import "server-only";

import { defineLive } from "next-sanity/live";
import { client } from "./client";

const token = process.env.SANITY_API_READ_TOKEN;
if (!token) {
  console.warn("[sanity] SANITY_API_READ_TOKEN is not set: draft mode and live preview are disabled.");
}

/**
 * `sanityFetch` tags every query so <SanityLive /> can revalidate pages as soon
 * as content is published, with no redeploy. In draft mode it returns drafts
 * and stega-encoded strings for click-to-edit overlays.
 */
export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: token || false,
  browserToken: token || false,
});
