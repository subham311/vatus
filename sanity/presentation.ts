import { defineDocuments, defineLocations, type PresentationPluginOptions } from "sanity/presentation";

const localePrefix = (language?: string) => (language === "en" ? "/en" : "");

/** Maps documents to front-end URLs so the Presentation tool can open them. */
export const resolve: PresentationPluginOptions["resolve"] = {
  mainDocuments: defineDocuments([
    { route: "/", filter: `_type == "homePage" && language == "pt"` },
    { route: "/en", filter: `_type == "homePage" && language == "en"` },
    { route: "/about", filter: `_type == "aboutPage" && language == "pt"` },
    { route: "/en/about", filter: `_type == "aboutPage" && language == "en"` },
    { route: "/journal", filter: `_type == "journalPage" && language == "pt"` },
    { route: "/en/journal", filter: `_type == "journalPage" && language == "en"` },
    { route: "/privacy", filter: `_type == "privacyPage" && language == "pt"` },
    { route: "/en/privacy", filter: `_type == "privacyPage" && language == "en"` },
    {
      route: "/projects/:slug",
      filter: `_type == "project" && language == "pt" && slug.current == $slug`,
    },
    {
      route: "/en/projects/:slug",
      filter: `_type == "project" && language == "en" && slug.current == $slug`,
    },
    {
      route: "/journal/:slug",
      filter: `_type == "article" && language == "pt" && slug.current == $slug`,
    },
    {
      route: "/en/journal/:slug",
      filter: `_type == "article" && language == "en" && slug.current == $slug`,
    },
  ]),
  locations: {
    homePage: defineLocations({
      select: { language: "language" },
      resolve: (doc) => ({
        locations: [{ title: "Homepage", href: localePrefix(doc?.language) || "/" }],
      }),
    }),
    aboutPage: defineLocations({
      select: { language: "language" },
      resolve: (doc) => ({
        locations: [{ title: "About", href: `${localePrefix(doc?.language)}/about` }],
      }),
    }),
    journalPage: defineLocations({
      select: { language: "language" },
      resolve: (doc) => ({
        locations: [{ title: "Journal", href: `${localePrefix(doc?.language)}/journal` }],
      }),
    }),
    privacyPage: defineLocations({
      select: { language: "language" },
      resolve: (doc) => ({
        locations: [{ title: "Privacy policy", href: `${localePrefix(doc?.language)}/privacy` }],
      }),
    }),
    siteSettings: defineLocations({
      select: { language: "language" },
      message: "Used on every page",
      tone: "positive",
      resolve: (doc) => ({
        locations: [{ title: "Homepage", href: localePrefix(doc?.language) || "/" }],
      }),
    }),
    project: defineLocations({
      select: { name: "name", slug: "slug.current", language: "language" },
      resolve: (doc) => ({
        locations: [
          { title: doc?.name || "Project", href: `${localePrefix(doc?.language)}/projects/${doc?.slug}` },
          { title: "Homepage", href: localePrefix(doc?.language) || "/" },
        ],
      }),
    }),
    article: defineLocations({
      select: { title: "title", slug: "slug.current", language: "language" },
      resolve: (doc) => ({
        locations: [
          { title: doc?.title || "Article", href: `${localePrefix(doc?.language)}/journal/${doc?.slug}` },
          { title: "Journal", href: `${localePrefix(doc?.language)}/journal` },
        ],
      }),
    }),
  },
};
