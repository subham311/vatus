"use client";

import { useTranslations } from "next-intl";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";
import { pushEvent } from "@/lib/analytics";

/** Small, discreet floating link. No pop-ups, no auto-open. */
export function WhatsAppButton({ href }: { href: string }) {
  const t = useTranslations("common");
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("whatsappLabel")}
      onClick={() => pushEvent({ event: "whatsapp_click", location: "floating_button" })}
      className="fixed right-4 bottom-4 z-40 inline-flex h-13 w-13 items-center justify-center rounded-full border border-line bg-surface text-olive shadow-[0_6px_24px_-10px_rgba(30,30,27,0.35)] transition-colors duration-300 hover:bg-olive hover:text-on-dark sm:right-6 sm:bottom-6"
    >
      <WhatsAppIcon className="h-6 w-6" strokeWidth={1.4} />
    </a>
  );
}
