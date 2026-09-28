import "server-only";

import { cache } from "react";
import type { Locale } from "@/i18n/routing";
import { withLocaleFallback } from "./fetch";
import { sanityFetch } from "./live";
import { ABOUT_QUERY, HOME_QUERY, JOURNAL_PAGE_QUERY, SETTINGS_QUERY } from "./queries";

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

export const getAbout = cache(async (locale: Locale) =>
  withLocaleFallback(locale, "aboutPage", (language) =>
    sanityFetch({ query: ABOUT_QUERY, params: { language } }),
  ),
);

export const getJournalPage = cache(async (locale: Locale) =>
  withLocaleFallback(locale, "journalPage", (language) =>
    sanityFetch({ query: JOURNAL_PAGE_QUERY, params: { language } }),
  ),
);

export type Settings = NonNullable<Awaited<ReturnType<typeof getSettings>>["data"]>;
export type Home = NonNullable<Awaited<ReturnType<typeof getHome>>["data"]>;
export type About = NonNullable<Awaited<ReturnType<typeof getAbout>>["data"]>;
export type JournalPage = NonNullable<Awaited<ReturnType<typeof getJournalPage>>["data"]>;
