import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { resolveCta } from "@/lib/links";
import type { Home } from "@/sanity/lib/data";

export function InternationalExperience({ data }: { data: NonNullable<Home["internationalExperience"]> }) {
  const timeline = data.timeline ?? [];
  const cta = resolveCta(data.cta);

  return (
    <section aria-labelledby="experience-heading" className="on-dark bg-olive text-on-dark">
      <div className="container-site grid gap-12 py-[clamp(5rem,10vw,8rem)] lg:grid-cols-12 lg:gap-0">
        <Reveal className="lg:col-span-4 lg:border-r lg:border-line-dark lg:pr-12">
          {data.heading ? (
            <SectionHeading id="experience-heading" className="text-on-dark">
              {data.heading}
            </SectionHeading>
          ) : null}
        </Reveal>

        <div className="lg:col-span-8 lg:pl-12">
          <ol className="relative grid gap-10 border-l border-line-dark pl-8 md:grid-cols-3 md:gap-8 md:border-t md:border-l-0 md:pt-10 md:pl-0">
            {timeline.map((item, i) => (
              <Reveal as="li" key={item._key} delay={i * 0.12} className="relative">
                <span
                  aria-hidden="true"
                  className="absolute top-1.5 -left-[2.3rem] h-2.5 w-2.5 rounded-full border border-on-dark bg-olive md:-top-[45px] md:left-0"
                />
                <p className="eyebrow text-[0.6875rem] text-on-dark-muted">{item.period}</p>
                <h3 className="mt-2 font-heading text-[1.75rem] leading-tight text-on-dark">{item.country}</h3>
                {item.text ? <p className="mt-3 text-[0.9375rem] text-on-dark-muted">{item.text}</p> : null}
              </Reveal>
            ))}
          </ol>

          {data.note ? (
            <Reveal delay={0.2}>
              <p className="mt-12 max-w-[42rem] text-lead text-on-dark/90 md:mt-14">{data.note}</p>
            </Reveal>
          ) : null}
          {cta ? (
            <div className="mt-8">
              <Button href={cta.href} external={cta.external} variant="text" arrow className="text-on-dark">
                {cta.label}
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
