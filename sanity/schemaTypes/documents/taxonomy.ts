import { TagIcon } from "@sanity/icons/Tag";
import { UserIcon } from "@sanity/icons/User";
import { defineField, defineType } from "sanity";
import { isUniqueInLanguage, languageField, imageSize } from "../shared";

export const category = defineType({
  name: "category",
  title: "Category",
  type: "document",
  icon: TagIcon,
  fields: [
    languageField,
    defineField({ name: "title", type: "string", validation: (R) => R.required() }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title", isUnique: isUniqueInLanguage },
      validation: (R) => R.required(),
    }),
  ],
  preview: {
    select: { title: "title", language: "language" },
    prepare: ({ title, language }) => ({ title, subtitle: language?.toUpperCase() }),
  },
});

export const author = defineType({
  name: "author",
  title: "Author",
  type: "document",
  icon: UserIcon,
  fields: [
    languageField,
    defineField({ name: "name", type: "string", validation: (R) => R.required() }),
    defineField({ name: "role", type: "string" }),
    defineField({
      name: "portrait",
      type: "imageWithAlt",
      ...imageSize({ width: 800, height: 1000, minWidth: 600, note: "Portrait, 4:5." }),
    }),
    defineField({ name: "bio", type: "richText" }),
  ],
  preview: {
    select: { title: "name", subtitle: "role", media: "portrait" },
  },
});
