import { ImageIcon } from "@sanity/icons/Image";
import { defineField, defineType } from "sanity";

/** Every image on the site uses this type. Alt text is mandatory. */
export const imageWithAlt = defineType({
  name: "imageWithAlt",
  title: "Image",
  type: "image",
  icon: ImageIcon,
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Alternative text",
      type: "string",
      description:
        "Describe the image for people using screen readers, e.g. “Rear façade with timber screen at dusk”.",
      validation: (Rule) =>
        Rule.custom((alt, context) => {
          const parent = context.parent as { asset?: unknown } | undefined;
          if (parent?.asset && !alt) return "Alternative text is required.";
          return true;
        }),
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
    }),
  ],
  preview: {
    select: { media: "asset", title: "alt", subtitle: "caption" },
  },
});
