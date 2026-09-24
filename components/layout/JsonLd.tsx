import { stegaClean } from "next-sanity";
import { absoluteUrl, localePath, DEFAULT_DESCRIPTION } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";
import type { Settings } from "@/sanity/lib/data";
import { urlFor } from "@/sanity/lib/image";

export function OrganizationJsonLd({ settings, locale }: { settings: Settings | null; locale: Locale }) {
  const s = stegaClean(settings);
  const address = s?.address;
  const url = absoluteUrl(localePath(locale, "/"));
  const logo = s?.logoDark?.asset ? urlFor(s.logoDark).url() : undefined;
  const phone = s?.whatsappNumber ? `+${s.whatsappNumber}` : undefined;

  const data = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": `${absoluteUrl("/")}#organization`,
    name: s?.siteName || "VATUS",
    description: s?.defaultSeo?.description || DEFAULT_DESCRIPTION,
    slogan: "Homes designed for better living.",
    url,
    logo,
    image: logo,
    email: s?.email || undefined,
    telephone: phone,
    sameAs: s?.instagramUrl ? [s.instagramUrl] : undefined,
    areaServed: { "@type": "City", name: address?.locality || "Goiânia" },
    address: {
      "@type": "PostalAddress",
      streetAddress: address?.streetAddress || undefined,
      addressLocality: address?.locality || "Goiânia",
      addressRegion: address?.region || "GO",
      postalCode: address?.postalCode || undefined,
      addressCountry: address?.country || "BR",
    },
  };

  return (
    <script
      type="application/ld+json"
      // JSON.stringify output with "<" escaped cannot break out of the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
