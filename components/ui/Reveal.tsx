"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** "fade" lifts text gently; "image" uses a slow clip reveal. */
  variant?: "fade" | "image";
  as?: "div" | "li" | "figure";
};

/**
 * Reveals content once when it scrolls into view. The motion itself is pure
 * CSS (see globals.css); content is only hidden when JavaScript is running
 * (`html.js`) and the visitor has not asked for reduced motion.
 */
export function Reveal({ children, className, delay = 0, variant = "fade", as = "div" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // The three tags share the same props; typing them as div keeps the ref simple.
  const Tag = as as "div";
  return (
    <Tag
      ref={ref}
      className={className}
      data-reveal={variant}
      data-shown={shown ? "" : undefined}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </Tag>
  );
}
