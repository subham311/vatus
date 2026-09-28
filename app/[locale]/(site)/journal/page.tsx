import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { JournalClosing, JournalFeatured, JournalGrid, JournalHero } from "@/components/sections/Journal";
import type { Locale } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import { getJournalPage, getSettings } from "@/sanity/lib/data";
import { sanityFetch } from "@/sanity/lib/live";
import { JOURNAL_INDEX_QUERY } from "@/sanity/lib/queries";

export async function generateMetadata({ params }: PageProps<"/[locale]/journal">): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  const [{ data: page }, { data: settings }, t, tj] = await Promise.all([
    getJournalPage(locale),
    getSettings(locale),
    getTranslations({ locale, namespace: "pages" }),
    getTranslations({ locale, namespace: "journal" }),
  ]);
  return buildMetadata({
    locale,
    paths: { pt: "/journal", en: "/journal" },
    seo: page?.seo,
    fallback: settings?.defaultSeo,
    title: `${t("journal")} | VATUS`,
    description: page?.intro || tj("intro"),
    image: page?.heroImage,
  });
}

export default async function JournalPage({ params }: PageProps<"/[locale]/journal">) {
  const { locale } = (await params) as { locale: Locale };
  setRequestLocale(locale);
  const [{ data: page }, { data: articles }] = await Promise.all([
    getJournalPage(locale),
    sanityFetch({ query: JOURNAL_INDEX_QUERY, params: { language: locale } }),
  ]);

  // The featured article is shown on its own, so it is left out of the grid.
  const featuredId = page?.featuredArticle?._id;
  const gridArticles = featuredId ? articles.filter((a) => a._id !== featuredId) : articles;

  return (
    <main id="main">
      <JournalHero data={page} />
      {gridArticles.length || !featuredId ? <JournalGrid articles={gridArticles} /> : null}
      <JournalFeatured data={page} />
      <JournalClosing data={page} />
    </main>
  );
}
