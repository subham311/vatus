import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Size = "section" | "display" | "statement";

const sizes: Record<Size, string> = {
  section: "text-section",
  display: "text-display",
  statement: "text-statement",
};

export function SectionHeading({
  children,
  as: Tag = "h2",
  size = "section",
  className,
  id,
}: {
  children: ReactNode;
  as?: "h1" | "h2" | "h3";
  size?: Size;
  className?: string;
  id?: string;
}) {
  return (
    <Tag id={id} className={cn("font-display", sizes[size], className)}>
      {children}
    </Tag>
  );
}
