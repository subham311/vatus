"use client";

import { Minus, Plus, RotateCcw, X } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";
import { KeepScale, TransformComponent, TransformWrapper, useControls } from "react-zoom-pan-pinch";
import type { PlanNote } from "./FloorPlanInteractive";

export type ZoomLabels = {
  zoomIn: string;
  zoomOut: string;
  resetZoom: string;
  close: string;
  dialogLabel: string;
  zoomHint: string;
};

function Controls({ labels, onClose }: { labels: ZoomLabels; onClose: () => void }) {
  const { zoomIn, zoomOut, resetTransform } = useControls();
  const btn =
    "inline-flex h-11 w-11 items-center justify-center border border-on-dark/40 text-on-dark transition-colors hover:bg-on-dark hover:text-ink";
  return (
    <div className="flex items-center gap-2">
      <button type="button" className={btn} onClick={() => zoomOut()}>
        <Minus aria-hidden="true" strokeWidth={1.25} className="h-5 w-5" />
        <span className="sr-only">{labels.zoomOut}</span>
      </button>
      <button type="button" className={btn} onClick={() => zoomIn()}>
        <Plus aria-hidden="true" strokeWidth={1.25} className="h-5 w-5" />
        <span className="sr-only">{labels.zoomIn}</span>
      </button>
      <button type="button" className={btn} onClick={() => resetTransform()}>
        <RotateCcw aria-hidden="true" strokeWidth={1.25} className="h-5 w-5" />
        <span className="sr-only">{labels.resetZoom}</span>
      </button>
      <button type="button" className={btn} onClick={onClose}>
        <X aria-hidden="true" strokeWidth={1.25} className="h-5 w-5" />
        <span className="sr-only">{labels.close}</span>
      </button>
    </div>
  );
}

/** Full-screen, pinch-zoomable plan in a native modal dialog. */
export default function FloorPlanZoom({
  open,
  onClose,
  plan,
  notes,
  aspect,
  labels,
}: {
  open: boolean;
  onClose: () => void;
  plan: ReactNode;
  notes: PlanNote[];
  aspect: number;
  labels: ZoomLabels;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      aria-label={labels.dialogLabel}
      className="on-dark m-0 h-dvh max-h-none w-full max-w-none bg-charcoal p-0 text-on-dark backdrop:bg-black/60 open:flex open:flex-col"
    >
      {open ? (
        <TransformWrapper minScale={1} maxScale={5} initialScale={1} centerOnInit doubleClick={{ mode: "toggle" }}>
          <div className="flex shrink-0 items-center justify-between gap-4 border-b border-line-dark px-4 py-3 sm:px-6">
            <p className="text-sm text-on-dark-muted">{labels.zoomHint}</p>
            <Controls labels={labels} onClose={onClose} />
          </div>
          <div className="min-h-0 flex-1">
            <TransformComponent
              wrapperStyle={{ width: "100%", height: "100%" }}
              contentStyle={{ width: "100%", height: "100%", alignItems: "center", justifyContent: "center" }}
            >
              <div
                className="relative bg-surface"
                style={{ aspectRatio: String(aspect), width: `min(100vw, calc((100dvh - 4.5rem) * ${aspect}))` }}
              >
                {plan}
                {notes.map((note) => (
                  <div
                    key={note.key}
                    className="absolute"
                    style={{ left: `${note.x}%`, top: `${note.y}%` }}
                    aria-hidden="true"
                  >
                    <KeepScale>
                      <span className="flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-olive text-sm font-semibold text-on-dark ring-2 ring-surface">
                        {note.number}
                      </span>
                    </KeepScale>
                  </div>
                ))}
              </div>
            </TransformComponent>
          </div>
        </TransformWrapper>
      ) : null}
    </dialog>
  );
}
