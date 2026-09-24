import { LinkIcon } from "@sanity/icons/Link";
import { defineField, defineType } from "sanity";

export const ANCHORS = [
  { title: "Projects (#projects)", value: "projects" },
  { title: "Approach (#approach)", value: "approach" },
  { title: "Floor plan (#floor-plan)", value: "floor-plan" },
  { title: "Journal preview (#journal)", value: "journal" },
  { title: "Contact (#contact)", value: "contact" },
];

export const cta = defineType({
  name: "cta",
  title: "Link",
  type: "object",
  icon: LinkIcon,
  fields: [
    defineField({
      name: "label",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "linkType",
      title: "Link type",
      type: "string",
      initialValue: "anchor",
      options: {
        layout: "radio",
        direction: "horizontal",
        list: [
          { title: "Homepage section", value: "anchor" },
          { title: "Page on this site", value: "internal" },
          { title: "External URL", value: "external" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "anchor",
      title: "Section",
      type: "string",
      options: { list: ANCHORS },
      hidden: ({ parent }) => parent?.linkType !== "anchor",
    }),
    defineField({
      name: "reference",
      title: "Document",
      description: "Link to a project or journal article.",
      type: "reference",
      to: [{ type: "project" }, { type: "article" }],
      hidden: ({ parent }) => parent?.linkType !== "internal",
    }),
    defineField({
      name: "path",
      title: "Path",
      description:
        "For fixed pages without a document, e.g. /about or /journal. Ignored when a document is selected.",
      type: "string",
      hidden: ({ parent }) => parent?.linkType !== "internal",
      validation: (Rule) =>
        Rule.custom((value) =>
          !value || value.startsWith("/") ? true : "Paths must start with /",
        ),
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "url",
      hidden: ({ parent }) => parent?.linkType !== "external",
      validation: (Rule) => Rule.uri({ scheme: ["http", "https", "mailto", "tel"] }),
    }),
  ],
  preview: {
    select: { title: "label", type: "linkType", anchor: "anchor", path: "path", url: "url" },
    prepare: ({ title, type, anchor, path, url }) => ({
      title,
      subtitle: type === "anchor" ? `#${anchor ?? ""}` : type === "external" ? url : path,
    }),
  },
});
