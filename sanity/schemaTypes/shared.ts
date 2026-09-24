import { defineField, type SlugValidationContext } from "sanity";
import { apiVersion } from "../env";

/** Hidden language field written by @sanity/document-internationalization. */
export const languageField = defineField({
  name: "language",
  type: "string",
  readOnly: true,
  hidden: true,
});

/** Slugs only need to be unique within one language. */
export async function isUniqueInLanguage(slug: string, context: SlugValidationContext) {
  const { document, getClient } = context;
  const client = getClient({ apiVersion });
  const id = document?._id.replace(/^drafts\./, "");
  const params = {
    draft: `drafts.${id}`,
    published: id,
    language: (document as { language?: string } | undefined)?.language ?? null,
    slug,
    type: document?._type,
  };
  const query = `!defined(*[
    _type == $type &&
    !(_id in [$draft, $published]) &&
    slug.current == $slug &&
    language == $language
  ][0]._id)`;
  return client.fetch<boolean>(query, params);
}
