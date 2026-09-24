import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Eyebrow({
  children,
  className,
  as: Tag = "p",
}: {
  children: ReactNode;
  className?: string;
  as?: "p" | "span";
}) {
  return <Tag className={cn("eyebrow text-muted", className)}>{children}</Tag>;
}
