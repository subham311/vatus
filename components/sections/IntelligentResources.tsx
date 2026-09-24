import type { PortableTextBlock } from "next-sanity";
import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/ui/Reveal";
import { RichText } from "@/components/ui/RichText";
import { SanityImage } from "@/components/ui/SanityImage";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Home } from "@/sanity/lib/data";

export async function IntelligentResources({ data }: { data: NonNullable<Home["intelligentResources"]> }) {
  const t = await getTranslations("common");
  return (
    <section aria-labelledby="resources-heading" className="section-y border-t border-line">
      <div className="container-site grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal variant="image" className="lg:col-span-6">
          <SanityImage
            image={data.image}
            aspect={5 / 4}
            sizes="(min-width: 1024px) 50vw, 100vw"
            placeholderLabel={t("imageToCome")}
          />
        </Reveal>
        <Reveal className="lg:col-span-5 lg:col-start-8" delay={0.1}>
          {data.heading ? <SectionHeading id="resources-heading">{data.heading}</SectionHeading> : null}
          <RichText
            value={data.body as PortableTextBlock[] | null}
            className="mt-8 text-muted [&>p:first-child]:text-lead [&>p:first-child]:text-ink"
          />
        </Reveal>
      </div>
    </section>
  );
}
