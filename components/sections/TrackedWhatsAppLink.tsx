"use client";

import type { ReactNode } from "react";
import { pushEvent } from "@/lib/analytics";

export function TrackedWhatsAppLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => pushEvent({ event: "whatsapp_click", location: "contact_section" })}
    >
      {children}
    </a>
  );
}
