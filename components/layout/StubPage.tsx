import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";

/** Minimal styled page used until a section of the site is designed. */
export async function StubPage({ title, children }: { title: string; children?: ReactNode }) {
  const t = await getTranslations("common");
  return (
    <main id="main" className="container-site section-y min-h-[60vh]">
      <SectionHeading as="h1" size="display" className="max-w-4xl">
        {title}
      </SectionHeading>
      {children ?? <p className="mt-8 max-w-xl text-lead text-muted">{t("comingSoon")}</p>}
      <div className="mt-12">
        <Button href="/" variant="outline" arrow>
          {t("backToHome")}
        </Button>
      </div>
    </main>
  );
}
