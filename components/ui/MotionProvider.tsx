"use client";

import { LazyMotion } from "motion/react";
import type { ReactNode } from "react";

// Animation features load after first paint, keeping the initial bundle small.
const loadFeatures = () => import("./motion-features").then((mod) => mod.default);

export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      {children}
    </LazyMotion>
  );
}
