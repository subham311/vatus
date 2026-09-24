"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { buttonClasses, Arrow } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import type { ResolvedLink } from "@/lib/links";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { MobileMenu } from "./MobileMenu";

function anchorOf(href: string) {
  return href.startsWith("/#") ? href.slice(2) : null;
}

/** Highlights the nav item whose homepage section is in view. */
function useActiveAnchor(anchors: string[], enabled: boolean) {
  const [active, setActive] = useState<string | null>(null);
  const key = anchors.join(",");

  useEffect(() => {
    if (!enabled) return;
    const ids = key.split(",").filter(Boolean);
    const targets = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!targets.length) return;

    const visible = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.set(entry.target.id, entry.intersectionRatio);
          else visible.delete(entry.target.id);
        }
        const first = ids.find((id) => visible.has(id)) ?? null;
        setActive(first);
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.01] },
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, [key, enabled]);

  return enabled ? active : null;
}

export function HeaderNav({
  items,
  cta,
}: {
  items: ResolvedLink[];
  cta: ResolvedLink | null;
}) {
  const t = useTranslations("common");
  const pathname = usePathname();
  const isHome = pathname === "/";
  const anchors = items.map((i) => anchorOf(i.href)).filter((a): a is string => Boolean(a));
  const active = useActiveAnchor(anchors, isHome);

  return (
    <>
      <nav aria-label={t("primaryNav")} className="hidden items-center lg:flex">
        <ul className="flex items-center gap-7 xl:gap-9">
          {items.map((item) => {
            const anchor = anchorOf(item.href);
            const current = anchor
              ? active === anchor
              : !item.external && item.href !== "/" && pathname.startsWith(item.href);
            const className = cn(
              "relative inline-flex min-h-11 items-center text-sm tracking-[0.01em] transition-colors",
              "after:absolute after:inset-x-0 after:bottom-2.5 after:h-px after:origin-left after:bg-ink after:transition-transform after:duration-500",
              current
                ? "text-ink after:scale-x-100"
                : "text-muted hover:text-ink after:scale-x-0 hover:after:scale-x-100",
            );
            return (
              <li key={item.href + item.label}>
                {item.external ? (
                  <a href={item.href} target="_blank" rel="noopener noreferrer" className={className}>
                    {item.label}
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    className={className}
                    aria-current={current ? (anchor ? "location" : "page") : undefined}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="flex items-center gap-4 xl:gap-6">
        <LocaleSwitcher className="hidden lg:flex" />
        {cta ? (
          <Link
            href={cta.href}
            className={buttonClasses("primary", "hidden min-h-10 px-5 py-2 text-sm md:inline-flex")}
          >
            <span>{cta.label}</span>
            <Arrow />
          </Link>
        ) : null}
        <MobileMenu items={items} cta={cta} activeAnchor={active} />
      </div>
    </>
  );
}
