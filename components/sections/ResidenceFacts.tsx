import { BedDouble, Bath, House, Frame } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { cn } from "@/lib/cn";

type Facts = {
  area?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  typology?: string | null;
};

/** Area, bedrooms and bathrooms in a divided row; typology on its own line. */
export async function ResidenceFacts({ project, className }: { project: Facts; className?: string }) {
  const t = await getTranslations("residence");
  const facts = [
    project.area ? { icon: House, text: t("area", { area: project.area }) } : null,
    project.bedrooms != null ? { icon: BedDouble, text: t("bedrooms", { count: project.bedrooms }) } : null,
    project.bathrooms != null ? { icon: Bath, text: t("bathrooms", { count: project.bathrooms }) } : null,
  ].filter((f): f is { icon: typeof House; text: string } => Boolean(f));

  if (!facts.length && !project.typology) return null;

  return (
    <div className={cn("border-y border-line py-6", className)}>
      <ul aria-label={t("facts")} className="grid grid-cols-2 gap-x-4 gap-y-4 sm:flex sm:flex-wrap sm:items-center">
        {facts.map(({ icon: Icon, text }, i) => (
          <li
            key={text}
            className={cn(
              "flex items-center gap-3 whitespace-nowrap text-[0.9375rem] text-ink sm:pr-6",
              i > 0 && "sm:border-l sm:border-line sm:pl-6",
            )}
          >
            <Icon aria-hidden="true" strokeWidth={1.25} className="h-6 w-6 shrink-0 text-olive-soft" />
            <span>{text}</span>
          </li>
        ))}
        {project.typology ? (
          <li className="col-span-2 flex basis-full items-center gap-3 border-t border-line pt-4 text-[0.9375rem] text-muted">
            <Frame aria-hidden="true" strokeWidth={1.25} className="h-6 w-6 shrink-0 text-olive-soft" />
            <span>{project.typology}</span>
          </li>
        ) : null}
      </ul>
    </div>
  );
}
