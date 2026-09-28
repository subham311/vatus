import { stegaClean } from "next-sanity";
import { getFormatter, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Arrow, Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { SanityImage } from "@/components/ui/SanityImage";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { resolveCta } from "@/lib/links";
import type { JournalPage } from "@/sanity/lib/data";
import { ArticleCard, type ArticleCardData } from "./ArticleCard";

/** Page copy may be missing entirely; every section falls back to UI strings. */
type Data = JournalPage | null | undefined;

export async function JournalHero({ data }: { data: Data }) {
  const t = await getTranslations("journal");
  const tc = await getTranslations("common");
  const tp = await getTranslations("pages");
  const heading = data?.heading || t("heading");
  const intro = data?.intro ?? t("intro");

  return (
    <section className="container-site pt-12 pb-[var(--section-y)] md:pt-20">
      <Reveal className="max-w-[60rem]">
        <Eyebrow>{data?.eyebrow || tp("journal")}</Eyebrow>
        <SectionHeading as="h1" size="display" className="mt-6 max-w-[18ch]">
          {heading}
        </SectionHeading>
        {intro ? <p className="mt-8 max-w-[38rem] text-lead text-muted md:mt-10">{intro}</p> : null}
      </Reveal>
      {data?.heroImage?.asset ? (
        <Reveal variant="image" className="mt-12 md:mt-16">
          <SanityImage
            image={data.heroImage}
            aspect={2}
            priority
            sizes="(min-width: 1360px) 1280px, 100vw"
            className="max-md:!aspect-[4/3]"
            placeholderLabel={tc("imageToCome")}
          />
        </Reveal>
      ) : null}
    </section>
  );
}

export async function JournalGrid({ articles }: { articles: ArticleCardData[] }) {
  const t = await getTranslations("journal");
  return (
    <section aria-labelledby="articles-heading" className="border-t border-line section-y">
      <div className="container-site">
        <h2 id="articles-heading" className="sr-only">
          {t("articles")}
        </h2>
        {articles.length ? (
          <ul className="grid gap-14 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-20">
            {articles.map((article, i) => (
              <Reveal as="li" key={article._id} delay={(i % 3) * 0.08}>
                <ArticleCard article={article} />
              </Reveal>
            ))}
          </ul>
        ) : (
          <p className="max-w-xl text-lead text-muted">{t("empty")}</p>
        )}
      </div>
    </section>
  );
}

export async function JournalFeatured({ data }: { data: Data }) {
  const article = data?.featuredArticle;
  if (!article?.slug) return null;
  const t = await getTranslations("journal");
  const tc = await getTranslations("common");
  const format = await getFormatter();
  const minutes = Math.max(1, stegaClean(article.readingTime) ?? 1);
  const date = article.publishedAt ? new Date(stegaClean(article.publishedAt)) : null;

  return (
    <section aria-labelledby="featured-heading" className="border-t border-line section-y">
      <article className="group relative container-site grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-16">
        <Reveal variant="image" className="lg:col-span-7">
          <SanityImage
            image={article.heroImage}
            aspect={3 / 2}
            sizes="(min-width: 1024px) 58vw, 100vw"
            hoverScale
            placeholderLabel={tc("imageToCome")}
          />
        </Reveal>
        <Reveal className="lg:col-span-5" delay={0.1}>
          <p className="eyebrow text-[0.6875rem] text-muted">
            <span className="text-bronze">{data?.featuredLabel || t("featured")}</span>
            {article.category ? (
              <>
                <span aria-hidden="true" className="mx-3 inline-block h-px w-8 translate-y-[-0.25em] bg-line" />
                {article.category}
              </>
            ) : null}
          </p>
          <h2 id="featured-heading" className="mt-5 font-display text-section">
            <Link
              href={`/journal/${stegaClean(article.slug)}`}
              className="after:absolute after:inset-0 group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4"
            >
              {article.title}
            </Link>
          </h2>
          {article.excerpt ? <p className="mt-6 text-lead text-muted">{article.excerpt}</p> : null}
          <p className="mt-6 text-xs text-muted">
            {date ? <time dateTime={date.toISOString()}>{format.dateTime(date, { dateStyle: "long" })}</time> : null}
            {date ? <span aria-hidden="true"> · </span> : null}
            {t("readingTime", { minutes })}
          </p>
          <p aria-hidden="true" className="mt-8 inline-flex items-center gap-3 text-[0.9375rem] font-medium">
            {t("readArticle")}
            <Arrow />
          </p>
        </Reveal>
      </article>
    </section>
  );
}

export async function JournalClosing({ data }: { data: Data }) {
  const t = await getTranslations("journal");
  const cta = resolveCta(data?.closingCta) ?? { href: "/#projects", external: false, label: t("explore") };
  const statement = data?.closingStatement || t("closing");

  return (
    <section aria-labelledby="journal-closing-heading" className="on-dark bg-charcoal text-on-dark">
      <div className="container-site flex flex-col gap-10 py-[clamp(5rem,10vw,8rem)] md:flex-row md:items-end md:justify-between">
        <Reveal className="max-w-[44rem]">
          <h2 id="journal-closing-heading" className="font-display text-section text-on-dark">
            {statement}
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <Button href={cta.href} external={cta.external} variant="outline-light" arrow>
            {cta.label}
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
