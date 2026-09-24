import "server-only";

import { cache } from "react";
import type { Locale } from "@/i18n/routing";
import { withLocaleFallback } from "./fetch";
import { sanityFetch } from "./live";
import { HOME_QUERY, SETTINGS_QUERY } from "./queries";

export const getSettings = cache(async (locale: Locale) =>
  withLocaleFallback(locale, "siteSettings", (language) =>
    sanityFetch({ query: SETTINGS_QUERY, params: { language } }),
  ),
);

export const getHome = cache(async (locale: Locale) =>
  withLocaleFallback(locale, "homePage", (language) =>
    sanityFetch({ query: HOME_QUERY, params: { language } }),
  ),
);

export type Settings = NonNullable<Awaited<ReturnType<typeof getSettings>>["data"]>;
export type Home = NonNullable<Awaited<ReturnType<typeof getHome>>["data"]>;
