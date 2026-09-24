import { getFormatter, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SanityImage, type SanityImageData } from "@/components/ui/SanityImage";
import { stegaClean } from "next-sanity";

export type ArticleCardData = {
  _id: string;
  title: string | null;
  slug: string | null;
  excerpt: string | null;
  publishedAt: string | null;
  category: string | null;
  readingTime: number | null;
  heroImage: SanityImageData;
};

export async function ArticleCard({ article, headingLevel = "h3" }: { article: ArticleCardData; headingLevel?: "h2" | "h3" }) {
  const t = await getTranslations("journal");
  const tc = await getTranslations("common");
  const format = await getFormatter();
  const Heading = headingLevel;
  const minutes = Math.max(1, stegaClean(article.readingTime) ?? 1);
  const date = article.publishedAt ? new Date(stegaClean(article.publishedAt)) : null;

  return (
    <article className="group relative flex flex-col">
      <SanityImage
        image={article.heroImage}
        aspect={4 / 3}
        sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 100vw"
        hoverScale
        placeholderLabel={tc("imageToCome")}
      />
      {article.category ? <p className="eyebrow mt-6 text-[0.6875rem] text-muted">{article.category}</p> : null}
      <Heading className="mt-3 font-display text-[1.75rem] leading-tight">
        <Link
          href={`/journal/${stegaClean(article.slug)}`}
          className="after:absolute after:inset-0 group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4"
        >
          {article.title}
        </Link>
      </Heading>
      {article.excerpt ? <p className="mt-3 line-clamp-3 text-[0.9375rem] text-muted">{article.excerpt}</p> : null}
      <p className="mt-4 text-xs text-muted">
        {date ? <time dateTime={date.toISOString()}>{format.dateTime(date, { dateStyle: "long" })}</time> : null}
        {date ? <span aria-hidden="true"> · </span> : null}
        {t("readingTime", { minutes })}
      </p>
    </article>
  );
}
