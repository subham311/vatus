import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
import { setRequestLocale } from "next-intl/server";
import { AlternatesProvider } from "@/components/layout/Alternates";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import type { Locale } from "@/i18n/routing";
import { whatsappHref } from "@/lib/links";
import { getSettings } from "@/sanity/lib/data";
import { SanityLive } from "@/sanity/lib/live";

export default async function SiteLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = (await params) as { locale: Locale };
  setRequestLocale(locale);
  const [{ data: settings }, draft] = await Promise.all([getSettings(locale), draftMode()]);
  const whatsapp = whatsappHref(settings?.whatsappNumber, settings?.whatsappMessage);

  return (
    <AlternatesProvider>
      <Header settings={settings} />
      {children}
      <Footer settings={settings} />
      {whatsapp ? <WhatsAppButton href={whatsapp} /> : null}
      <SanityLive />
      {draft.isEnabled ? <VisualEditing /> : null}
    </AlternatesProvider>
  );
}
