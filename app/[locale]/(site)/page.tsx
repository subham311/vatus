import { setRequestLocale } from "next-intl/server";
import { BrandStatement } from "@/components/sections/BrandStatement";
import { DesignPrinciples } from "@/components/sections/DesignPrinciples";
import { FloorPlan } from "@/components/sections/FloorPlan";
import { Hero } from "@/components/sections/Hero";
import { Manifesto } from "@/components/sections/Manifesto";
import { ProjectGallery } from "@/components/sections/ProjectGallery";
import { SelectedResidence } from "@/components/sections/SelectedResidence";
import type { Locale } from "@/i18n/routing";
import { getHome } from "@/sanity/lib/data";

/** A section renders unless an editor has switched it off. */
const on = <T extends { enabled?: boolean | null } | null | undefined>(s: T): s is NonNullable<T> =>
  Boolean(s) && s?.enabled !== false;

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = (await params) as { locale: Locale };
  setRequestLocale(locale);
  const { data: home } = await getHome(locale);

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
    </main>
  );
}
