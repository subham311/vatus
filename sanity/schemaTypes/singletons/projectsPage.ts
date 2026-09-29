import { HomeIcon } from "@sanity/icons/Home";
import { defineField, defineType } from "sanity";
import { languageField } from "../shared";

/**
 * The projects index at /projects. Projects are listed automatically (every
 * project with its page enabled); this document only holds the page copy.
 * The page itself switches on once there are more such projects than the
 * homepage's Available residences section shows.
 */
export const projectsPage = defineType({
  name: "projectsPage",
  title: "Projects page",
  type: "document",
  icon: HomeIcon,
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "closing", title: "Closing" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    languageField,
    defineField({ name: "eyebrow", type: "string", group: "hero", initialValue: "Projects" }),
    defineField({
      name: "heading",
      title: "Headline (H1)",
      type: "string",
      group: "hero",
      validation: (R) => R.required(),
    }),
    defineField({ name: "intro", type: "text", rows: 2, group: "hero" }),
    defineField({ name: "closingStatement", title: "Statement", type: "string", group: "closing" }),
    defineField({ name: "closingCta", title: "Button", type: "cta", group: "closing" }),
    defineField({ name: "seo", type: "seo", group: "seo" }),
  ],
  preview: {
    select: { language: "language" },
    prepare: ({ language }) => ({ title: `Projects page (${language?.toUpperCase() ?? "?"})` }),
  },
});
