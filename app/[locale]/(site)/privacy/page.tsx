import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PrivacyPolicy } from "@/components/sections/Privacy";
import type { Locale } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import { getPrivacy, getSettings } from "@/sanity/lib/data";

export async function generateMetadata({ params }: PageProps<"/[locale]/privacy">): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  const [{ data: page }, { data: settings }, t] = await Promise.all([
    getPrivacy(locale),
    getSettings(locale),
    getTranslations({ locale, namespace: "pages" }),
  ]);
  return buildMetadata({
    locale,
    paths: { pt: "/privacy", en: "/privacy" },
    // An empty policy page is kept out of search results.
    seo: page?.body?.length ? page.seo : { ...page?.seo, noIndex: true },
    fallback: settings?.defaultSeo,
    title: `${t("privacy")} | VATUS`,
    description: page?.intro,
  });
}

export default async function PrivacyPage({ params }: PageProps<"/[locale]/privacy">) {
  const { locale } = (await params) as { locale: Locale };
  setRequestLocale(locale);
  const { data: page } = await getPrivacy(locale);
  return <PrivacyPolicy data={page} />;
}
