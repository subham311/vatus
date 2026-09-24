"use client";

import type { MouseEvent, ReactNode } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { buttonClasses, Arrow, type ButtonVariant } from "./Button";

export const INTEREST_EVENT = "vatus:select-interest";

export type InterestEventDetail = { interest: string };

/**
 * Links to the contact form and pre-selects an interest. On the homepage it
 * scrolls in place; elsewhere it navigates to /?interest=…#contact and the
 * form reads the query on mount.
 */
export function EnquireLink({
  interest,
  children,
  variant = "outline",
  arrow = false,
  className,
}: {
  interest: string;
  children: ReactNode;
  variant?: ButtonVariant;
  arrow?: boolean;
  className?: string;
}) {
  const pathname = usePathname();

  function onClick(event: MouseEvent<HTMLAnchorElement>) {
    if (pathname !== "/") return;
    const target = document.getElementById("contact");
    if (!target) return;
    event.preventDefault();
    window.dispatchEvent(
      new CustomEvent<InterestEventDetail>(INTEREST_EVENT, { detail: { interest } }),
    );
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    history.replaceState(null, "", "#contact");
  }

  return (
    <Link
      href={{ pathname: "/", query: { interest }, hash: "contact" }}
      onClick={onClick}
      className={buttonClasses(variant, className)}
    >
      <span>{children}</span>
      {arrow ? <Arrow /> : null}
    </Link>
  );
}
