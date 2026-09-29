import { stegaClean, type PortableTextBlock } from "next-sanity";
import { getFormatter, getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/Button";
import { ArticleBody } from "@/components/ui/ArticleBody";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Privacy } from "@/sanity/lib/data";

/** Until the legal copy is in the CMS, the page says it is being prepared. */
export async function PrivacyPolicy({ data }: { data: Privacy | null | undefined }) {
  const t = await getTranslations("privacy");
  const tc = await getTranslations("common");
  const tp = await getTranslations("pages");
  const format = await getFormatter();
  const updated = data?.lastUpdated ? new Date(stegaClean(data.lastUpdated)) : null;
  const body = data?.body as PortableTextBlock[] | null | undefined;

  return (
    <main id="main">
      <section className="container-site pt-12 md:pt-20">
        <Reveal className="mx-auto max-w-[44rem]">
          <Eyebrow>{data?.eyebrow || t("eyebrow")}</Eyebrow>
          <SectionHeading as="h1" size="display" className="mt-6">
            {data?.heading || tp("privacy")}
          </SectionHeading>
          {data?.intro ? <p className="mt-8 text-lead text-muted">{data.intro}</p> : null}
          {updated ? (
            <p className="mt-6 text-sm text-muted">
              {t("lastUpdated", { date: format.dateTime(updated, { dateStyle: "long", timeZone: "UTC" }) })}
            </p>
          ) : null}
        </Reveal>
      </section>
      <div className="container-site section-y pt-12">
        {body?.length ? (
          <ArticleBody value={body} placeholderLabel={tc("imageToCome")} className="mx-auto max-w-[44rem]" />
        ) : (
          <div className="mx-auto max-w-[44rem]">
            <p className="text-lead text-muted">{tc("comingSoon")}</p>
            <div className="mt-12">
              <Button href="/" variant="outline" arrow>
                {tc("backToHome")}
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
