import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { stegaClean, type PortableTextBlock } from "next-sanity";
import { getFormatter, getTranslations, setRequestLocale } from "next-intl/server";
import { JournalClosing, RelatedArticles } from "@/components/sections/Journal";
import { SetAlternates, type AlternatePaths } from "@/components/layout/Alternates";
import { ArticleBody } from "@/components/ui/ArticleBody";
import { SanityImage } from "@/components/ui/SanityImage";
import type { Locale } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import { getJournalPage, getSettings } from "@/sanity/lib/data";
import { sanityFetch } from "@/sanity/lib/live";
import { ARTICLE_QUERY } from "@/sanity/lib/queries";

type Props = PageProps<"/[locale]/journal/[slug]">;

async function getArticle(locale: Locale, slug: string) {
  const { data } = await sanityFetch({ query: ARTICLE_QUERY, params: { language: locale, slug } });
  return data;
}

function alternatesOf(article: NonNullable<Awaited<ReturnType<typeof getArticle>>>, locale: Locale) {
  const paths: AlternatePaths = { [locale]: `/journal/${stegaClean(article.slug)}` };
  for (const tr of article.translations ?? []) {
    const lang = stegaClean(tr?.language) as Locale | undefined;
    if (lang && tr?.slug) paths[lang] = `/journal/${stegaClean(tr.slug)}`;
  }
  return paths;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = (await params) as { locale: Locale; slug: string };
  const article = await getArticle(locale, slug);
  if (!article) return {};
  const { data: settings } = await getSettings(locale);
  return buildMetadata({
    locale,
    paths: alternatesOf(article, locale),
    seo: article.seo,
    fallback: settings?.defaultSeo,
    title: article.title ? `${stegaClean(article.title)} | VATUS Journal` : null,
    description: article.excerpt,
    image: article.socialImage?.asset ? article.socialImage : article.heroImage,
    type: "article",
  });
}

export default async function ArticlePage({ params }: Props) {
  const { locale, slug } = (await params) as { locale: Locale; slug: string };
  setRequestLocale(locale);
  const article = await getArticle(locale, slug);
  if (!article) notFound();

  const { data: journalPage } = await getJournalPage(locale);
  const t = await getTranslations("journal");
  const tc = await getTranslations("common");
  const format = await getFormatter();
  const date = article.publishedAt ? new Date(stegaClean(article.publishedAt)) : null;
  const minutes = Math.max(1, stegaClean(article.readingTime) ?? 1);
  // Editor picks first (unpublished picks resolve to null); otherwise the latest articles.
  const picked = (article.relatedArticles ?? []).filter((a) => a?.slug);
  const related = picked.length ? picked : article.latestArticles;

  return (
    <main id="main">
      <SetAlternates paths={alternatesOf(article, locale)} />
      <article>
        <header className="container-site pt-16 md:pt-24">
          <div className="mx-auto max-w-[52rem]">
            <p className="eyebrow text-muted">
              {[article.category, date ? format.dateTime(date, { dateStyle: "long" }) : null, t("readingTime", { minutes })]
                .filter(Boolean)
                .join(" · ")}
            </p>
            <h1 className="mt-6 font-display text-[clamp(2.5rem,5.5vw,5rem)] leading-[1.05]">{article.title}</h1>
            {article.excerpt ? <p className="mt-8 text-lead text-muted">{article.excerpt}</p> : null}
            {article.author ? <p className="mt-6 text-sm text-muted">{t("by", { name: article.author })}</p> : null}
          </div>
          <div className="mt-12 md:mt-16">
            <SanityImage
              image={article.heroImage}
              aspect={16 / 9}
              priority
              sizes="(min-width: 1360px) 1280px, 100vw"
              placeholderLabel={tc("imageToCome")}
            />
          </div>
        </header>
        <div className="container-site section-y pt-12">
          <ArticleBody
            value={article.body as PortableTextBlock[] | null}
            placeholderLabel={tc("imageToCome")}
            className="mx-auto max-w-[44rem]"
          />
        </div>
      </article>
      <RelatedArticles articles={related} />
      <JournalClosing data={journalPage} />
    </main>
  );
}
