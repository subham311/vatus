import { EnvelopeIcon } from "@sanity/icons/Envelope";
import { defineField, defineType } from "sanity";

/** Written by the contact form server action. Read-only in the Studio. */
export const enquiry = defineType({
  name: "enquiry",
  title: "Enquiry",
  type: "document",
  icon: EnvelopeIcon,
  readOnly: true,
  fields: [
    defineField({ name: "name", type: "string" }),
    defineField({ name: "email", type: "string" }),
    defineField({ name: "phone", title: "Telephone / WhatsApp", type: "string" }),
    defineField({ name: "interest", type: "string" }),
    defineField({ name: "message", type: "text" }),
    defineField({ name: "locale", type: "string" }),
    defineField({ name: "sourcePage", type: "string" }),
    defineField({ name: "createdAt", type: "datetime" }),
  ],
  orderings: [
    {
      title: "Newest first",
      name: "createdAtDesc",
      by: [{ field: "createdAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { name: "name", interest: "interest", createdAt: "createdAt" },
    prepare: ({ name, interest, createdAt }) => ({
      title: name || "Unnamed enquiry",
      subtitle: [createdAt?.slice(0, 16).replace("T", " "), interest]
        .filter(Boolean)
        .join(" · "),
    }),
  },
});
