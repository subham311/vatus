import type { PortableTextBlock } from "next-sanity";
import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/ui/Reveal";
import { RichText } from "@/components/ui/RichText";
import { SanityImage } from "@/components/ui/SanityImage";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Home } from "@/sanity/lib/data";

export async function Materials({ data }: { data: NonNullable<Home["materials"]> }) {
  const t = await getTranslations("common");
  const items = data.items ?? [];

  return (
    <section aria-labelledby="materials-heading" className="section-y">
      <div className="container-site">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            {data.heading ? <SectionHeading id="materials-heading">{data.heading}</SectionHeading> : null}
          </Reveal>
          <Reveal className="lg:col-span-7" delay={0.1}>
            <RichText
              value={data.body as PortableTextBlock[] | null}
              className="max-w-[36rem] text-muted [&>p:first-child]:text-lead [&>p:first-child]:text-ink"
            />
            {data.closing ? (
              <p className="mt-8 font-display text-[1.75rem] leading-snug text-ink">{data.closing}</p>
            ) : null}
          </Reveal>
        </div>

        {items.length ? (
          <ul className="mt-16 grid grid-cols-2 gap-4 md:mt-20 md:grid-cols-3 md:gap-6">
            {items.map((item, i) => (
              <Reveal as="li" key={item._key} variant="image" delay={(i % 3) * 0.08}>
                <figure className="group">
                  <SanityImage
                    image={item.image}
                    aspect={4 / 5}
                    sizes="(min-width: 768px) 30vw, 46vw"
                    hoverScale
                    placeholderLabel={t("imageToCome")}
                  />
                  <figcaption className="eyebrow mt-4 text-[0.6875rem] text-muted">{item.title}</figcaption>
                </figure>
              </Reveal>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
