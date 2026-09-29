import { getTranslations } from "next-intl/server";
import { stegaClean } from "next-sanity";
import { Link } from "@/i18n/navigation";
import { InstagramIcon } from "@/components/ui/BrandIcons";
import { gtmId } from "@/lib/consent";
import { resolveCta, withProjectsIndex, type ResolvedLink } from "@/lib/links";
import type { Settings } from "@/sanity/lib/data";
import { CookieSettingsButton } from "./CookieConsent";
import { Wordmark } from "./Header";

export async function Footer({ settings, projectsIndex = false }: { settings: Settings | null; projectsIndex?: boolean }) {
  const t = await getTranslations("common");
  const items = withProjectsIndex(
    (settings?.navItems ?? []).map(resolveCta).filter((l): l is ResolvedLink => Boolean(l)),
    projectsIndex,
  );
  const privacy = stegaClean(settings?.privacyPolicyUrl);
  const privacyExternal = privacy ? /^https?:/.test(privacy) : false;
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-bg">
      <div className="container-site grid gap-12 py-16 md:grid-cols-[1.2fr_1fr] md:py-20 lg:grid-cols-[1.4fr_1fr_auto]">
        <div className="flex flex-col gap-4">
          <Wordmark
            settings={settings}
            variant="long"
            className="font-display text-[2.25rem] leading-none tracking-[0.08em]"
            imgClassName="h-14 max-w-[18rem] self-start md:h-16"
          />
          {settings?.descriptor ? (
            <p className="eyebrow text-[0.6875rem] text-muted">{settings.descriptor}</p>
          ) : null}
          {settings?.footerText ? (
            <p className="max-w-sm text-sm text-muted">{settings.footerText}</p>
          ) : null}
        </div>

        <nav aria-label={t("footerNav")}>
          <ul className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm">
            {items.map((item) => (
              <li key={item.href + item.label}>
                <Link href={item.href} className="inline-flex min-h-11 items-center text-muted transition-colors hover:text-ink">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col gap-3 text-sm lg:items-end lg:text-right">
          {settings?.instagramUrl ? (
            <a
              href={stegaClean(settings.instagramUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 text-muted transition-colors hover:text-ink"
            >
              <InstagramIcon className="h-5 w-5" />
              <span>{t("instagram")}</span>
              <span className="sr-only">{t("opensInNewTab")}</span>
            </a>
          ) : null}
          {settings?.locationLine ? <p className="text-muted">{settings.locationLine}</p> : null}
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-site flex flex-col gap-2 py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {settings?.siteName || "VATUS"}. {t("rights")}
          </p>
          <div className="flex flex-wrap gap-x-6">
            {privacy ? (
              privacyExternal ? (
                <a href={privacy} className="inline-flex min-h-11 items-center hover:text-ink" target="_blank" rel="noopener noreferrer">
                  {t("privacyPolicy")}
                </a>
              ) : (
                <Link href={privacy} className="inline-flex min-h-11 items-center hover:text-ink">
                  {t("privacyPolicy")}
                </Link>
              )
            ) : null}
            {gtmId ? <CookieSettingsButton /> : null}
          </div>
        </div>
      </div>
    </footer>
  );
}
