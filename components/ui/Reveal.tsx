"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** "fade" lifts text gently; "image" uses a slow clip reveal. */
  variant?: "fade" | "image";
  as?: "div" | "li" | "figure";
};

export function Reveal({
  children,
  className,
  delay = 0,
  variant = "fade",
  as = "div",
}: RevealProps) {
  const reduce = useReducedMotion();
  const Tag = motion[as];

  if (reduce) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }

  const hidden =
    variant === "image"
      ? { opacity: 0, clipPath: "inset(6% 0% 6% 0%)" }
      : { opacity: 0, y: 16 };
  const shown =
    variant === "image"
      ? { opacity: 1, clipPath: "inset(0% 0% 0% 0%)" }
      : { opacity: 1, y: 0 };

  return (
    <Tag
      data-reveal=""
      className={className}
      initial={hidden}
      whileInView={shown}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{
        duration: variant === "image" ? 1.4 : 0.9,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </Tag>
  );
}
