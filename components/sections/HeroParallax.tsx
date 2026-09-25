import type { ReactNode } from "react";

/**
 * Very subtle parallax: the image drifts at most 6% while the hero scrolls
 * away. Implemented as a CSS scroll-driven animation (no JavaScript); browsers
 * without support, and visitors who prefer reduced motion, see a still image.
 */
export function HeroParallax({ children }: { children: ReactNode }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="hero-parallax absolute -inset-y-[6%] inset-x-0">{children}</div>
    </div>
  );
}
