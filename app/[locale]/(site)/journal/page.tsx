import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { StubPage } from "@/components/layout/StubPage";
import { ArticleCard } from "@/components/sections/ArticleCard";
import type { Locale } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import { sanityFetch } from "@/sanity/lib/live";
import { JOURNAL_INDEX_QUERY } from "@/sanity/lib/queries";

export async function generateMetadata({ params }: PageProps<"/[locale]/journal">): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  const t = await getTranslations({ locale, namespace: "pages" });
  return buildMetadata({ locale, paths: { pt: "/journal", en: "/journal" }, title: `${t("journal")} | VATUS` });
}

export default async function JournalPage({ params }: PageProps<"/[locale]/journal">) {
  const { locale } = (await params) as { locale: Locale };
  setRequestLocale(locale);
  const t = await getTranslations("pages");
  const tj = await getTranslations("journal");
  const { data: articles } = await sanityFetch({ query: JOURNAL_INDEX_QUERY, params: { language: locale } });

  return (
    <StubPage title={t("journal")}>
      {articles.length ? (
        <ul className="mt-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {articles.map((article) => (
            <li key={article._id}>
              <ArticleCard article={article} headingLevel="h2" />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-8 max-w-xl text-lead text-muted">{tj("empty")}</p>
      )}
    </StubPage>
  );
}
