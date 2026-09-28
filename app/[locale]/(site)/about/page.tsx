import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { StubPage } from "@/components/layout/StubPage";
import {
  AboutChapters,
  AboutClosing,
  AboutCredentials,
  AboutHero,
  AboutIntro,
  AboutPhilosophy,
} from "@/components/sections/About";
import type { Locale } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import { getAbout, getSettings } from "@/sanity/lib/data";

export async function generateMetadata({ params }: PageProps<"/[locale]/about">): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  const [{ data: about }, { data: settings }, t] = await Promise.all([
    getAbout(locale),
    getSettings(locale),
    getTranslations({ locale, namespace: "pages" }),
  ]);
  return buildMetadata({
    locale,
    paths: { pt: "/about", en: "/about" },
    seo: about?.seo,
    fallback: settings?.defaultSeo,
    title: t("about"),
    image: about?.portrait,
  });
}

export default async function AboutPage({ params }: PageProps<"/[locale]/about">) {
  const { locale } = (await params) as { locale: Locale };
  setRequestLocale(locale);
  const { data: about } = await getAbout(locale);

  if (!about?.heading) {
    const t = await getTranslations("pages");
    return <StubPage title={t("about")} />;
  }

  return (
    <main id="main">
      <AboutHero data={about} />
      <AboutIntro data={about} />
      <AboutChapters data={about} />
      <AboutCredentials data={about} />
      <AboutPhilosophy data={about} />
      <AboutClosing data={about} />
    </main>
  );
}
