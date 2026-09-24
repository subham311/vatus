import type { PortableTextBlock } from "next-sanity";
import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/ui/Reveal";
import { RichText } from "@/components/ui/RichText";
import { SanityImage } from "@/components/ui/SanityImage";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Home } from "@/sanity/lib/data";

export async function Manifesto({ data }: { data: NonNullable<Home["manifesto"]> }) {
  const t = await getTranslations("common");
  return (
    <section id="approach" aria-labelledby="approach-heading" className="section-y">
      <div className="container-site grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-5">
          {data.heading ? (
            <SectionHeading id="approach-heading" className="max-w-md">
              {data.heading}
            </SectionHeading>
          ) : null}
          <RichText
            value={data.body as PortableTextBlock[] | null}
            className="mt-8 max-w-[30rem] text-muted md:mt-10 [&>p:first-child]:text-lead [&>p:first-child]:text-ink"
          />
        </Reveal>
        <Reveal variant="image" className="lg:col-span-7">
          <SanityImage
            image={data.image}
            aspect={16 / 10}
            sizes="(min-width: 1024px) 58vw, 100vw"
            placeholderLabel={t("imageToCome")}
          />
        </Reveal>
      </div>
    </section>
  );
}
