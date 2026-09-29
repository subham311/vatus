import { stegaClean } from "next-sanity";
import { getTranslations } from "next-intl/server";
import { Arrow, Button } from "@/components/ui/Button";
import { EnquireLink } from "@/components/ui/EnquireLink";
import { Reveal } from "@/components/ui/Reveal";
import { SanityImage } from "@/components/ui/SanityImage";
import { Link } from "@/i18n/navigation";
import { PROJECTS_INDEX_PATH, projectHref, statusPill } from "@/lib/links";
import { DEFAULT_RESIDENCE_CARDS } from "@/sanity/lib/data";
import type { Home } from "@/sanity/lib/data";

type Project = NonNullable<NonNullable<NonNullable<Home["availableResidences"]>["projects"]>[number]>;

const STATUSES = ["under-construction", "available", "reserved", "sold"] as const;

export async function AvailableResidences({
  data,
  financingDisclaimer,
  projectsIndex = false,
}: {
  data: NonNullable<Home["availableResidences"]>;
  financingDisclaimer: string | null;
  /** Whether the /projects index is on, which adds a “View all” link. */
  projectsIndex?: boolean;
}) {
  const t = await getTranslations("residence");
  const tc = await getTranslations("common");
  const tp = await getTranslations("projects");
  const limit = stegaClean(data.maxCards) ?? DEFAULT_RESIDENCE_CARDS;
  const projects = (data.projects ?? []).filter((p): p is Project => Boolean(p)).slice(0, limit);
  if (!projects.length) return null;

  const facts = (p: Project) =>
    [
      p.locationDetail || p.location,
      p.area ? t("area", { area: p.area }) : null,
      p.bedrooms != null ? t("bedroomsTitle", { count: p.bedrooms }) : null,
      p.bathrooms != null ? t("bathroomsTitle", { count: p.bathrooms }) : null,
    ].filter(Boolean) as string[];

  return (
    <section aria-labelledby="available-heading" className="section-y">
      <div className="container-site">
        <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3">
          {data.eyebrow ? (
            <h2 id="available-heading" className="eyebrow text-muted">
              {data.eyebrow}
            </h2>
          ) : null}
          {projectsIndex ? (
            <Link
              href={PROJECTS_INDEX_PATH}
              className="group inline-flex min-h-11 items-center gap-3 text-[0.9375rem] tracking-[0.02em] hover:underline hover:decoration-1 hover:underline-offset-[6px]"
            >
              {data.viewAllLabel || tp("viewAll")}
              <Arrow />
            </Link>
          ) : null}
        </div>
        <ul className="mt-8 flex flex-col gap-8">
          {projects.map((p) => {
            const status = stegaClean(p.status);
            const statusLabel = STATUSES.includes(status as (typeof STATUSES)[number])
              ? t(`status.${status as (typeof STATUSES)[number]}`)
              : null;
            const pill = statusPill(statusLabel, p.availabilityLabel);
            const interest = stegaClean(p.enquiryInterest) || "available-residence";
            return (
              <Reveal as="li" key={p._id}>
                <article className="group grid overflow-hidden border border-line bg-surface md:grid-cols-12">
                  <div className="md:col-span-7">
                    <SanityImage
                      image={p.mainImage}
                      aspect={16 / 10}
                      fill={false}
                      sizes="(min-width: 768px) 58vw, 100vw"
                      className="h-full md:!aspect-auto md:min-h-[26rem]"
                      hoverScale
                      placeholderLabel={tc("imageToCome")}
                    />
                  </div>
                  <div className="flex flex-col p-7 md:col-span-5 md:p-10 lg:p-12">
                    {pill ? (
                      <p className="inline-flex items-center gap-2 self-start rounded-full border border-line px-3.5 py-1.5 text-xs text-ink">
                        <span aria-hidden="true" className="h-2 w-2 rounded-full bg-olive-soft" />
                        {pill}
                      </p>
                    ) : null}
                    <h3 className="mt-6 font-display text-[clamp(1.875rem,2.8vw,2.5rem)] leading-tight">{p.name}</h3>
                    <p className="mt-3 flex flex-wrap text-[0.9375rem] text-muted">
                      {facts(p).map((f, i, all) => (
                        <span key={f} className="whitespace-nowrap">
                          {f}
                          {/* Trailing, so a wrapped line never starts with a separator. */}
                          {i < all.length - 1 ? <span aria-hidden="true" className="px-1.5">•</span> : null}
                        </span>
                      ))}
                    </p>
                    {p.showPrice && p.price ? <p className="mt-4 text-ink">{p.price}</p> : null}

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row md:mt-auto md:pt-10">
                      {data.viewLabel ? (
                        <Button href={projectHref(p, "projects")} variant="primary">
                          {data.viewLabel}
                        </Button>
                      ) : null}
                      {data.enquireLabel ? (
                        <EnquireLink interest={interest} variant="outline">
                          {data.enquireLabel}
                        </EnquireLink>
                      ) : null}
                    </div>

                    {p.showFinancingNote && financingDisclaimer ? (
                      <p className="mt-8 border-t border-line pt-5 text-xs leading-relaxed text-muted">
                        {financingDisclaimer}
                      </p>
                    ) : null}
                  </div>
                </article>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
