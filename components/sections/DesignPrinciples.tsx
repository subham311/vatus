import { AudioLines, Box, Sun, Thermometer, Wind, type LucideIcon } from "lucide-react";
import { stegaClean } from "next-sanity";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Home } from "@/sanity/lib/data";

const ICONS: Record<string, LucideIcon> = {
  space: Box,
  light: Sun,
  air: Wind,
  temperature: Thermometer,
  sound: AudioLines,
};

export function DesignPrinciples({ data }: { data: NonNullable<Home["designPrinciples"]> }) {
  const principles = data.principles ?? [];
  return (
    <section aria-labelledby="principles-heading" className="section-y bg-surface">
      <div className="container-site">
        {data.heading ? (
          <Reveal>
            <SectionHeading id="principles-heading" className="max-w-xl">
              {data.heading}
            </SectionHeading>
          </Reveal>
        ) : null}
        <ul className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 md:mt-20 xl:grid-cols-5 xl:gap-x-8">
          {principles.map((p, i) => {
            const Icon = ICONS[stegaClean(p.icon) ?? ""] ?? Box;
            return (
              <Reveal as="li" key={p._key} delay={i * 0.08} className="border-t border-line pt-8">
                <Icon aria-hidden="true" strokeWidth={1.25} className="h-9 w-9 text-olive-soft" />
                <h3 className="mt-8 font-display text-[1.875rem] leading-tight">{p.title}</h3>
                {p.text ? <p className="mt-4 text-[0.9375rem] text-muted">{p.text}</p> : null}
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
