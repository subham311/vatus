import { stegaClean } from "next-sanity";

export type CtaLike = {
  label?: string | null;
  linkType?: string | null;
  anchor?: string | null;
  path?: string | null;
  url?: string | null;
  ref?: { _type?: string | null; slug?: string | null; pageEnabled?: boolean | null } | null;
} | null | undefined;

export type ResolvedLink = { href: string; external: boolean; label: string };

/** Homepage anchors always resolve through the (locale-aware) home route. */
export const anchorHref = (anchor: string) => `/#${anchor}`;

export function projectHref(project: { slug?: string | null; pageEnabled?: boolean | null }, fallbackAnchor = "projects") {
  const slug = stegaClean(project.slug);
  return project.pageEnabled && slug ? `/projects/${slug}` : anchorHref(fallbackAnchor);
}

export function resolveCta(cta: CtaLike): ResolvedLink | null {
  if (!cta?.label) return null;
  const type = stegaClean(cta.linkType);
  const label = cta.label;

  if (type === "external" && cta.url) {
    return { href: stegaClean(cta.url), external: true, label };
  }
  if (type === "internal") {
    const ref = cta.ref;
    if (ref?._type === "project") return { href: projectHref(ref), external: false, label };
    if (ref?._type === "article" && ref.slug) {
      return { href: `/journal/${stegaClean(ref.slug)}`, external: false, label };
    }
    if (cta.path) return { href: stegaClean(cta.path), external: false, label };
    return null;
  }
  if (cta.anchor) return { href: anchorHref(stegaClean(cta.anchor)), external: false, label };
  return null;
}

export function whatsappHref(number?: string | null, message?: string | null) {
  const digits = stegaClean(number)?.replace(/\D/g, "");
  if (!digits) return null;
  const text = message ? `?text=${encodeURIComponent(stegaClean(message))}` : "";
  return `https://wa.me/${digits}${text}`;
}
