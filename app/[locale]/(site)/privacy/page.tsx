import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { StubPage } from "@/components/layout/StubPage";
import type { Locale } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/privacy">): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  const t = await getTranslations({ locale, namespace: "pages" });
  return buildMetadata({ locale, paths: { pt: "/privacy", en: "/privacy" }, title: `${t("privacy")} | VATUS` });
}

export default async function Page({ params }: PageProps<"/[locale]/privacy">) {
  const { locale } = (await params) as { locale: Locale };
  setRequestLocale(locale);
  const t = await getTranslations("pages");
  return <StubPage title={t("privacy")} />;
}
