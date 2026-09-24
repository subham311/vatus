import { stegaClean } from "next-sanity";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/Button";
import { EnquireLink } from "@/components/ui/EnquireLink";
import { Reveal } from "@/components/ui/Reveal";
import { SanityImage } from "@/components/ui/SanityImage";
import { projectHref } from "@/lib/links";
import type { Home } from "@/sanity/lib/data";

type Project = NonNullable<NonNullable<NonNullable<Home["availableResidences"]>["projects"]>[number]>;

const STATUSES = ["under-construction", "available", "reserved", "sold"] as const;

export async function AvailableResidences({
  data,
  financingDisclaimer,
}: {
  data: NonNullable<Home["availableResidences"]>;
  financingDisclaimer: string | null;
}) {
  const t = await getTranslations("residence");
  const tc = await getTranslations("common");
  const projects = (data.projects ?? []).filter((p): p is Project => Boolean(p));
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
        {data.eyebrow ? (
          <h2 id="available-heading" className="eyebrow text-muted">
            {data.eyebrow}
          </h2>
        ) : null}
        <ul className="mt-8 flex flex-col gap-8">
          {projects.map((p) => {
            const status = stegaClean(p.status);
            const statusLabel = STATUSES.includes(status as (typeof STATUSES)[number])
              ? t(`status.${status as (typeof STATUSES)[number]}`)
              : null;
            const pill = [statusLabel, p.availabilityLabel].filter(Boolean).join(" / ");
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
                    <p className="mt-3 text-[0.9375rem] text-muted">
                      {facts(p).map((f, i) => (
                        <span key={f}>
                          {i > 0 ? <span aria-hidden="true"> • </span> : null}
                          {f}
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
