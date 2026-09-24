"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";

/** Very subtle parallax: the image drifts at most 6% while the hero scrolls away. */
export function HeroParallax({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "6%"]);

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      <motion.div className="absolute -inset-y-[6%] inset-x-0" style={reduce ? undefined : { y }}>
        {children}
      </motion.div>
    </div>
  );
}
