import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ProjectsClosing, ProjectsGrid, ProjectsHero } from "@/components/sections/Projects";
import type { Locale } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import { getProjectsIndex, getProjectsPage, getSettings } from "@/sanity/lib/data";

export async function generateMetadata({ params }: PageProps<"/[locale]/projects">): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  const [{ data: page }, { data: settings }, index, t, tp] = await Promise.all([
    getProjectsPage(locale),
    getSettings(locale),
    getProjectsIndex(locale),
    getTranslations({ locale, namespace: "pages" }),
    getTranslations({ locale, namespace: "projects" }),
  ]);
  if (!index.active) return {};
  return buildMetadata({
    locale,
    paths: { pt: "/projects", en: "/projects" },
    seo: page?.seo,
    fallback: settings?.defaultSeo,
    title: `${t("projects")} | VATUS`,
    description: page?.intro || tp("intro"),
    image: index.projects[0]?.mainImage,
  });
}

export default async function ProjectsIndexPage({ params }: PageProps<"/[locale]/projects">) {
  const { locale } = (await params) as { locale: Locale };
  setRequestLocale(locale);
  const [{ data: page }, index] = await Promise.all([getProjectsPage(locale), getProjectsIndex(locale)]);
  // Until there are more project pages than the homepage shows, projects live on the homepage.
  if (!index.active) notFound();

  return (
    <main id="main">
      <ProjectsHero data={page} />
      <ProjectsGrid projects={index.projects} />
      <ProjectsClosing data={page} />
    </main>
  );
}
