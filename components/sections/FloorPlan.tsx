import { getTranslations } from "next-intl/server";
import { stegaClean } from "next-sanity";
import { Reveal } from "@/components/ui/Reveal";
import { SanityImage } from "@/components/ui/SanityImage";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Home } from "@/sanity/lib/data";
import { FloorPlanInteractive, type PlanNote } from "./FloorPlanInteractive";

type Plan = NonNullable<NonNullable<NonNullable<Home["selectedResidence"]>["project"]>["plan"]>;

export async function FloorPlan({
  data,
  plan,
}: {
  data: NonNullable<Home["floorPlan"]>;
  plan: Plan | null;
}) {
  const t = await getTranslations("floorPlan");
  const aspect = plan?.image?.aspectRatio || 4 / 3;

  const notes: PlanNote[] = (plan?.annotations ?? [])
    .filter((a) => a.number != null && a.title && a.x != null && a.y != null)
    .map((a) => ({
      key: a._key,
      number: stegaClean(a.number) as number,
      title: a.title as string,
      text: a.text,
      x: Math.min(Math.max(stegaClean(a.x) as number, 3), 97),
      y: Math.min(Math.max(stegaClean(a.y) as number, 3), 97),
      markerLabel: t("marker", { number: stegaClean(a.number) as number, title: stegaClean(a.title) as string }),
    }))
    .sort((a, b) => a.number - b.number);

  const planImage = (sizes: string) => (
    <SanityImage
      image={plan?.image}
      fill
      sizes={sizes}
      imgClassName="!object-contain"
      placeholderLabel={t("noPlan")}
    />
  );

  return (
    <section id="floor-plan" aria-labelledby="floor-plan-heading" className="section-y border-t border-line">
      <div className="container-site">
        <Reveal className="mb-12 max-w-2xl md:mb-16">
          {data.heading ? <SectionHeading id="floor-plan-heading">{data.heading}</SectionHeading> : null}
          {data.intro ? <p className="mt-6 text-lead text-muted">{data.intro}</p> : null}
        </Reveal>
        <FloorPlanInteractive
          plan={planImage("(min-width: 1024px) 56vw, 100vw")}
          zoomPlan={planImage("200vw")}
          aspect={aspect}
          notes={notes}
          labels={{
            viewFullScreen: data.fullScreenLabel || t("viewFullScreen"),
            notes: t("notes"),
            zoomIn: t("zoomIn"),
            zoomOut: t("zoomOut"),
            resetZoom: t("resetZoom"),
            close: t("close"),
            dialogLabel: t("dialogLabel"),
            zoomHint: t("zoomHint"),
          }}
        />
      </div>
    </section>
  );
}
