import type { PortableTextBlock } from "next-sanity";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { RichText } from "@/components/ui/RichText";
import { SanityImage } from "@/components/ui/SanityImage";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/cn";
import { resolveCta } from "@/lib/links";
import type { About } from "@/sanity/lib/data";

const pad = (n: number) => String(n).padStart(2, "0");

export async function AboutHero({ data }: { data: About }) {
  const t = await getTranslations("common");
  const caption = [data.founderName, data.founderRole].filter(Boolean).join(", ");
  return (
    <section className="container-site grid gap-12 pt-12 pb-[var(--section-y)] md:pt-20 lg:grid-cols-12 lg:items-end lg:gap-16">
      <Reveal className="lg:col-span-7 lg:pb-4">
        {data.eyebrow ? <Eyebrow>{data.eyebrow}</Eyebrow> : null}
        <SectionHeading as="h1" size="display" className="mt-6 max-w-[14ch]">
          {data.heading}
        </SectionHeading>
        {data.subheading ? (
          <p className="mt-8 max-w-[34rem] text-lead text-muted md:mt-10">{data.subheading}</p>
        ) : null}
      </Reveal>
      <Reveal variant="image" as="figure" className="lg:col-span-5">
        <SanityImage
          image={data.portrait}
          aspect={4 / 5}
          priority
          sizes="(min-width: 1024px) 40vw, 100vw"
          placeholderLabel={t("imageToCome")}
        />
        {caption ? <figcaption className="eyebrow mt-4 text-[0.6875rem] text-muted">{caption}</figcaption> : null}
      </Reveal>
    </section>
  );
}

export async function AboutIntro({ data }: { data: About }) {
  if (!data.intro?.length) return null;
  const t = await getTranslations("about");
  return (
    <section aria-labelledby="story-heading" className="border-t border-line section-y">
      <div className="container-site grid gap-8 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <h2 id="story-heading" className="eyebrow text-muted">
            {t("story")}
          </h2>
        </div>
        <Reveal className="lg:col-span-8">
          <RichText
            value={data.intro as PortableTextBlock[]}
            className="max-w-[44rem] text-lead text-muted [&>p:first-child]:font-display [&>p:first-child]:text-[clamp(1.75rem,3vw,2.75rem)] [&>p:first-child]:leading-[1.2] [&>p:first-child]:text-ink"
          />
        </Reveal>
      </div>
    </section>
  );
}

type Chapter = NonNullable<About["chapters"]>[number];

function ChapterImages({ images, label }: { images: NonNullable<Chapter["images"]>; label: string }) {
  if (!images.length) return null;
  return (
    <div className="mt-10 grid grid-cols-2 gap-4 md:mt-12 md:gap-6">
      {images.map((img, i) => {
        // One image spans the row; with three, the first leads and two sit below.
        const wide = images.length === 1 || (images.length === 3 && i === 0);
        return (
          <Reveal key={img.asset?._ref ?? i} variant="image" delay={i * 0.08} className={cn(wide && "col-span-2")}>
            <SanityImage
              image={img}
              aspect={wide ? 3 / 2 : 4 / 5}
              sizes={wide ? "(min-width: 1024px) 60vw, 100vw" : "(min-width: 1024px) 30vw, 50vw"}
              placeholderLabel={label}
            />
          </Reveal>
        );
      })}
    </div>
  );
}

export async function AboutChapters({ data }: { data: About }) {
  const chapters = data.chapters ?? [];
  if (!chapters.length) return null;
  const t = await getTranslations("about");
  const tc = await getTranslations("common");
  return (
    <section aria-label={t("timeline")}>
      <ol>
        {chapters.map((c, i) => (
          <li key={c._key} className="border-t border-line section-y">
            <div className="container-site grid gap-8 lg:grid-cols-12 lg:gap-16">
              <Reveal className="lg:col-span-4">
                <div className="lg:sticky lg:top-[calc(var(--header-h)+3rem)]">
                  <p className="eyebrow text-[0.6875rem] text-muted">
                    <span className="text-bronze">{pad(i + 1)}</span>
                    <span aria-hidden="true" className="mx-3 inline-block h-px w-8 translate-y-[-0.25em] bg-line" />
                    {c.period}
                  </p>
                  <h2 className="mt-4 font-display text-section">{c.country}</h2>
                </div>
              </Reveal>
              <div className="lg:col-span-8">
                <Reveal>
                  <RichText
                    value={c.body as PortableTextBlock[] | null}
                    className="max-w-[40rem] text-muted [&>p:first-child]:text-lead [&>p:first-child]:text-ink"
                  />
                </Reveal>
                <ChapterImages images={c.images ?? []} label={tc("imageToCome")} />
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function AboutCredentials({ data }: { data: About }) {
  const items = data.credentials ?? [];
  if (!items.length) return null;
  return (
    <section aria-labelledby="credentials-heading" className="border-t border-line section-y">
      <div className="container-site grid gap-8 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <h2 id="credentials-heading" className="font-heading text-[clamp(1.5rem,2.2vw,2rem)] leading-tight">
            {data.credentialsHeading}
          </h2>
        </div>
        <ul className="border-t border-line lg:col-span-8">
          {items.map((c) => (
            <li key={c._key} className="grid gap-1 border-b border-line py-5 sm:grid-cols-[1fr_auto] sm:gap-8">
              <div>
                <p className="text-ink">{c.title}</p>
                {c.issuer ? <p className="mt-1 text-sm text-muted">{c.issuer}</p> : null}
              </div>
              {c.year ? <p className="text-sm text-muted tabular-nums">{c.year}</p> : null}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function AboutPhilosophy({ data }: { data: About }) {
  const beliefs = data.beliefs ?? [];
  if (!beliefs.length && !data.philosophyHeading) return null;
  return (
    <section aria-labelledby="philosophy-heading" className="on-dark bg-olive text-on-dark">
      <div className="container-site grid gap-12 py-[clamp(5rem,10vw,8rem)] lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-4">
          {data.philosophyEyebrow ? (
            <p className="eyebrow text-[0.6875rem] text-on-dark-muted">{data.philosophyEyebrow}</p>
          ) : null}
          {data.philosophyHeading ? (
            <SectionHeading id="philosophy-heading" className="mt-4 text-on-dark">
              {data.philosophyHeading}
            </SectionHeading>
          ) : null}
        </Reveal>
        <div className="lg:col-span-8">
          <ol className="border-t border-line-dark">
            {beliefs.map((b, i) => (
              <Reveal
                as="li"
                key={`${i}-${b}`}
                delay={Math.min(i, 4) * 0.06}
                className="grid grid-cols-[2.5rem_1fr] items-baseline border-b border-line-dark py-5 md:grid-cols-[3.5rem_1fr] md:py-6"
              >
                <span className="eyebrow text-[0.6875rem] text-on-dark-muted">{pad(i + 1)}</span>
                <p className="font-heading text-[clamp(1.375rem,2.2vw,2rem)] leading-[1.25] text-on-dark">{b}</p>
              </Reveal>
            ))}
          </ol>
          {data.philosophyClosing ? (
            <Reveal delay={0.2}>
              <p className="mt-10 max-w-[40rem] text-lead text-on-dark/90">{data.philosophyClosing}</p>
            </Reveal>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export function AboutClosing({ data }: { data: About }) {
  if (!data.closingStatement) return null;
  const primary = resolveCta(data.primaryCta);
  const secondary = resolveCta(data.secondaryCta);
  return (
    <section aria-labelledby="closing-heading" className="on-dark bg-charcoal text-on-dark">
      <div className="container-site py-[clamp(6rem,14vw,12rem)]">
        <Reveal className="max-w-[68rem]">
          <h2 id="closing-heading" className="font-display text-statement text-on-dark">
            {data.closingStatement}
          </h2>
          {data.closingSupporting ? (
            <p className="mt-8 max-w-[44rem] font-heading text-[clamp(1.375rem,2.4vw,2.25rem)] leading-[1.3] text-on-dark-muted md:mt-12">
              {data.closingSupporting}
            </p>
          ) : null}
          {primary || secondary ? (
            <div className="mt-12 flex flex-wrap gap-4 md:mt-16">
              {primary ? (
                <Button href={primary.href} external={primary.external} variant="outline-light" arrow>
                  {primary.label}
                </Button>
              ) : null}
              {secondary ? (
                <Button href={secondary.href} external={secondary.external} variant="text" arrow className="text-on-dark">
                  {secondary.label}
                </Button>
              ) : null}
            </div>
          ) : null}
        </Reveal>
      </div>
    </section>
  );
}
