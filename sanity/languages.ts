export const supportedLanguages = [
  { id: "pt", title: "Português" },
  { id: "en", title: "English" },
] as const;

export type LanguageId = (typeof supportedLanguages)[number]["id"];

export const localizedTypes = [
  "siteSettings",
  "homePage",
  "project",
  "article",
  "category",
  "author",
] as const;

export const singletonTypes = ["siteSettings", "homePage"] as const;
