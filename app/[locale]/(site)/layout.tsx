import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { VisualEditing } from "next-sanity/visual-editing";
import { setRequestLocale } from "next-intl/server";
import { AlternatesProvider } from "@/components/layout/Alternates";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { MotionProvider } from "@/components/ui/MotionProvider";
import { routing } from "@/i18n/routing";
import { gtmId } from "@/lib/consent";
import { whatsappHref } from "@/lib/links";
import { getProjectsIndex, getSettings } from "@/sanity/lib/data";
import { SanityLive } from "@/sanity/lib/live";

export default async function SiteLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const [{ data: settings }, draft, projectsIndex] = await Promise.all([
    getSettings(locale),
    draftMode(),
    getProjectsIndex(locale),
  ]);
  const whatsapp = whatsappHref(settings?.whatsappNumber, settings?.whatsappMessage);

  return (
    <AlternatesProvider>
      <Header settings={settings} projectsIndex={projectsIndex.active} />
      <MotionProvider>{children}</MotionProvider>
      <Footer settings={settings} projectsIndex={projectsIndex.active} />
      {whatsapp ? <WhatsAppButton href={whatsapp} /> : null}
      {/* Editors previewing drafts are kept out of analytics. */}
      {gtmId && !draft.isEnabled ? <CookieConsent gtmId={gtmId} /> : null}
      <SanityLive />
      {draft.isEnabled ? <VisualEditing /> : null}
    </AlternatesProvider>
  );
}
