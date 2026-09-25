import { defineField, type Rule, type SlugValidationContext } from "sanity";
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

/** Sanity asset refs carry the pixel size: image-<hash>-<w>x<h>-<ext>. */
function assetSize(value: unknown) {
  const ref = (value as { asset?: { _ref?: string } } | undefined)?.asset?._ref;
  const m = ref?.match(/-(\d+)x(\d+)-[a-z0-9]+$/);
  return m ? { width: Number(m[1]), height: Number(m[2]), svg: ref!.endsWith("-svg") } : null;
}

/**
 * Size guidance and a minimum-width check for an image field. Every frame on
 * the site has a fixed ratio, so editors only need a large enough file and a
 * sensible crop/hotspot. Spread into `defineField` or `defineArrayMember`.
 */
export function imageSize(opts: {
  width: number;
  height: number;
  /** Uploads narrower than this are rejected. Defaults to 75% of `width`. */
  minWidth?: number;
  note?: string;
  required?: boolean;
}) {
  const min = opts.minWidth ?? Math.round(opts.width * 0.75);
  const check = (value: unknown) => {
    const size = assetSize(value);
    if (!size || size.svg || size.width >= min) return true;
    return `This image is ${size.width} × ${size.height} px. Upload one at least ${min} px wide so it stays sharp.`;
  };
  return {
    description: [
      opts.note,
      `Recommended ${opts.width} × ${opts.height} px, at least ${min} px wide (JPG or WebP).`,
      "Use Crop and Hotspot to choose what stays in the frame.",
    ]
      .filter(Boolean)
      .join(" "),
    validation: (R: Rule) => (opts.required ? R.required().custom(check) : R.custom(check)),
  };
}
