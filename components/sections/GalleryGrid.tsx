"use client";

import dynamic from "next/dynamic";
import { useState, type ReactNode } from "react";
import { buttonClasses } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import type { LightboxLabels, LightboxSlide } from "./GalleryLightbox";

const GalleryLightbox = dynamic(() => import("./GalleryLightbox"), { ssr: false });

export type GalleryTile = {
  key: string;
  /** Server-rendered image that fills the tile. */
  media: ReactNode;
  /** Index in the lightbox slides. */
  slideIndex: number;
  openLabel: string;
  /** Short line shown over the image on hover. */
  caption?: string | null;
  /** "+3 photos" overlay on the last tile when more images exist. */
  more?: string | null;
  className: string;
};

export function GalleryGrid({
  header,
  tiles,
  slides,
  labels,
  viewAllLabel,
}: {
  header: ReactNode;
  tiles: GalleryTile[];
  slides: LightboxSlide[];
  labels: LightboxLabels;
  viewAllLabel: string;
}) {
  const [index, setIndex] = useState(-1);
  const [loaded, setLoaded] = useState(false);
  const open = (i: number) => {
    setLoaded(true);
    setIndex(i);
  };
  const warm = () => setLoaded(true);

  return (
    <>
      <div className="mb-10 flex flex-col gap-6 md:mb-12 md:flex-row md:items-end md:justify-between">
        <Reveal>{header}</Reveal>
        {slides.length > 1 ? (
          <button
            type="button"
            onClick={() => open(0)}
            onPointerEnter={warm}
            onFocus={warm}
            className={buttonClasses("outline", "self-start md:self-auto")}
          >
            {viewAllLabel}
          </button>
        ) : null}
      </div>

      <ul className="grid grid-cols-2 gap-2 sm:gap-3 md:h-[clamp(26rem,42vw,38rem)] md:grid-cols-4 md:grid-rows-2 lg:gap-4">
        {tiles.map((tile, i) => (
          <Reveal as="li" key={tile.key} variant="image" delay={Math.min(i, 4) * 0.06} className={tile.className}>
            <button
              type="button"
              aria-label={tile.openLabel}
              onClick={() => open(tile.slideIndex)}
              onPointerEnter={warm}
              onFocus={warm}
              className="group relative block h-full w-full cursor-zoom-in overflow-hidden text-left focus-visible:outline-offset-4"
            >
              {tile.media}
              {/* Hover veil + caption (desktop pointers only). */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none"
              />
              {tile.caption && !tile.more ? (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 hidden translate-y-2 p-5 text-[0.8125rem] leading-snug text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 motion-reduce:transition-none md:block lg:p-6"
                >
                  <span className="line-clamp-2 max-w-[32ch]">{tile.caption}</span>
                </span>
              ) : null}
              {tile.more ? (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/45 transition-colors duration-500 group-hover:bg-black/55"
                >
                  <span className="eyebrow border border-white/70 px-4 py-2 text-[0.6875rem] text-white">
                    {tile.more}
                  </span>
                </span>
              ) : null}
            </button>
          </Reveal>
        ))}
      </ul>

      {loaded ? (
        <GalleryLightbox slides={slides} index={index} onClose={() => setIndex(-1)} labels={labels} />
      ) : null}
    </>
  );
}
