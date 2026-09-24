"use client";

import dynamic from "next/dynamic";
import { useState, type ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";
import type { LightboxLabels, LightboxSlide } from "./GalleryLightbox";

const GalleryLightbox = dynamic(() => import("./GalleryLightbox"), { ssr: false });

export type GalleryTile = {
  key: string;
  /** Server-rendered image (or placeholder). */
  media: ReactNode;
  /** Index in the lightbox slides, or null when the tile has no image. */
  slideIndex: number | null;
  openLabel: string;
  className: string;
};

export function GalleryGrid({
  tiles,
  slides,
  labels,
}: {
  tiles: GalleryTile[];
  slides: LightboxSlide[];
  labels: LightboxLabels;
}) {
  const [index, setIndex] = useState(-1);
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-6">
        {tiles.map((tile, i) => (
          <Reveal as="li" key={tile.key} variant="image" delay={(i % 2) * 0.08} className={tile.className}>
            {tile.slideIndex === null ? (
              tile.media
            ) : (
              <button
                type="button"
                aria-label={tile.openLabel}
                onClick={() => {
                  setLoaded(true);
                  setIndex(tile.slideIndex ?? 0);
                }}
                onPointerEnter={() => setLoaded(true)}
                onFocus={() => setLoaded(true)}
                className={cn("group block h-full w-full cursor-zoom-in text-left")}
              >
                {tile.media}
              </button>
            )}
          </Reveal>
        ))}
      </ul>
      {loaded ? (
        <GalleryLightbox slides={slides} index={index} onClose={() => setIndex(-1)} labels={labels} />
      ) : null}
    </>
  );
}
