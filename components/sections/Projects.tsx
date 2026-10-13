import { stegaClean } from "next-sanity";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { SanityImage } from "@/components/ui/SanityImage";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { projectHref, resolveCta, statusPill } from "@/lib/links";
import type { ProjectsIndexItem, ProjectsPage } from "@/sanity/lib/data";

/** Page copy may be missing entirely; every section falls back to UI strings. */
type Data = ProjectsPage | null | undefined;
type Project = ProjectsIndexItem;

const STATUSES = ["under-construction", "available", "reserved", "sold"] as const;

export async function ProjectsHero({ data }: { data: Data }) {
  const t = await getTranslations("projects");
  const tp = await getTranslations("pages");
  const intro = data?.intro ?? t("intro");

  return (
    <section className="container-site pt-12 pb-[var(--section-y)] md:pt-20">
      <Reveal className="max-w-[60rem]">
        <Eyebrow>{data?.eyebrow || tp("projects")}</Eyebrow>
        <SectionHeading as="h1" size="display" className="mt-6 max-w-[18ch]">
          {data?.heading || t("heading")}
        </SectionHeading>
        {intro ? <p className="mt-8 max-w-[38rem] text-lead text-muted md:mt-10">{intro}</p> : null}
      </Reveal>
    </section>
  );
}

async function ProjectCard({ project }: { project: Project }) {
  const t = await getTranslations("residence");
  const tc = await getTranslations("common");
  const status = stegaClean(project.status);
  const statusLabel = STATUSES.includes(status as (typeof STATUSES)[number])
    ? t(`status.${status as (typeof STATUSES)[number]}`)
    : null;
  const pill = statusPill(statusLabel, project.availabilityLabel);
  const facts = [
    project.area ? t("area", { area: project.area }) : null,
    project.bedrooms != null ? t("bedrooms", { count: project.bedrooms }) : null,
    project.bathrooms != null ? t("bathrooms", { count: project.bathrooms }) : null,
  ].filter(Boolean) as string[];

  return (
    <article className="group relative flex flex-col">
      <div className="relative">
        <SanityImage
          image={project.mainImage}
          aspect={4 / 3}
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 100vw"
          hoverScale
          placeholderLabel={tc("imageToCome")}
        />
        {pill ? (
          <p className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-full bg-surface/95 px-3.5 py-1.5 text-xs text-ink">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-olive-soft" />
            {pill}
          </p>
        ) : null}
      </div>
      {project.location ? <p className="eyebrow mt-6 text-[0.6875rem] text-muted">{project.location}</p> : null}
      <h2 className="mt-3 font-heading text-[1.75rem] leading-tight">
        <Link
          href={projectHref(project)}
          className="after:absolute after:inset-0 group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4"
        >
          {project.name}
        </Link>
      </h2>
      {facts.length ? (
        <p className="mt-3 flex flex-wrap text-[0.9375rem] text-muted">
          {facts.map((f, i) => (
            <span key={f} className="whitespace-nowrap">
              {f}
              {i < facts.length - 1 ? <span aria-hidden="true" className="px-1.5">•</span> : null}
            </span>
          ))}
        </p>
      ) : null}
    </article>
  );
}

export async function ProjectsGrid({ projects }: { projects: Project[] }) {
  const tp = await getTranslations("pages");
  return (
    <section aria-label={tp("projects")} className="border-t border-line section-y">
      <ul className="container-site grid gap-14 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-20">
        {projects.map((project, i) => (
          <Reveal as="li" key={project._id} delay={(i % 3) * 0.08}>
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </ul>
    </section>
  );
}

export async function ProjectsClosing({ data }: { data: Data }) {
  const t = await getTranslations("projects");
  const cta = resolveCta(data?.closingCta) ?? { href: "/#contact", external: false, label: t("contact") };

  return (
    <section aria-labelledby="projects-closing-heading" className="on-dark bg-charcoal text-on-dark">
      <div className="container-site flex flex-col gap-10 py-[clamp(3.5rem,6vw,6rem)] md:flex-row md:items-end md:justify-between">
        <Reveal className="max-w-[44rem]">
          <h2 id="projects-closing-heading" className="font-display text-section text-on-dark">
            {data?.closingStatement || t("closing")}
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
