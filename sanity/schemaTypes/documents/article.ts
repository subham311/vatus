import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { defineArrayMember, defineField, defineType } from "sanity";
import { isUniqueInLanguage, languageField, imageSize } from "../shared";

export const article = defineType({
  name: "article",
  title: "Journal article",
  type: "document",
  icon: DocumentTextIcon,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "meta", title: "Details" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    languageField,
    defineField({
      name: "title",
      type: "string",
      group: "content",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      group: "content",
      options: { source: "title", isUnique: isUniqueInLanguage },
      validation: (R) => R.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Short introduction",
      type: "text",
      rows: 3,
      group: "content",
      validation: (R) => R.max(280),
    }),
    defineField({
      name: "heroImage",
      type: "imageWithAlt",
      group: "content",
      ...imageSize({ width: 2400, height: 1350, minWidth: 1200, note: "Shown at 16:9 on the article and 4:3 on journal cards." }),
    }),
    defineField({
      name: "body",
      type: "array",
      group: "content",
      description: "Reading time is calculated automatically from this text.",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Paragraph", value: "normal" },
            { title: "Heading", value: "h2" },
            { title: "Subheading", value: "h3" },
            { title: "Quote", value: "blockquote" },
          ],
        }),
        defineArrayMember({
          type: "imageWithAlt",
          validation: imageSize({ width: 1600, height: 1200, minWidth: 1200 }).validation,
        }),
        defineArrayMember({ type: "diagram" }),
        defineArrayMember({ type: "pullQuote" }),
      ],
    }),
    defineField({
      name: "category",
      type: "reference",
      to: [{ type: "category" }],
      group: "meta",
    }),
    defineField({
      name: "author",
      type: "reference",
      to: [{ type: "author" }],
      group: "meta",
    }),
    defineField({
      name: "publishedAt",
      title: "Publication date",
      type: "datetime",
      group: "meta",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "relatedArticles",
      type: "array",
      group: "meta",
      description: "Up to 3. Leave empty to show the latest articles instead.",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "article" }],
          options: {
            // Same language, and never the article itself.
            filter: ({ document }) => ({
              filter: "language == $language && !(_id in [$id, $draft])",
              params: {
                language: (document as { language?: string }).language,
                id: document._id.replace(/^drafts\./, ""),
                draft: `drafts.${document._id.replace(/^drafts\./, "")}`,
              },
            }),
          },
        }),
      ],
      validation: (R) => R.max(3).unique(),
    }),
    defineField({ name: "seo", type: "seo", group: "seo" }),
    defineField({
      name: "socialImage",
      title: "Social share image",
      type: "imageWithAlt",
      group: "seo",
      ...imageSize({ width: 1200, height: 630, minWidth: 1200, note: "Overrides the hero image when shared. Cropped to 1200 × 630." }),
    }),
  ],
  orderings: [
    {
      title: "Publication date, newest",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", date: "publishedAt", media: "heroImage", language: "language" },
    prepare: ({ title, date, media, language }) => ({
      title,
      subtitle: [language?.toUpperCase(), date?.slice(0, 10)].filter(Boolean).join(" · "),
      media,
    }),
  },
});
