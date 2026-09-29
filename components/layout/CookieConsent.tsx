"use client";

import Script from "next/script";
import { useEffect, useState, useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { buttonClasses } from "@/components/ui/Button";
import { OPEN_CONSENT_EVENT, readConsent, updateConsent, writeConsent, type Consent } from "@/lib/consent";

const CHANGE_EVENT = "vatus:consent-change";

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => window.removeEventListener(CHANGE_EVENT, onChange);
}

/**
 * Asks once for analytics consent and loads Google Tag Manager only after the
 * visitor accepts. Accept and decline carry equal weight, as LGPD/GDPR expect.
 */
export function CookieConsent({ gtmId }: { gtmId: string }) {
  const t = useTranslations("consent");
  // Undefined on the server (the cookie is only read in the browser), so nothing renders there.
  const consent = useSyncExternalStore(subscribe, readConsent, () => undefined);
  const [reopened, setReopened] = useState(false);
  const open = consent === null || reopened;

  useEffect(() => {
    const reopen = () => setReopened(true);
    window.addEventListener(OPEN_CONSENT_EVENT, reopen);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, reopen);
  }, []);

  function choose(value: Consent) {
    const wasGranted = consent === "granted";
    writeConsent(value);
    updateConsent(value);
    window.dispatchEvent(new Event(CHANGE_EVENT));
    setReopened(false);
    // GTM cannot be unloaded, so withdrawing consent starts a clean page.
    if (wasGranted && value === "denied") location.reload();
  }

  return (
    <>
      {consent === "granted" ? (
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer',${JSON.stringify(gtmId)});`}
        </Script>
      ) : null}

      {open ? (
        <section
          role="region"
          aria-labelledby="consent-heading"
          className="fixed inset-x-4 bottom-4 z-50 border border-line bg-surface p-6 shadow-[0_12px_40px_-16px_rgba(30,30,27,0.35)] sm:inset-x-6 sm:bottom-6 md:right-auto md:max-w-[28rem]"
        >
          <h2 id="consent-heading" className="eyebrow text-[0.6875rem] text-muted">
            {t("heading")}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink/90">
            {t("body")}{" "}
            <Link href="/privacy" className="underline decoration-1 underline-offset-4 hover:text-ink">
              {t("learnMore")}
            </Link>
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <button type="button" onClick={() => choose("denied")} className={buttonClasses("outline", "px-4")}>
              {t("decline")}
            </button>
            <button type="button" onClick={() => choose("granted")} className={buttonClasses("outline", "px-4")}>
              {t("accept")}
            </button>
          </div>
        </section>
      ) : null}
    </>
  );
}

/** Footer link that reopens the banner so visitors can change their choice. */
export function CookieSettingsButton() {
  const t = useTranslations("consent");
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))}
      className="inline-flex min-h-11 items-center hover:text-ink"
    >
      {t("settings")}
    </button>
  );
}
