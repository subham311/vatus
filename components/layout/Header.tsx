import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { BrandLockup } from "@/components/ui/BrandLockup";
import { resolveCta, withProjectsIndex, type ResolvedLink } from "@/lib/links";
import type { Settings } from "@/sanity/lib/data";
import { HeaderNav } from "./HeaderNav";

export async function Header({ settings, projectsIndex = false }: { settings: Settings | null; projectsIndex?: boolean }) {
  const t = await getTranslations("common");
  const items = withProjectsIndex(
    (settings?.navItems ?? []).map(resolveCta).filter((l): l is ResolvedLink => Boolean(l)),
    projectsIndex,
  );
  const cta = resolveCta(settings?.headerCta);

  return (
    <header className="sticky top-0 z-50 h-[var(--header-h)] border-b border-line bg-bg">
      <div className="container-site flex h-full items-center justify-between gap-6">
        <Link href="/" className="flex min-h-11 items-center gap-5" aria-label={t("homeLink")}>
          <BrandLockup tagline={t("tagline")} />
          {settings?.descriptor ? (
            <span className="eyebrow hidden whitespace-nowrap border-l border-line pl-5 text-[0.625rem] text-muted min-[1800px]:inline">
              {settings.descriptor}
            </span>
          ) : null}
        </Link>
        <HeaderNav items={items} cta={cta} />
      </div>
    </header>
  );
}
