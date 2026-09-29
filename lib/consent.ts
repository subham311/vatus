/**
 * Cookie consent for analytics. Google Tag Manager only loads once a visitor
 * accepts; the choice is kept in a first-party cookie for six months.
 */
export const gtmId = process.env.NEXT_PUBLIC_GTM_ID?.trim() || "";

export type Consent = "granted" | "denied";

export const CONSENT_COOKIE = "vatus_consent";
const MAX_AGE = 60 * 60 * 24 * 182;

/** Event the footer's "Cookie settings" link fires to reopen the banner. */
export const OPEN_CONSENT_EVENT = "vatus:open-consent";

export function readConsent(): Consent | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${CONSENT_COOKIE}=(granted|denied)`));
  return (match?.[1] as Consent | undefined) ?? null;
}

export function writeConsent(value: Consent) {
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${CONSENT_COOKIE}=${value}; Max-Age=${MAX_AGE}; Path=/; SameSite=Lax${secure}`;
}

/**
 * Inline <head> script: Consent Mode v2 defaults (everything denied), then the
 * stored choice, so tags never run before GTM knows the visitor's answer.
 */
export const consentDefaultsScript = `
window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});
if(/(?:^|; )${CONSENT_COOKIE}=granted/.test(document.cookie)){gtag('consent','update',{analytics_storage:'granted'});}
`.trim();

declare global {
  interface Window {
    /** Defined by consentDefaultsScript. */
    gtag?: (...args: unknown[]) => void;
  }
}

export function updateConsent(value: Consent) {
  window.gtag?.("consent", "update", { analytics_storage: value });
}
