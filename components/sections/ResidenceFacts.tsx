import { BedDouble, Bath, House, Frame } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { cn } from "@/lib/cn";

type Facts = {
  area?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  typology?: string | null;
};

export async function ResidenceFacts({ project, className }: { project: Facts; className?: string }) {
  const t = await getTranslations("residence");
  const facts = [
    project.area ? { icon: House, text: t("area", { area: project.area }) } : null,
    project.bedrooms != null ? { icon: BedDouble, text: t("bedrooms", { count: project.bedrooms }) } : null,
    project.bathrooms != null ? { icon: Bath, text: t("bathrooms", { count: project.bathrooms }) } : null,
    project.typology ? { icon: Frame, text: project.typology } : null,
  ].filter((f): f is { icon: typeof House; text: string } => Boolean(f));

  if (!facts.length) return null;

  return (
    <ul
      aria-label={t("facts")}
      className={cn(
        "grid grid-cols-2 gap-x-6 gap-y-5 border-y border-line py-6 sm:flex sm:flex-wrap sm:items-center sm:gap-0",
        className,
      )}
    >
      {facts.map(({ icon: Icon, text }, i) => (
        <li
          key={text}
          className={cn(
            "flex items-center gap-3 text-[0.9375rem] text-ink sm:px-6 sm:first:pl-0",
            i > 0 && "sm:border-l sm:border-line",
          )}
        >
          <Icon aria-hidden="true" strokeWidth={1.25} className="h-6 w-6 shrink-0 text-olive-soft" />
          <span>{text}</span>
        </li>
      ))}
    </ul>
  );
}
