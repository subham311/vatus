"use client";

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

export type LightboxSlide = {
  src: string;
  alt: string;
  width: number;
  height: number;
  srcSet: { src: string; width: number; height: number }[];
};

export type LightboxLabels = {
  previous: string;
  next: string;
  close: string;
  slideOf: string;
  lightbox: string;
  gallery: string;
};

export default function GalleryLightbox({
  slides,
  index,
  onClose,
  labels,
}: {
  slides: LightboxSlide[];
  index: number;
  onClose: () => void;
  labels: LightboxLabels;
}) {
  return (
    <Lightbox
      open={index >= 0}
      index={Math.max(index, 0)}
      close={onClose}
      slides={slides}
      carousel={{ finite: true, preload: 1 }}
      animation={{ fade: 300, swipe: 400 }}
      controller={{ closeOnBackdropClick: true }}
      styles={{ container: { backgroundColor: "rgba(20, 20, 18, 0.96)" } }}
      labels={{
        Previous: labels.previous,
        Next: labels.next,
        Close: labels.close,
        Lightbox: labels.lightbox,
        "Photo gallery": labels.gallery,
        "{index} of {total}": labels.slideOf,
      }}
    />
  );
}
