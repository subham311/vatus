"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/cn";
import { useAlternates } from "./Alternates";

export function LocaleSwitcher({
  className,
  onNavigate,
  size = "sm",
}: {
  className?: string;
  onNavigate?: () => void;
  size?: "sm" | "lg";
}) {
  const t = useTranslations("common");
  const current = useLocale() as Locale;
  const pathname = usePathname();
  const alternates = useAlternates();

  return (
    <nav aria-label={t("languageSwitcher")} className={cn("flex items-center", className)}>
      <ul className="flex items-center">
        {routing.locales.map((locale, i) => {
          const active = locale === current;
          const href = alternates?.[locale] ?? pathname;
          return (
            <li key={locale} className="flex items-center">
              {i > 0 ? (
                <span aria-hidden="true" className="px-1.5 text-line">
                  |
                </span>
              ) : null}
              <Link
                href={href}
                locale={locale}
                hrefLang={locale === "pt" ? "pt-BR" : "en"}
                lang={locale === "pt" ? "pt-BR" : "en"}
                aria-current={active ? "true" : undefined}
                onClick={onNavigate}
                className={cn(
                  "inline-flex min-h-11 min-w-8 items-center justify-center uppercase tracking-[0.12em] transition-colors",
                  size === "lg" ? "text-base" : "text-xs",
                  active ? "font-semibold text-ink" : "text-muted hover:text-ink",
                )}
              >
                {active ? <span className="sr-only">{t("currentLanguage")}: </span> : null}
                {locale.toUpperCase()}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
