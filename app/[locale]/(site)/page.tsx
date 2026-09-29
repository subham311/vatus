import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { OrganizationJsonLd } from "@/components/layout/JsonLd";
import { AvailableResidences } from "@/components/sections/AvailableResidences";
import { BrandStatement } from "@/components/sections/BrandStatement";
import { ConstructionQuality } from "@/components/sections/ConstructionQuality";
import { Contact } from "@/components/sections/Contact";
import { DesignPrinciples } from "@/components/sections/DesignPrinciples";
import { FloorPlan } from "@/components/sections/FloorPlan";
import { Hero } from "@/components/sections/Hero";
import { IntelligentResources } from "@/components/sections/IntelligentResources";
import { InternationalExperience } from "@/components/sections/InternationalExperience";
import { JournalPreview } from "@/components/sections/JournalPreview";
import { Manifesto } from "@/components/sections/Manifesto";
import { Materials } from "@/components/sections/Materials";
import { ProjectGallery } from "@/components/sections/ProjectGallery";
import { SelectedResidence } from "@/components/sections/SelectedResidence";
import type { Locale } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import { getHome, getProjectsIndex, getSettings } from "@/sanity/lib/data";

/** A section renders unless an editor has switched it off. */
const on = <T extends { enabled?: boolean | null } | null | undefined>(s: T): s is NonNullable<T> =>
  Boolean(s) && s?.enabled !== false;

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  const [{ data: home }, { data: settings }] = await Promise.all([getHome(locale), getSettings(locale)]);
  return buildMetadata({
    locale,
    paths: { pt: "/", en: "/" },
    seo: home?.seo,
    fallback: settings?.defaultSeo,
    image: home?.hero?.image,
  });
}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = (await params) as { locale: Locale };
  setRequestLocale(locale);
  const [{ data: home }, { data: settings }, projectsIndex] = await Promise.all([
    getHome(locale),
    getSettings(locale),
    getProjectsIndex(locale),
  ]);

  if (!home) {
    return (
      <main id="main" className="container-site section-y">
        <h1 className="font-display text-section">VATUS</h1>
      </main>
    );
  }

  const project = home.selectedResidence?.project ?? null;
  const showFloorPlan = on(home.floorPlan) && Boolean(project?.plan);
  const heroH1 = on(home.hero) && Boolean(home.hero.heading);

  return (
    <main id="main">
      <OrganizationJsonLd settings={settings} locale={locale} />
      {!heroH1 ? <h1 className="sr-only">VATUS</h1> : null}
      {on(home.hero) ? <Hero data={home.hero} /> : null}
      {on(home.manifesto) ? <Manifesto data={home.manifesto} /> : null}
      {on(home.brandStatement) ? <BrandStatement data={home.brandStatement} /> : null}
      {on(home.selectedResidence) ? (
        <SelectedResidence data={home.selectedResidence} hasFloorPlan={showFloorPlan} />
      ) : null}
      {on(home.projectGallery) && project ? (
        <ProjectGallery data={home.projectGallery} images={project.gallery ?? []} />
      ) : null}
      {showFloorPlan && home.floorPlan ? <FloorPlan data={home.floorPlan} plan={project?.plan ?? null} /> : null}
      {on(home.designPrinciples) ? <DesignPrinciples data={home.designPrinciples} /> : null}
      {on(home.constructionQuality) ? <ConstructionQuality data={home.constructionQuality} /> : null}
      {on(home.materials) ? <Materials data={home.materials} /> : null}
      {on(home.intelligentResources) ? <IntelligentResources data={home.intelligentResources} /> : null}
      {on(home.internationalExperience) ? <InternationalExperience data={home.internationalExperience} /> : null}
      {on(home.availableResidences) ? (
        <AvailableResidences
          data={home.availableResidences}
          financingDisclaimer={settings?.financingDisclaimer ?? null}
          projectsIndex={projectsIndex.active}
        />
      ) : null}
      {on(home.journalPreview) ? <JournalPreview data={home.journalPreview} articles={home.journalArticles ?? []} /> : null}
      {on(home.contact) ? <Contact data={home.contact} settings={settings} /> : null}
    </main>
  );
}
