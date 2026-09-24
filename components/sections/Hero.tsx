import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/Button";
import { SanityImage } from "@/components/ui/SanityImage";
import { resolveCta } from "@/lib/links";
import type { Home } from "@/sanity/lib/data";
import { HeroParallax } from "./HeroParallax";

export async function Hero({ data }: { data: NonNullable<Home["hero"]> }) {
  const t = await getTranslations("common");
  const primary = resolveCta(data.primaryCta);
  const secondary = resolveCta(data.secondaryCta);

  return (
    <section
      aria-labelledby="hero-heading"
      className="on-dark relative isolate flex min-h-[calc(100svh-var(--header-h))] items-end overflow-hidden bg-charcoal text-on-dark md:min-h-[min(calc(100svh-var(--header-h)),56rem)] md:items-center"
    >
      <div className="absolute inset-0 -z-10">
        <HeroParallax>
          <SanityImage
            image={data.image}
            fill
            priority
            sizes="100vw"
            tone="dark"
            placeholderLabel={t("imageToCome")}
          />
        </HeroParallax>
        {/* Legibility: dark wash on the left (desktop) and the bottom (mobile). */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/10 md:bg-gradient-to-r md:from-black/75 md:via-black/40 md:to-transparent"
        />
      </div>

      <div className="container-site pt-24 pb-20 md:py-28">
        <div className="max-w-[40rem]">
          {data.heading ? (
            <h1 id="hero-heading" className="font-display text-display text-on-dark">
              {data.heading}
            </h1>
          ) : null}
          {data.subheading ? (
            <p className="mt-6 max-w-[34rem] text-lead text-on-dark/90 md:mt-8">{data.subheading}</p>
          ) : null}
          {primary || secondary ? (
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:gap-4 md:mt-11">
              {primary ? (
                <Button href={primary.href} external={primary.external} variant="primary">
                  {primary.label}
                </Button>
              ) : null}
              {secondary ? (
                <Button href={secondary.href} external={secondary.external} variant="outline-light">
                  {secondary.label}
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      {data.locationTag ? (
        <p className="eyebrow absolute right-[var(--gutter)] bottom-6 text-[0.6875rem] text-on-dark md:bottom-8">
          {data.locationTag}
        </p>
      ) : null}
    </section>
  );
}
