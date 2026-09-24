import type { MetadataRoute } from "next";
import { routing, type Locale } from "@/i18n/routing";
import { absoluteUrl, localePath } from "@/lib/seo";
import { client } from "@/sanity/lib/client";
import { SITEMAP_QUERY } from "@/sanity/lib/queries";

export const revalidate = 3600;

type Entry = MetadataRoute.Sitemap[number];

function entry(locale: Locale, path: string, lastModified?: string, alternates?: Partial<Record<Locale, string>>): Entry {
  const languages: Record<string, string> = {};
  for (const [l, p] of Object.entries(alternates ?? { [locale]: path })) {
    languages[l === "pt" ? "pt-BR" : l] = absoluteUrl(localePath(l as Locale, p as string));
  }
  return {
    url: absoluteUrl(localePath(locale, path)),
    lastModified: lastModified ? new Date(lastModified) : undefined,
    alternates: { languages },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await client
    .withConfig({ stega: false })
    .fetch(SITEMAP_QUERY, {}, { next: { revalidate: 3600 } })
    .catch(() => null);

  const both = { pt: "/", en: "/" } as const;
  const lastHome = data?.home?.map((h) => h._updatedAt).sort().at(-1);
  const staticPaths = ["/", "/journal", "/about"];

  const entries: MetadataRoute.Sitemap = [];
  for (const locale of routing.locales) {
    for (const p of staticPaths) {
      entries.push(entry(locale, p, p === "/" ? lastHome : undefined, p === "/" ? both : { pt: p, en: p }));
    }
  }

  // Only projects with an enabled page are listed.
  for (const p of data?.projects ?? []) {
    if (p.slug && (p.language === "pt" || p.language === "en")) {
      entries.push(entry(p.language, `/projects/${p.slug}`, p._updatedAt));
    }
  }
  for (const a of data?.articles ?? []) {
    if (a.slug && (a.language === "pt" || a.language === "en")) {
      entries.push(entry(a.language, `/journal/${a.slug}`, a._updatedAt));
    }
  }
  return entries;
}
