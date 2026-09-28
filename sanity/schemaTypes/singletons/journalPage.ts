import { DocumentsIcon } from "@sanity/icons/Documents";
import { defineField, defineType } from "sanity";
import { imageSize, languageField } from "../shared";

/**
 * The Journal index. Articles are listed automatically, newest first; this
 * document only holds the page copy around them.
 */
export const journalPage = defineType({
  name: "journalPage",
  title: "Journal page",
  type: "document",
  icon: DocumentsIcon,
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "featured", title: "Featured" },
    { name: "closing", title: "Closing" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    languageField,

    // Hero
    defineField({ name: "eyebrow", type: "string", group: "hero", initialValue: "Journal" }),
    defineField({
      name: "heading",
      title: "Headline (H1)",
      type: "string",
      group: "hero",
      validation: (R) => R.required(),
    }),
    defineField({ name: "intro", type: "text", rows: 2, group: "hero" }),
    defineField({
      name: "heroImage",
      type: "imageWithAlt",
      group: "hero",
      ...imageSize({
        width: 2400,
        height: 1200,
        minWidth: 1600,
        note: "Optional. Landscape, shown at 2:1 on desktop. Without an image the hero is set as typography only.",
      }),
    }),

    // Featured
    defineField({
      name: "featuredArticle",
      type: "reference",
      group: "featured",
      to: [{ type: "article" }],
      description: "Optional. Shown as a large feature below the grid and left out of the grid itself.",
      options: {
        filter: ({ document }) => ({
          filter: "language == $language",
          params: { language: (document as { language?: string }).language },
        }),
      },
    }),
    defineField({ name: "featuredLabel", title: "Label", type: "string", group: "featured", initialValue: "Featured" }),

    // Closing
    defineField({ name: "closingStatement", title: "Statement", type: "string", group: "closing" }),
    defineField({ name: "closingCta", title: "Button", type: "cta", group: "closing" }),

    defineField({ name: "seo", type: "seo", group: "seo" }),
  ],
  preview: {
    select: { language: "language" },
    prepare: ({ language }) => ({ title: `Journal page (${language?.toUpperCase() ?? "?"})` }),
  },
});
