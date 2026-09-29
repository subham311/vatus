"use client";

import { useLocale, useTranslations } from "next-intl";
import { getPathname, usePathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { BrazilFlag, UsFlag } from "@/components/ui/Flags";
import { cn } from "@/lib/cn";
import { useAlternates } from "./Alternates";

const FLAGS: Record<Locale, { Flag: typeof BrazilFlag; name: string }> = {
  pt: { Flag: BrazilFlag, name: "Português (Brasil)" },
  en: { Flag: UsFlag, name: "English (US)" },
};

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
      <ul className={cn("flex items-center", size === "lg" ? "gap-3" : "gap-1")}>
        {routing.locales.map((locale) => {
          const active = locale === current;
          const href = alternates?.[locale] ?? pathname;
          const { Flag, name } = FLAGS[locale];
          return (
            <li key={locale} className="flex items-center">
              {/* A full document load: the root layout, <html lang> and router cache all change. */}
              <a
                href={getPathname({ href, locale })}
                hrefLang={locale === "pt" ? "pt-BR" : "en"}
                lang={locale === "pt" ? "pt-BR" : "en"}
                aria-current={active ? "true" : undefined}
                onClick={onNavigate}
                title={name}
                className={cn(
                  "group relative inline-flex min-h-11 min-w-11 items-center justify-center",
                  // A short hairline under the current language; the others sit back until hovered.
                  "after:absolute after:bottom-2 after:left-1/2 after:h-px after:-translate-x-1/2 after:bg-ink after:transition-[width] after:duration-300",
                  size === "lg" ? "after:w-0 aria-[current]:after:w-7" : "after:w-0 aria-[current]:after:w-5",
                )}
              >
                <Flag
                  className={cn(
                    "transition-[opacity,filter] duration-300",
                    size === "lg" ? "h-[1.3125rem] w-[1.875rem]" : "h-[0.875rem] w-5",
                    active ? "opacity-100" : "opacity-55 saturate-[0.35] group-hover:opacity-100 group-hover:saturate-100",
                  )}
                />
                <span className="sr-only">
                  {active ? `${t("currentLanguage")}: ` : null}
                  {name}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
