"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { buttonClasses, Arrow } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import type { ResolvedLink } from "@/lib/links";
import { LocaleSwitcher } from "./LocaleSwitcher";

/** Full-screen overlay menu built on the native <dialog> (focus trap + Esc). */
export function MobileMenu({
  items,
  cta,
  activeAnchor,
}: {
  items: ResolvedLink[];
  cta: ResolvedLink | null;
  activeAnchor: string | null;
}) {
  const t = useTranslations("common");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  // Close if the viewport grows past the mobile breakpoint.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Close synchronously so the scroll lock is released before an anchor jump.
  const close = () => {
    document.documentElement.style.overflow = "";
    if (dialogRef.current?.open) dialogRef.current.close();
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="-mr-2 inline-flex h-11 w-11 items-center justify-center text-ink lg:hidden"
      >
        <Menu aria-hidden="true" strokeWidth={1.25} className="h-6 w-6" />
        <span className="sr-only">{t("openMenu")}</span>
      </button>

      <dialog
        ref={dialogRef}
        onClose={close}
        aria-label={t("primaryNav")}
        className="m-0 h-dvh max-h-none w-full max-w-none bg-bg p-0 text-ink backdrop:bg-ink/30 open:flex open:flex-col"
      >
        <div className="container-site flex h-[var(--header-h)] shrink-0 items-center justify-between border-b border-line">
          <span className="font-display text-2xl tracking-[0.08em]">VATUS</span>
          <button
            type="button"
            onClick={close}
            className="-mr-2 inline-flex h-11 w-11 items-center justify-center"
          >
            <X aria-hidden="true" strokeWidth={1.25} className="h-6 w-6" />
            <span className="sr-only">{t("closeMenu")}</span>
          </button>
        </div>

        <nav aria-label={t("primaryNav")} className="container-site flex-1 overflow-y-auto py-10">
          <ul className="flex flex-col">
            {items.map((item) => {
              const anchor = item.href.startsWith("/#") ? item.href.slice(2) : null;
              const current = anchor !== null && anchor === activeAnchor;
              const className = cn(
                "flex min-h-14 items-center border-b border-line py-3 font-display text-[2.25rem] leading-tight transition-colors",
                current ? "text-ink" : "text-ink/80 hover:text-ink",
              );
              return (
                <li key={item.href + item.label}>
                  {item.external ? (
                    <a href={item.href} target="_blank" rel="noopener noreferrer" className={className} onClick={close}>
                      {item.label}
                    </a>
                  ) : (
                    <Link href={item.href} className={className} onClick={close} aria-current={current ? "location" : undefined}>
                      {item.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-6">
            <LocaleSwitcher size="lg" onNavigate={close} />
            {cta ? (
              <Link href={cta.href} onClick={close} className={buttonClasses("primary")}>
                <span>{cta.label}</span>
                <Arrow />
              </Link>
            ) : null}
          </div>
        </nav>
      </dialog>
    </>
  );
}
