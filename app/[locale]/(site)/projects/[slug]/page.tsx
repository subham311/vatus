import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { stegaClean, type PortableTextBlock } from "next-sanity";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SetAlternates, type AlternatePaths } from "@/components/layout/Alternates";
import { ResidenceFacts } from "@/components/sections/ResidenceFacts";
import { ArticleBody } from "@/components/ui/ArticleBody";
import { EnquireLink } from "@/components/ui/EnquireLink";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { RichText } from "@/components/ui/RichText";
import { SanityImage } from "@/components/ui/SanityImage";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Locale } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import { getSettings } from "@/sanity/lib/data";
import { sanityFetch } from "@/sanity/lib/live";
import { PROJECT_QUERY } from "@/sanity/lib/queries";

type Props = PageProps<"/[locale]/projects/[slug]">;

async function getProject(locale: Locale, slug: string) {
  const { data } = await sanityFetch({ query: PROJECT_QUERY, params: { language: locale, slug } });
  // Project URLs only exist once an editor enables the page.
  if (!data || stegaClean(data.pageEnabled) !== true) return null;
  return data;
}

function alternatesOf(project: NonNullable<Awaited<ReturnType<typeof getProject>>>, locale: Locale) {
  const paths: AlternatePaths = { [locale]: `/projects/${stegaClean(project.slug)}` };
  for (const tr of project.translations ?? []) {
    const lang = stegaClean(tr?.language) as Locale | undefined;
    if (lang && tr?.slug && stegaClean(tr.pageEnabled)) paths[lang] = `/projects/${stegaClean(tr.slug)}`;
  }
  return paths;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = (await params) as { locale: Locale; slug: string };
  const project = await getProject(locale, slug);
  if (!project) return {};
  const { data: settings } = await getSettings(locale);
  return buildMetadata({
    locale,
    paths: alternatesOf(project, locale),
    seo: project.seo,
    fallback: settings?.defaultSeo,
    title: project.name ? `${stegaClean(project.name)} | VATUS` : null,
    image: project.mainImage,
  });
}

export default async function ProjectPage({ params }: Props) {
  const { locale, slug } = (await params) as { locale: Locale; slug: string };
  setRequestLocale(locale);
  const project = await getProject(locale, slug);
  if (!project) notFound();

  const t = await getTranslations("residence");
  const tc = await getTranslations("common");
  const statusKey = stegaClean(project.status) as "under-construction" | "available" | "reserved" | "sold" | null;
  const interest = stegaClean(project.enquiryInterest) || "available-residence";

  return (
    <main id="main">
      <SetAlternates paths={alternatesOf(project, locale)} />
      <div className="container-site pt-12 md:pt-16">
        <SanityImage
          image={project.mainImage}
          aspect={21 / 10}
          priority
          sizes="(min-width: 1360px) 1280px, 100vw"
          className="max-md:!aspect-[4/3]"
          placeholderLabel={tc("imageToCome")}
        />
      </div>

      <section className="section-y pt-12 md:pt-16">
        <div className="container-site grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            {statusKey ? <Eyebrow>{[t(`status.${statusKey}`), project.availabilityLabel].filter(Boolean).join(" / ")}</Eyebrow> : null}
            <SectionHeading as="h1" size="display" className="mt-4 !text-[clamp(2.5rem,5vw,4.5rem)]">
              {project.name}
            </SectionHeading>
            {project.location ? <p className="mt-4 text-muted">{project.location}</p> : null}
            <ResidenceFacts project={project} className="mt-8" />
            {project.showPrice && project.price ? <p className="mt-6 text-ink">{project.price}</p> : null}
          </div>
          <div className="lg:col-span-6 lg:pt-10">
            <RichText
              value={project.intro as PortableTextBlock[] | null}
              className="text-muted [&>p:first-child]:text-lead [&>p:first-child]:text-ink"
            />
            {project.availability ? <p className="mt-6 text-muted">{project.availability}</p> : null}
            <div className="mt-10">
              <EnquireLink interest={interest} variant="primary" arrow>
                {t("enquire")}
              </EnquireLink>
            </div>
          </div>
        </div>
      </section>

      {project.concept?.length ? (
        <section className="border-t border-line section-y">
          <div className="container-site">
            <ArticleBody
              value={project.concept as PortableTextBlock[]}
              placeholderLabel={tc("imageToCome")}
              className="mx-auto max-w-[44rem]"
            />
          </div>
        </section>
      ) : null}

      {project.highlights?.length ? (
        <section aria-labelledby="highlights-heading" className="border-t border-line section-y">
          <div className="container-site">
            <SectionHeading id="highlights-heading">{t("highlights")}</SectionHeading>
            <ul className="mt-10 grid gap-x-8 border-t border-line sm:grid-cols-2 lg:grid-cols-3">
              {project.highlights.map((h) => (
                <li key={h} className="border-b border-line py-4">
                  {h}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {project.gallery?.length ? (
        <section aria-labelledby="project-gallery-heading" className="border-t border-line section-y">
          <div className="container-site">
            <SectionHeading id="project-gallery-heading" className="sr-only">
              {t("gallery")}
            </SectionHeading>
            <ul className="grid gap-6 md:grid-cols-2">
              {project.gallery.map((img, i) => (
                <li key={img.asset?._ref ?? i}>
                  <SanityImage image={img} aspect={4 / 3} sizes="(min-width: 768px) 50vw, 100vw" placeholderLabel={tc("imageToCome")} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </main>
  );
}
