import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { resolveCta } from "@/lib/links";
import type { Home } from "@/sanity/lib/data";
import { ArticleCard, type ArticleCardData } from "./ArticleCard";

export function JournalPreview({
  data,
  articles,
}: {
  data: NonNullable<Home["journalPreview"]>;
  articles: ArticleCardData[];
}) {
  if (!articles.length) return null;
  const cta = resolveCta(data.cta);

  return (
    <section id="journal" aria-labelledby="journal-heading" className="section-y border-t border-line">
      <div className="container-site">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <Reveal className="max-w-xl">
            {data.heading ? <SectionHeading id="journal-heading">{data.heading}</SectionHeading> : null}
            {data.intro ? <p className="mt-5 text-lead text-muted">{data.intro}</p> : null}
          </Reveal>
          {cta ? (
            <Button href={cta.href} external={cta.external} variant="text" arrow className="self-start md:self-auto">
              {cta.label}
            </Button>
          ) : null}
        </div>
        <ul className="mt-14 grid gap-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {articles.slice(0, 3).map((article, i) => (
            <Reveal as="li" key={article._id} delay={i * 0.08}>
              <ArticleCard article={article} />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
