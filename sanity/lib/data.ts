import "server-only";

import { stegaClean } from "next-sanity";
import { cache } from "react";
import type { Locale } from "@/i18n/routing";
import { withLocaleFallback } from "./fetch";
import { sanityFetch } from "./live";
import { ABOUT_QUERY, HOME_QUERY, JOURNAL_PAGE_QUERY, PRIVACY_QUERY, PROJECTS_INDEX_QUERY, PROJECTS_PAGE_QUERY, SETTINGS_QUERY } from "./queries";

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

export const getPrivacy = cache(async (locale: Locale) =>
  withLocaleFallback(locale, "privacyPage", (language) =>
    sanityFetch({ query: PRIVACY_QUERY, params: { language } }),
  ),
);

export const getProjectsPage = cache(async (locale: Locale) =>
  withLocaleFallback(locale, "projectsPage", (language) =>
    sanityFetch({ query: PROJECTS_PAGE_QUERY, params: { language } }),
  ),
);

/** Cards shown in the homepage's Available residences section unless an editor sets a number. */
export const DEFAULT_RESIDENCE_CARDS = 2;

/** The /projects index is only needed once there are more project pages than the homepage shows. */
export function projectsIndexActive(projectPages: number, maxCards: number | null | undefined) {
  return projectPages > (maxCards ?? DEFAULT_RESIDENCE_CARDS);
}

/**
 * Projects for the /projects index, in the same language the homepage is
 * served in (so a missing translation falls back to English consistently).
 */
export const getProjectsIndex = cache(async (locale: Locale) => {
  const { data: home, language } = await getHome(locale);
  const { data: projects } = await sanityFetch({ query: PROJECTS_INDEX_QUERY, params: { language } });
  const maxCards = stegaClean(home?.availableResidences?.maxCards) ?? DEFAULT_RESIDENCE_CARDS;
  return { projects, maxCards, active: projectsIndexActive(projects.length, maxCards) };
});

export type Settings = NonNullable<Awaited<ReturnType<typeof getSettings>>["data"]>;
export type Home = NonNullable<Awaited<ReturnType<typeof getHome>>["data"]>;
export type About = NonNullable<Awaited<ReturnType<typeof getAbout>>["data"]>;
export type JournalPage = NonNullable<Awaited<ReturnType<typeof getJournalPage>>["data"]>;
export type ProjectsPage = NonNullable<Awaited<ReturnType<typeof getProjectsPage>>["data"]>;
export type ProjectsIndexItem = Awaited<ReturnType<typeof getProjectsIndex>>["projects"][number];
export type Privacy = NonNullable<Awaited<ReturnType<typeof getPrivacy>>["data"]>;
