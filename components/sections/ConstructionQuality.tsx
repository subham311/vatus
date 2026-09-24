import type { PortableTextBlock } from "next-sanity";
import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/ui/Reveal";
import { RichText } from "@/components/ui/RichText";
import { SanityImage } from "@/components/ui/SanityImage";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Home } from "@/sanity/lib/data";

export async function ConstructionQuality({ data }: { data: NonNullable<Home["constructionQuality"]> }) {
  const t = await getTranslations("common");
  const items = data.items ?? [];
  const withImage = items.filter((i) => i.image?.asset?._ref);
  // Until real construction photography exists, show the strip's rhythm with placeholders.
  const strip = withImage.length ? withImage : items.slice(0, 6);

  return (
    <section aria-labelledby="quality-heading" className="on-dark section-y bg-charcoal text-on-dark">
      <div className="container-site grid gap-14 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-5">
          {data.heading ? (
            <SectionHeading id="quality-heading" className="max-w-md text-on-dark">
              {data.heading}
            </SectionHeading>
          ) : null}
          <RichText
            value={data.body as PortableTextBlock[] | null}
            className="mt-8 max-w-[30rem] text-on-dark-muted [&>p:first-child]:text-lead [&>p:first-child]:text-on-dark"
          />
          {items.length ? (
            <ul className="mt-10 grid grid-cols-1 border-t border-line-dark sm:grid-cols-2">
              {items.map((item) => (
                <li key={item._key} className="border-b border-line-dark py-3 text-[0.9375rem] text-on-dark sm:odd:pr-6">
                  {item.title}
                </li>
              ))}
            </ul>
          ) : null}
          {data.closing ? (
            <p className="mt-10 max-w-[30rem] font-display text-[1.625rem] leading-snug text-on-dark italic">
              {data.closing}
            </p>
          ) : null}
        </Reveal>

        {strip.length ? (
          <ul className="grid grid-cols-2 gap-4 self-start sm:grid-cols-3 lg:col-span-7 lg:pt-4">
            {strip.map((item, i) => (
              <Reveal as="li" key={item._key} variant="image" delay={(i % 3) * 0.08}>
                <figure>
                  <SanityImage
                    image={item.image}
                    aspect={4 / 5}
                    sizes="(min-width: 1024px) 18vw, (min-width: 640px) 30vw, 46vw"
                    tone="dark"
                    placeholderLabel={t("imageToCome")}
                  />
                  <figcaption className="mt-3 text-sm text-on-dark-muted">{item.title}</figcaption>
                </figure>
              </Reveal>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
