import { defineField, defineType } from "sanity";
import { imageSize } from "../shared";

export const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: "title",
      title: "Meta title",
      type: "string",
      validation: (Rule) => Rule.max(70).warning("Keep titles under 70 characters."),
    }),
    defineField({
      name: "description",
      title: "Meta description",
      type: "text",
      rows: 3,
      validation: (Rule) =>
        Rule.max(170).warning("Keep descriptions under 170 characters."),
    }),
    defineField({
      name: "shareImage",
      title: "Share image",
      type: "imageWithAlt",
      ...imageSize({
        width: 1200,
        height: 630,
        minWidth: 1200,
        note: "Preview shown when the page is shared on WhatsApp, Instagram or LinkedIn. Cropped to 1200 × 630.",
      }),
    }),
    defineField({
      name: "noIndex",
      title: "Hide from search engines",
      type: "boolean",
      initialValue: false,
    }),
  ],
});
