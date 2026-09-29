import { Reveal } from "@/components/ui/Reveal";
import type { Home } from "@/sanity/lib/data";

export function BrandStatement({ data }: { data: NonNullable<Home["brandStatement"]> }) {
  if (!data.statement) return null;
  return (
    <section aria-labelledby="statement-heading" className="on-dark bg-charcoal text-on-dark">
      <div className="container-site py-[clamp(6rem,14vw,12rem)]">
        <Reveal className="max-w-[68rem]">
          <h2 id="statement-heading" className="font-display text-statement text-on-dark">
            {data.statement}
          </h2>
          {data.supporting ? (
            <p className="mt-8 max-w-[44rem] font-heading text-[clamp(1.375rem,2.4vw,2.25rem)] leading-[1.3] text-on-dark-muted md:mt-12">
              {data.supporting}
            </p>
          ) : null}
        </Reveal>
      </div>
    </section>
  );
}
