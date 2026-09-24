import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";

export default async function NotFound() {
  const t = await getTranslations("common");
  return (
    <main id="main" className="container-site section-y min-h-[60vh]">
      <p className="eyebrow text-muted">404</p>
      <SectionHeading as="h1" className="mt-6 max-w-2xl">
        {t("notFound")}
      </SectionHeading>
      <div className="mt-10">
        <Button href="/" variant="outline" arrow>
          {t("backToHome")}
        </Button>
      </div>
    </main>
  );
}
