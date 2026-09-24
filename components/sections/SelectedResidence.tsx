import { MapPin } from "lucide-react";
import type { PortableTextBlock } from "next-sanity";
import { stegaClean } from "next-sanity";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/Button";
import { EnquireLink } from "@/components/ui/EnquireLink";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { RichText } from "@/components/ui/RichText";
import { SanityImage } from "@/components/ui/SanityImage";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { projectHref } from "@/lib/links";
import type { Home } from "@/sanity/lib/data";
import { ResidenceFacts } from "./ResidenceFacts";

export async function SelectedResidence({
  data,
  hasFloorPlan,
}: {
  data: NonNullable<Home["selectedResidence"]>;
  hasFloorPlan: boolean;
}) {
  const t = await getTranslations("common");
  const project = data.project;
  if (!project) return null;

  const exploreHref = projectHref(project, hasFloorPlan ? "floor-plan" : "projects");
  const interest = stegaClean(project.enquiryInterest) || "available-residence";

  return (
    <section id="projects" aria-labelledby="residence-heading" className="section-y">
      <div className="container-site">
        <Reveal variant="image">
          <SanityImage
            image={project.mainImage}
            aspect={21 / 10}
            sizes="(min-width: 1360px) 1280px, 100vw"
            className="max-md:!aspect-[4/3]"
            placeholderLabel={t("imageToCome")}
          />
        </Reveal>

        <div className="mt-12 grid gap-12 md:mt-16 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-6">
            {data.eyebrow ? <Eyebrow>{data.eyebrow}</Eyebrow> : null}
            <SectionHeading id="residence-heading" className="mt-4">
              {project.name}
            </SectionHeading>
            {project.location ? (
              <p className="mt-4 flex items-center gap-2 text-muted">
                <MapPin aria-hidden="true" strokeWidth={1.25} className="h-5 w-5 shrink-0" />
                <span>{project.location}</span>
              </p>
            ) : null}
            <ResidenceFacts project={project} className="mt-8" />
          </Reveal>

          <Reveal className="lg:col-span-6 lg:pt-10" delay={0.1}>
            <RichText
              value={project.intro as PortableTextBlock[] | null}
              className="max-w-[34rem] text-muted [&>p:first-child]:text-lead [&>p:first-child]:text-ink"
            />
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
              {data.exploreLabel ? (
                <Button href={exploreHref} variant="primary">
                  {data.exploreLabel}
                </Button>
              ) : null}
              {data.enquireLabel ? (
                <EnquireLink interest={interest} variant="outline">
                  {data.enquireLabel}
                </EnquireLink>
              ) : null}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
