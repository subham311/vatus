import { Reveal } from "@/components/ui/Reveal";
import type { Home } from "@/sanity/lib/data";

export function BrandStatement({ data }: { data: NonNullable<Home["brandStatement"]> }) {
  if (!data.statement) return null;
  return (
    <section aria-labelledby="statement-heading" className="on-dark bg-charcoal text-on-dark">
      <div className="container-site py-[clamp(2.5rem,4vw,4rem)]">
        <Reveal>
          <h2
            id="statement-heading"
            className="font-display text-[clamp(2.25rem,4vw,4.25rem)] leading-[1.08] text-on-dark lg:whitespace-nowrap"
          >
            {data.statement}
          </h2>
          {data.supporting ? (
            <p className="mt-6 max-w-none font-heading text-[clamp(1.375rem,2.4vw,2.25rem)] leading-[1.3] text-on-dark-muted md:mt-8">
              {data.supporting}
            </p>
          ) : null}
        </Reveal>
      </div>
    </section>
  );
}
