import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { urlFor } from "@/sanity/lib/image";
import { cn } from "@/lib/cn";
import { resolveCta, type ResolvedLink } from "@/lib/links";
import type { Settings } from "@/sanity/lib/data";
import { HeaderNav } from "./HeaderNav";

type Logo = Settings["logoDark"];

const hasAsset = (logo: Logo | undefined): logo is NonNullable<Logo> => Boolean(logo?.asset?._ref);

/** Intrinsic size hints so the browser reserves the right width before the SVG loads. */
function dims(logo: NonNullable<Logo>, height: number) {
  return { width: Math.round(height * (logo.aspectRatio ?? 4)), height };
}

/**
 * Brand logo from Site settings. The long logo shows from `lg` up (where the
 * full navigation appears), the short one below it; each falls back to the
 * other when only one is uploaded, and to the typeset name when neither is.
 * SVGs are served as-is from the Sanity CDN, so size comes from CSS height.
 */
export function Wordmark({
  settings,
  tone = "dark",
  variant = "responsive",
  className,
  imgClassName = "h-11 max-w-[13rem] lg:h-10 lg:max-w-[16rem]",
}: {
  settings: Settings | null;
  /** "dark" artwork for light backgrounds, "light" artwork for dark ones. */
  tone?: "dark" | "light";
  variant?: "responsive" | "long";
  /** Classes for the typeset fallback. */
  className?: string;
  /** Classes for the logo image; set the height here. */
  imgClassName?: string;
}) {
  const long = tone === "dark" ? settings?.logoDark : settings?.logoLight;
  const short = tone === "dark" ? settings?.logoDarkShort : settings?.logoLightShort;
  const desktop = hasAsset(long) ? long : hasAsset(short) ? short : null;
  const mobile = variant === "long" ? desktop : hasAsset(short) ? short : desktop;

  if (!desktop || !mobile) {
    return (
      <span className={className ?? "font-display text-[1.75rem] leading-none tracking-[0.08em]"}>
        {settings?.siteName || "VATUS"}
      </span>
    );
  }

  const img = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={urlFor(mobile).url()}
      alt={mobile.alt || settings?.siteName || "VATUS"}
      {...dims(mobile, 44)}
      className={cn("block w-auto object-contain object-left", imgClassName)}
    />
  );
  if (mobile === desktop) return img;

  return (
    <picture>
      <source media="(min-width: 1024px)" srcSet={urlFor(desktop).url()} {...dims(desktop, 40)} />
      {img}
    </picture>
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
