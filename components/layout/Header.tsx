import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { urlFor } from "@/sanity/lib/image";
import { resolveCta, type ResolvedLink } from "@/lib/links";
import type { Settings } from "@/sanity/lib/data";
import { HeaderNav } from "./HeaderNav";

export function Wordmark({
  settings,
  tone = "dark",
  className,
}: {
  settings: Settings | null;
  tone?: "dark" | "light";
  className?: string;
}) {
  const logo = tone === "dark" ? settings?.logoDark : settings?.logoLight;
  if (logo?.asset?._ref) {
    return (
      // SVG logos are served as-is from the Sanity CDN.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={urlFor(logo).url()}
        alt={logo.alt || settings?.siteName || "VATUS"}
        className={className ?? "h-6 w-auto"}
        width={120}
        height={24}
      />
    );
  }
  return (
    <span className={className ?? "font-display text-[1.75rem] leading-none tracking-[0.08em]"}>
      {settings?.siteName || "VATUS"}
    </span>
  );
}

export async function Header({ settings }: { settings: Settings | null }) {
  const t = await getTranslations("common");
  const items = (settings?.navItems ?? [])
    .map(resolveCta)
    .filter((l): l is ResolvedLink => Boolean(l));
  const cta = resolveCta(settings?.headerCta);

  return (
    <header className="sticky top-0 z-50 h-[var(--header-h)] border-b border-line bg-bg">
      <div className="container-site flex h-full items-center justify-between gap-6">
        <Link href="/" className="flex min-h-11 items-center gap-5" aria-label={t("homeLink")}>
          <Wordmark settings={settings} />
          {settings?.descriptor ? (
            <span className="eyebrow hidden border-l border-line pl-5 text-[0.625rem] text-muted xl:inline">
              {settings.descriptor}
            </span>
          ) : null}
        </Link>
        <HeaderNav items={items} cta={cta} />
      </div>
    </header>
  );
}
