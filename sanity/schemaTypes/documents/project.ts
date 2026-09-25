import { HomeIcon } from "@sanity/icons/Home";
import { defineArrayMember, defineField, defineType } from "sanity";
import { isUniqueInLanguage, languageField, imageSize } from "../shared";

export const PROJECT_STATUSES = [
  { title: "Under construction", value: "under-construction" },
  { title: "Available", value: "available" },
  { title: "Reserved", value: "reserved" },
  { title: "Sold", value: "sold" },
];

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  icon: HomeIcon,
  groups: [
    { name: "overview", title: "Overview", default: true },
    { name: "content", title: "Architecture" },
    { name: "media", title: "Gallery & plans" },
    { name: "sales", title: "Availability" },
    { name: "seo", title: "SEO & page" },
  ],
  fields: [
    languageField,
    defineField({
      name: "name",
      type: "string",
      group: "overview",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      group: "overview",
      options: { source: "name", isUnique: isUniqueInLanguage },
      validation: (R) => R.required(),
    }),
    defineField({
      name: "location",
      type: "string",
      group: "overview",
      description: "Short form, e.g. Recanto do Bosque — Goiânia, Brazil",
    }),
    defineField({
      name: "locationDetail",
      title: "Location (card line)",
      type: "string",
      group: "overview",
      description: "Used on residence cards, e.g. Recanto do Bosque • Goiânia, Goiás",
    }),
    defineField({ name: "area", title: "Area (m²)", type: "number", group: "overview" }),
    defineField({
      name: "bedrooms",
      type: "number",
      group: "overview",
      validation: (R) => R.integer().min(0),
    }),
    defineField({
      name: "bathrooms",
      type: "number",
      group: "overview",
      validation: (R) => R.integer().min(0),
    }),
    defineField({
      name: "typology",
      title: "Typology label",
      type: "string",
      group: "overview",
      description: "e.g. Contemporary Residential Architecture",
    }),
    defineField({
      name: "intro",
      title: "Short introduction",
      type: "richText",
      group: "content",
    }),
    defineField({
      name: "concept",
      title: "Architectural concept",
      type: "array",
      group: "content",
      of: [
        defineArrayMember({ type: "block" }),
        defineArrayMember({
          type: "imageWithAlt",
          validation: imageSize({ width: 1600, height: 1200, minWidth: 1200 }).validation,
        }),
      ],
    }),
    defineField({
      name: "highlights",
      title: "Construction & material highlights",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "mainImage",
      title: "Main exterior image",
      type: "imageWithAlt",
      group: "media",
      ...imageSize({
        width: 2400,
        height: 1400,
        minWidth: 1920,
        note: "Very wide on desktop (21:10) and 4:3 on mobile, so keep the house near the centre and set the hotspot on it.",
      }),
    }),
    defineField({
      name: "gallery",
      type: "array",
      group: "media",
      description:
        "4–6 images in story order: façade, living/kitchen, bedroom, bathroom, outdoor/rear, construction detail. Recommended 2400 × 1600 px each, at least 1600 px wide. Use Crop and Hotspot to choose what stays in the frame.",
      of: [
        defineArrayMember({
          type: "imageWithAlt",
          validation: imageSize({ width: 2400, height: 1600, minWidth: 1600 }).validation,
        }),
      ],
      validation: (R) => R.max(10),
    }),
    defineField({
      name: "floorPlans",
      title: "Floor plans",
      type: "array",
      group: "media",
      of: [defineArrayMember({ type: "annotatedPlan" })],
    }),
    defineField({
      name: "status",
      type: "string",
      group: "sales",
      options: { list: PROJECT_STATUSES, layout: "radio" },
      initialValue: "under-construction",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "availabilityLabel",
      title: "Availability label",
      type: "string",
      group: "sales",
      description:
        "Short label shown next to the status in the pill, e.g. Available. Leave empty to show the status only.",
    }),
    defineField({
      name: "availability",
      title: "Availability text",
      type: "text",
      rows: 2,
      group: "sales",
    }),
    defineField({
      name: "showPrice",
      type: "boolean",
      group: "sales",
      initialValue: false,
    }),
    defineField({
      name: "price",
      type: "string",
      group: "sales",
      description: "Only displayed when “Show price” is on.",
      hidden: ({ parent }) => !parent?.showPrice,
    }),
    defineField({
      name: "showFinancingNote",
      title: "Show financing note",
      description:
        "Shows the independent-lender disclaimer from Site settings on this residence’s card.",
      type: "boolean",
      group: "sales",
      initialValue: false,
    }),
    defineField({
      name: "enquiryInterest",
      title: "Enquiry target",
      description: "Interest pre-selected in the contact form from this project’s buttons.",
      type: "string",
      group: "sales",
      initialValue: "available-residence",
    }),
    defineField({
      name: "pageEnabled",
      title: "Publish project page",
      description:
        "When off, the project URL returns 404 and buttons link to the homepage instead.",
      type: "boolean",
      group: "seo",
      initialValue: false,
    }),
    defineField({ name: "seo", type: "seo", group: "seo" }),
  ],
  preview: {
    select: { title: "name", subtitle: "location", media: "mainImage", language: "language" },
    prepare: ({ title, subtitle, media, language }) => ({
      title,
      subtitle: [language?.toUpperCase(), subtitle].filter(Boolean).join(" · "),
      media,
    }),
  },
});
