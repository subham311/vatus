import type { Metadata } from "next";
import { stegaClean } from "next-sanity";
import { routing, type Locale } from "@/i18n/routing";
import { urlFor } from "@/sanity/lib/image";
import type { SanityImageData } from "@/components/ui/SanityImage";

export const siteUrl = (process.env.NEXT_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

/** Used only when the CMS has no SEO copy for the page or the site. */
export const DEFAULT_TITLE: Record<Locale, string> = {
  pt: "VATUS | Arquitetura, Desenvolvimento e Construção em Goiânia",
  en: "VATUS | Architecture, Development & Construction in Goiânia",
};
export const DEFAULT_DESCRIPTION: Record<Locale, string> = {
  pt: "A VATUS cria arquitetura residencial cuidadosamente projetada em Goiânia, unindo mais de 26 anos de experiência internacional a planejamento criterioso, qualidade construtiva e design contemporâneo.",
  en: "VATUS creates thoughtfully designed residential architecture in Goiânia, combining more than 26 years of international experience with careful planning, construction quality and contemporary design.",
};
export const SLOGAN: Record<Locale, string> = {
  pt: "Casas projetadas para viver melhor.",
  en: "Homes designed for better living.",
};

/** `/journal` → `/journal` (pt) or `/en/journal` (en). */
export function localePath(locale: Locale, path: string) {
  const clean = path === "/" ? "" : path;
  return locale === routing.defaultLocale ? clean || "/" : `/${locale}${clean}`;
}

export const absoluteUrl = (path: string) => `${siteUrl}${path === "/" ? "" : path}` || siteUrl;

type Seo = {
  title?: string | null;
  description?: string | null;
  noIndex?: boolean | null;
  shareImage?: SanityImageData;
} | null | undefined;

export function buildMetadata({
  locale,
  paths,
  seo,
  fallback,
  title,
  description,
  image,
  type = "website",
}: {
  locale: Locale;
  /** Path for each locale that has this page, without the locale prefix. */
  paths: Partial<Record<Locale, string>>;
  seo?: Seo;
  fallback?: Seo;
  title?: string | null;
  description?: string | null;
  image?: SanityImageData;
  type?: "website" | "article";
}): Metadata {
  const metaTitle = stegaClean(seo?.title || title || fallback?.title) || DEFAULT_TITLE[locale];
  const metaDescription =
    stegaClean(seo?.description || description || fallback?.description) || DEFAULT_DESCRIPTION[locale];
  const shareImage = seo?.shareImage?.asset ? seo.shareImage : image?.asset ? image : fallback?.shareImage;
  const ogImage = shareImage?.asset
    ? urlFor(shareImage).width(1200).height(630).fit("crop").auto("format").url()
    : undefined;
  const noIndex = Boolean(stegaClean(seo?.noIndex) || stegaClean(fallback?.noIndex));

  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    const p = paths[l];
    if (p) languages[l === "pt" ? "pt-BR" : l] = absoluteUrl(localePath(l, p));
  }
  const defaultPath = paths[routing.defaultLocale] ?? paths[locale];
  if (defaultPath) languages["x-default"] = absoluteUrl(localePath(paths[routing.defaultLocale] ? routing.defaultLocale : locale, defaultPath));

  const canonical = absoluteUrl(localePath(locale, paths[locale] ?? "/"));

  return {
    title: metaTitle,
    description: metaDescription,
    alternates: { canonical, languages },
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      type,
      url: canonical,
      siteName: "VATUS",
      title: metaTitle,
      description: metaDescription,
      locale: locale === "pt" ? "pt_BR" : "en_GB",
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: stegaClean(shareImage?.alt) || metaTitle }] : undefined,
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title: metaTitle,
      description: metaDescription,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}
