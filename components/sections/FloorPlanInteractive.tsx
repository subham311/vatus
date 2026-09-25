"use client";

import { Maximize2 } from "lucide-react";
import { m, useInView, useReducedMotion } from "motion/react";
import dynamic from "next/dynamic";
import { useId, useRef, useState, type ReactNode } from "react";
import { buttonClasses } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import type { ZoomLabels } from "./FloorPlanZoom";

const FloorPlanZoom = dynamic(() => import("./FloorPlanZoom"), { ssr: false });

export type PlanNote = {
  key: string;
  number: number;
  title: string;
  text: string | null;
  x: number;
  y: number;
  markerLabel: string;
};

export function FloorPlanInteractive({
  plan,
  zoomPlan,
  aspect,
  notes,
  labels,
}: {
  plan: ReactNode;
  zoomPlan: ReactNode;
  aspect: number;
  notes: PlanNote[];
  labels: ZoomLabels & { viewFullScreen: string; notes: string };
}) {
  const id = useId();
  const [active, setActive] = useState<number | null>(null);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [zoomLoaded, setZoomLoaded] = useState(false);
  const planRef = useRef<HTMLDivElement>(null);
  const inView = useInView(planRef, { once: true, margin: "0px 0px -25% 0px" });
  const reduce = useReducedMotion();
  const show = reduce || inView;
  const activeNote = notes.find((n) => n.number === active) ?? null;

  // Hover, focus and tap all select (a tap fires focus then click, so no toggling).
  const select = (n: number) => setActive(n);

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
      <div className="lg:col-span-7">
        <div ref={planRef} className="relative bg-surface" style={{ aspectRatio: String(aspect) }}>
          {plan}
          {notes.map((note, i) => {
            const isActive = active === note.number;
            return (
              <m.button
                key={note.key}
                type="button"
                data-reveal=""
                aria-pressed={isActive}
                aria-label={note.markerLabel}
                aria-describedby={`${id}-note-${note.number}`}
                onClick={() => select(note.number)}
                onMouseEnter={() => setActive(note.number)}
                onFocus={() => setActive(note.number)}
                initial={reduce ? false : { opacity: 0, scale: 0.6 }}
                animate={show ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.6, delay: reduce ? 0 : 0.25 + i * 0.18, ease: [0.22, 1, 0.36, 1] }}
                className="absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
                style={{ left: `${note.x}%`, top: `${note.y}%` }}
              >
                <span
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ring-2 ring-surface transition-[background-color,color,transform] duration-300",
                    isActive ? "scale-110 bg-ink text-on-dark" : "bg-olive text-on-dark",
                  )}
                >
                  {note.number}
                </span>
              </m.button>
            );
          })}
        </div>

        {/* On small screens the selected note is echoed under the plan. */}
        <p aria-live="polite" className="mt-4 min-h-12 text-sm text-muted lg:hidden">
          {activeNote ? (
            <>
              <span className="font-semibold text-ink">
                {activeNote.number}. {activeNote.title}
              </span>{" "}
              {activeNote.text}
            </>
          ) : null}
        </p>

        <button
          type="button"
          onClick={() => {
            setZoomLoaded(true);
            setZoomOpen(true);
          }}
          onPointerEnter={() => setZoomLoaded(true)}
          className={buttonClasses("outline", "mt-4 lg:mt-8")}
        >
          <Maximize2 aria-hidden="true" strokeWidth={1.25} className="h-5 w-5" />
          <span>{labels.viewFullScreen}</span>
        </button>
      </div>

      <ol aria-label={labels.notes} className="flex flex-col border-t border-line lg:col-span-5">
        {notes.map((note) => {
          const isActive = active === note.number;
          return (
            <li key={note.key} className="border-b border-line">
              <button
                type="button"
                aria-pressed={isActive}
                onClick={() => select(note.number)}
                onMouseEnter={() => setActive(note.number)}
                onFocus={() => setActive(note.number)}
                className={cn(
                  "flex w-full gap-5 py-5 text-left transition-colors duration-300",
                  isActive ? "text-ink" : "text-ink/85",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-semibold transition-colors duration-300",
                    isActive ? "border-ink bg-ink text-on-dark" : "border-olive text-olive",
                  )}
                >
                  {note.number}
                </span>
                <span className="flex flex-col gap-1">
                  <span className="font-display text-2xl leading-tight">{note.title}</span>
                  {note.text ? (
                    <span id={`${id}-note-${note.number}`} className="text-[0.9375rem] text-muted">
                      {note.text}
                    </span>
                  ) : null}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      {zoomLoaded ? (
        <FloorPlanZoom
          open={zoomOpen}
          onClose={() => setZoomOpen(false)}
          plan={zoomPlan}
          notes={notes}
          aspect={aspect}
          labels={labels}
        />
      ) : null}
    </div>
  );
}
