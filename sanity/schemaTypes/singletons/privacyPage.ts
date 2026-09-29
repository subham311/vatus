import { LockIcon } from "@sanity/icons/Lock";
import { defineArrayMember, defineField, defineType } from "sanity";
import { languageField } from "../shared";

/**
 * The privacy and cookie policy. The legal copy comes from VATUS (local legal
 * review recommended); until the body is filled in, the page says it is being
 * prepared.
 */
export const privacyPage = defineType({
  name: "privacyPage",
  title: "Privacy page",
  type: "document",
  icon: LockIcon,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    languageField,
    defineField({ name: "eyebrow", type: "string", group: "content", initialValue: "Legal" }),
    defineField({
      name: "heading",
      title: "Headline (H1)",
      type: "string",
      group: "content",
      initialValue: "Privacy policy",
      validation: (R) => R.required(),
    }),
    defineField({ name: "intro", type: "text", rows: 2, group: "content" }),
    defineField({
      name: "lastUpdated",
      title: "Last updated",
      type: "date",
      group: "content",
      description: "Shown under the headline. Update it whenever the policy changes.",
    }),
    defineField({
      name: "body",
      type: "array",
      group: "content",
      description: "The full policy, including the cookie section. Paste the reviewed legal copy here.",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Paragraph", value: "normal" },
            { title: "Heading", value: "h2" },
            { title: "Subheading", value: "h3" },
          ],
          lists: [
            { title: "Bullets", value: "bullet" },
            { title: "Numbered", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
            ],
            annotations: [
              defineArrayMember({
                name: "link",
                type: "object",
                title: "Link",
                fields: [
                  defineField({
                    name: "href",
                    title: "URL",
                    type: "url",
                    validation: (R) => R.uri({ allowRelative: true, scheme: ["http", "https", "mailto", "tel"] }),
                  }),
                ],
              }),
            ],
          },
        }),
      ],
    }),
    defineField({ name: "seo", type: "seo", group: "seo" }),
  ],
  preview: {
    select: { language: "language" },
    prepare: ({ language }) => ({ title: `Privacy page (${language?.toUpperCase() ?? "?"})` }),
  },
});
