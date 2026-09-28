import { UserIcon } from "@sanity/icons/User";
import { defineArrayMember, defineField, defineType } from "sanity";
import { imageSize, languageField } from "../shared";

/**
 * The founder page. Sections render in a fixed order and hide themselves
 * when they have no content, so nothing needs switching off.
 */
export const aboutPage = defineType({
  name: "aboutPage",
  title: "About page",
  type: "document",
  icon: UserIcon,
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "story", title: "Story" },
    { name: "credentials", title: "Credentials" },
    { name: "philosophy", title: "Philosophy" },
    { name: "closing", title: "Closing" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    languageField,

    // Hero
    defineField({ name: "eyebrow", type: "string", group: "hero", initialValue: "About VATUS" }),
    defineField({
      name: "heading",
      title: "Headline (H1)",
      type: "string",
      group: "hero",
      validation: (R) => R.required(),
    }),
    defineField({ name: "subheading", type: "text", rows: 2, group: "hero" }),
    defineField({
      name: "portrait",
      title: "Founder portrait",
      type: "imageWithAlt",
      group: "hero",
      ...imageSize({
        width: 1200,
        height: 1500,
        minWidth: 900,
        note: "Portrait, shown at 4:5. Architecture or site context preferred.",
      }),
    }),
    defineField({ name: "founderName", type: "string", group: "hero" }),
    defineField({ name: "founderRole", type: "string", group: "hero", initialValue: "Founder" }),

    // Story
    defineField({
      name: "intro",
      title: "Opening narrative",
      type: "richText",
      group: "story",
      description: "The first paragraph is set larger.",
    }),
    defineField({
      name: "chapters",
      type: "array",
      group: "story",
      description: "One chapter per country, in order. Shown as a timeline.",
      of: [
        defineArrayMember({
          name: "chapter",
          type: "object",
          fields: [
            defineField({ name: "country", type: "string", validation: (R) => R.required() }),
            defineField({
              name: "period",
              type: "string",
              description: "e.g. 1999–2008 or A new chapter",
              validation: (R) => R.required(),
            }),
            defineField({ name: "body", type: "richText" }),
            defineField({
              name: "images",
              type: "array",
              description:
                "Up to 3 archive images: projects, drawings or site photos. Recommended 1600 × 1200 px each, at least 1200 px wide.",
              of: [
                defineArrayMember({
                  type: "imageWithAlt",
                  validation: imageSize({ width: 1600, height: 1200, minWidth: 1200 }).validation,
                }),
              ],
              validation: (R) => R.max(3),
            }),
          ],
          preview: {
            select: { country: "country", period: "period", media: "images.0" },
            prepare: ({ country, period, media }) => ({ title: country, subtitle: period, media }),
          },
        }),
      ],
    }),

    // Credentials
    defineField({
      name: "credentialsHeading",
      title: "Heading",
      type: "string",
      group: "credentials",
      initialValue: "Qualifications & memberships",
    }),
    defineField({
      name: "credentials",
      type: "array",
      group: "credentials",
      description:
        "Use the exact official titles once verified for publication. The section is hidden while this list is empty.",
      of: [
        defineArrayMember({
          name: "credential",
          type: "object",
          fields: [
            defineField({
              name: "title",
              type: "string",
              description: "e.g. the qualification or membership, exactly as issued",
              validation: (R) => R.required(),
            }),
            defineField({ name: "issuer", title: "Institution or body", type: "string" }),
            defineField({ name: "year", type: "string" }),
          ],
          preview: { select: { title: "title", subtitle: "issuer" } },
        }),
      ],
    }),

    // Philosophy
    defineField({ name: "philosophyEyebrow", title: "Eyebrow", type: "string", group: "philosophy", initialValue: "Founder philosophy" }),
    defineField({ name: "philosophyHeading", title: "Heading", type: "string", group: "philosophy" }),
    defineField({
      name: "beliefs",
      type: "array",
      group: "philosophy",
      description: "One short sentence each.",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({ name: "philosophyClosing", title: "Closing line", type: "text", rows: 2, group: "philosophy" }),

    // Closing
    defineField({ name: "closingStatement", title: "Statement", type: "text", rows: 2, group: "closing" }),
    defineField({ name: "closingSupporting", title: "Supporting line", type: "string", group: "closing" }),
    defineField({ name: "primaryCta", title: "Primary button", type: "cta", group: "closing" }),
    defineField({ name: "secondaryCta", title: "Secondary button", type: "cta", group: "closing" }),

    defineField({ name: "seo", type: "seo", group: "seo" }),
  ],
  preview: {
    select: { language: "language" },
    prepare: ({ language }) => ({ title: `About page (${language?.toUpperCase() ?? "?"})` }),
  },
});
