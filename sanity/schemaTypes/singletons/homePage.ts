import { HomeIcon } from "@sanity/icons/Home";
import {
  defineArrayMember,
  defineField,
  defineType,
  type FieldDefinition,
} from "sanity";
import { languageField, imageSize } from "../shared";

/**
 * Each homepage section is an object in its own Studio group with an
 * `enabled` switch. The order of sections is fixed in code.
 */
function section(name: string, title: string, fields: FieldDefinition[]) {
  return defineField({
    name,
    title,
    type: "object",
    group: name,
    options: { collapsible: false },
    fields: [
      defineField({
        name: "enabled",
        title: "Show this section",
        type: "boolean",
        initialValue: true,
      }),
      ...fields,
    ],
  });
}

const heading = (initialValue?: string) =>
  defineField({ name: "heading", type: "string", initialValue });

const SECTIONS = [
  ["hero", "01 Hero"],
  ["manifesto", "02 Manifesto"],
  ["brandStatement", "03 Brand statement"],
  ["selectedResidence", "04 Selected residence"],
  ["projectGallery", "05 Project gallery"],
  ["floorPlan", "06 Floor plan"],
  ["designPrinciples", "07 Design principles"],
  ["constructionQuality", "08 Construction quality"],
  ["materials", "09 Materials"],
  ["intelligentResources", "10 Intelligent use of resources"],
  ["internationalExperience", "11 International experience"],
  ["availableResidences", "12 Available residences"],
  ["journalPreview", "13 Journal preview"],
  ["contact", "14 Contact"],
] as const;

export const homePage = defineType({
  name: "homePage",
  title: "Homepage",
  type: "document",
  icon: HomeIcon,
  groups: [
    ...SECTIONS.map(([name, title], i) => ({ name, title, default: i === 0 })),
    { name: "seo", title: "SEO" },
  ],
  fields: [
    languageField,
    section("hero", "01 Hero", [
      defineField({ name: "heading", title: "Headline (H1)", type: "string" }),
      defineField({ name: "subheading", type: "text", rows: 3 }),
      defineField({
        name: "image",
        type: "imageWithAlt",
        ...imageSize({
          width: 2400,
          height: 1600,
          minWidth: 1920,
          note: "One exceptional landscape architectural image. No carousels. Shown full screen, so keep the subject near the hotspot.",
        }),
      }),
      defineField({ name: "locationTag", type: "string" }),
      defineField({ name: "primaryCta", title: "Primary button", type: "cta" }),
      defineField({ name: "secondaryCta", title: "Secondary button", type: "cta" }),
    ]),
    section("manifesto", "02 Manifesto", [
      heading(),
      defineField({ name: "body", type: "richText" }),
      defineField({
        name: "image",
        title: "Interior image",
        type: "imageWithAlt",
        ...imageSize({ width: 2000, height: 800, note: "Wide panoramic landscape, shown at 5:2." }),
      }),
    ]),
    section("brandStatement", "03 Brand statement", [
      defineField({ name: "statement", type: "text", rows: 2 }),
      defineField({ name: "supporting", title: "Supporting line", type: "text", rows: 2 }),
    ]),
    section("selectedResidence", "04 Selected residence", [
      defineField({ name: "eyebrow", type: "string" }),
      defineField({
        name: "project",
        type: "reference",
        to: [{ type: "project" }],
        description:
          "Its main image, facts, gallery (section 05) and floor plan (section 06) are used.",
      }),
      defineField({ name: "exploreLabel", title: "Explore button label", type: "string" }),
      defineField({ name: "enquireLabel", title: "Enquire button label", type: "string" }),
    ]),
    section("projectGallery", "05 Project gallery", [
      defineField({
        name: "heading",
        type: "string",
        description: "Read by screen readers. Shown visually only if “Show heading” is on.",
      }),
      defineField({ name: "showHeading", type: "boolean", initialValue: false }),
      defineField({
        name: "maxImages",
        title: "Number of images",
        type: "number",
        initialValue: 6,
        validation: (R) => R.min(4).max(6).integer(),
      }),
    ]),
    section("floorPlan", "06 Floor plan", [
      heading(),
      defineField({ name: "intro", type: "text", rows: 2 }),
      defineField({ name: "fullScreenLabel", type: "string" }),
    ]),
    section("designPrinciples", "07 Design principles", [
      heading(),
      defineField({
        name: "principles",
        type: "array",
        of: [defineArrayMember({ type: "principle" })],
        validation: (R) => R.max(5),
      }),
    ]),
    section("constructionQuality", "08 Construction quality", [
      heading(),
      defineField({ name: "body", type: "richText" }),
      defineField({
        name: "items",
        type: "array",
        of: [defineArrayMember({ type: "qualityItem" })],
      }),
      defineField({ name: "closing", type: "text", rows: 2 }),
    ]),
    section("materials", "09 Materials", [
      heading(),
      defineField({ name: "body", type: "richText" }),
      defineField({ name: "closing", title: "Closing line", type: "string" }),
      defineField({
        name: "items",
        type: "array",
        of: [defineArrayMember({ type: "material" })],
      }),
    ]),
    section("intelligentResources", "10 Intelligent use of resources", [
      heading(),
      defineField({ name: "body", type: "richText" }),
      defineField({
        name: "image",
        title: "Process or detail image",
        type: "imageWithAlt",
        ...imageSize({ width: 1600, height: 1280, note: "Shown at 5:4." }),
      }),
    ]),
    section("internationalExperience", "11 International experience", [
      heading(),
      defineField({
        name: "timeline",
        type: "array",
        of: [defineArrayMember({ type: "timelineItem" })],
      }),
      defineField({ name: "note", type: "text", rows: 3 }),
      defineField({ name: "cta", title: "Button", type: "cta" }),
    ]),
    section("availableResidences", "12 Available residences", [
      defineField({ name: "eyebrow", type: "string" }),
      defineField({
        name: "projects",
        type: "array",
        of: [defineArrayMember({ type: "reference", to: [{ type: "project" }] })],
        validation: (R) => R.unique(),
      }),
      defineField({
        name: "maxCards",
        title: "Number of cards",
        type: "number",
        initialValue: 2,
        description:
          "How many of the projects above show here. Once more projects have their page enabled than this, a Projects page (/projects) switches on and a “View all” link appears.",
        validation: (R) => R.min(1).max(6).integer(),
      }),
      defineField({ name: "viewLabel", title: "View button label", type: "string" }),
      defineField({ name: "enquireLabel", title: "Enquire button label", type: "string" }),
      defineField({ name: "viewAllLabel", title: "“View all” link label", type: "string" }),
    ]),
    section("journalPreview", "13 Journal preview", [
      heading(),
      defineField({ name: "intro", type: "text", rows: 2 }),
      defineField({
        name: "mode",
        type: "string",
        initialValue: "latest",
        options: {
          layout: "radio",
          list: [
            { title: "Latest 3 articles", value: "latest" },
            { title: "Choose articles", value: "manual" },
          ],
        },
      }),
      defineField({
        name: "articles",
        type: "array",
        of: [defineArrayMember({ type: "reference", to: [{ type: "article" }] })],
        hidden: ({ parent }) => parent?.mode !== "manual",
        validation: (R) => R.max(3).unique(),
      }),
      defineField({ name: "cta", title: "Button", type: "cta" }),
    ]),
    section("contact", "14 Contact", [
      heading(),
      defineField({ name: "subheading", type: "string" }),
      defineField({ name: "body", type: "text", rows: 3 }),
    ]),
    defineField({ name: "seo", type: "seo", group: "seo" }),
  ],
  preview: {
    select: { language: "language" },
    prepare: ({ language }) => ({ title: `Homepage (${language?.toUpperCase() ?? "?"})` }),
  },
});
