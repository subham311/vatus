import { defineField, defineType } from "sanity";
import { imageSize } from "../shared";

export const timelineItem = defineType({
  name: "timelineItem",
  title: "Timeline item",
  type: "object",
  fields: [
    defineField({ name: "country", type: "string", validation: (R) => R.required() }),
    defineField({
      name: "period",
      type: "string",
      description: "e.g. 1999–2008 or Today",
      validation: (R) => R.required(),
    }),
    defineField({ name: "text", type: "text", rows: 3 }),
  ],
  preview: {
    select: { country: "country", period: "period", subtitle: "text" },
    prepare: ({ country, period, subtitle }) => ({
      title: `${country ?? ""} | ${period ?? ""}`,
      subtitle,
    }),
  },
});

export const PRINCIPLE_ICONS = [
  { title: "Space", value: "space" },
  { title: "Light", value: "light" },
  { title: "Air", value: "air" },
  { title: "Temperature", value: "temperature" },
  { title: "Sound", value: "sound" },
];

export const principle = defineType({
  name: "principle",
  title: "Principle",
  type: "object",
  fields: [
    defineField({
      name: "key",
      type: "string",
      description: "Stable identifier, not shown on the site.",
      validation: (R) => R.required(),
    }),
    defineField({ name: "title", type: "string", validation: (R) => R.required() }),
    defineField({ name: "text", type: "text", rows: 3 }),
    defineField({
      name: "icon",
      type: "string",
      options: { list: PRINCIPLE_ICONS, layout: "dropdown" },
      validation: (R) => R.required(),
    }),
  ],
  preview: { select: { title: "title", subtitle: "text" } },
});

export const qualityItem = defineType({
  name: "qualityItem",
  title: "Quality item",
  type: "object",
  fields: [
    defineField({ name: "title", type: "string", validation: (R) => R.required() }),
    defineField({
      name: "image",
      type: "imageWithAlt",
      ...imageSize({
        width: 1000,
        height: 1250,
        note: "Real construction photography only. Items without an image appear in the text list only. Portrait, shown at 4:5.",
      }),
    }),
  ],
  preview: { select: { title: "title", media: "image" } },
});

export const material = defineType({
  name: "material",
  title: "Material",
  type: "object",
  fields: [
    defineField({ name: "title", type: "string", validation: (R) => R.required() }),
    defineField({
      name: "image",
      type: "imageWithAlt",
      ...imageSize({ width: 1000, height: 1250, note: "Portrait, shown at 4:5." }),
    }),
  ],
  preview: { select: { title: "title", media: "image" } },
});

export const planAnnotation = defineType({
  name: "planAnnotation",
  title: "Plan annotation",
  type: "object",
  fields: [
    defineField({
      name: "number",
      type: "number",
      validation: (R) => R.required().integer().min(1),
    }),
    defineField({ name: "title", type: "string", validation: (R) => R.required() }),
    defineField({ name: "text", type: "text", rows: 2 }),
    defineField({
      name: "x",
      title: "Horizontal position (%)",
      description: "0 is the left edge of the plan, 100 the right edge.",
      type: "number",
      validation: (R) => R.required().min(0).max(100),
    }),
    defineField({
      name: "y",
      title: "Vertical position (%)",
      description: "0 is the top edge of the plan, 100 the bottom edge.",
      type: "number",
      validation: (R) => R.required().min(0).max(100),
    }),
  ],
  preview: {
    select: { number: "number", title: "title", subtitle: "text" },
    prepare: ({ number, title, subtitle }) => ({ title: `${number}. ${title}`, subtitle }),
  },
});

export const annotatedPlan = defineType({
  name: "annotatedPlan",
  title: "Annotated floor plan",
  type: "object",
  fields: [
    defineField({ name: "title", type: "string", description: "e.g. Ground floor" }),
    defineField({
      name: "image",
      type: "imageWithAlt",
      ...imageSize({
        width: 2400,
        height: 1600,
        minWidth: 1600,
        note: "A redrawn presentation plan, not a raw CAD sheet. Shown whole (never cropped) and zoomable, so export it large with a plain background.",
      }),
    }),
    defineField({
      name: "annotations",
      type: "array",
      of: [{ type: "planAnnotation" }],
    }),
  ],
  preview: { select: { title: "title", media: "image" } },
});

export const interestOption = defineType({
  name: "interestOption",
  title: "Interest option",
  type: "object",
  fields: [
    defineField({
      name: "value",
      type: "string",
      description:
        "Stable key. Keep “available-residence” so residence buttons can pre-select it.",
      validation: (R) => R.required(),
    }),
    defineField({ name: "label", type: "string", validation: (R) => R.required() }),
  ],
  preview: { select: { title: "label", subtitle: "value" } },
});

export const pullQuote = defineType({
  name: "pullQuote",
  title: "Pull quote",
  type: "object",
  fields: [
    defineField({ name: "quote", type: "text", rows: 3, validation: (R) => R.required() }),
    defineField({ name: "attribution", type: "string" }),
  ],
  preview: { select: { title: "quote", subtitle: "attribution" } },
});

export const diagram = defineType({
  name: "diagram",
  title: "Diagram",
  type: "object",
  fields: [
    defineField({
      name: "image",
      type: "imageWithAlt",
      ...imageSize({ width: 2000, height: 1250, minWidth: 1400, required: true, note: "Shown at its natural proportions." }),
    }),
    defineField({ name: "wide", type: "boolean", initialValue: true }),
  ],
  preview: { select: { title: "image.alt", media: "image" } },
});
