import { getTranslations } from "next-intl/server";
import { stegaClean } from "next-sanity";
import { SanityImage, type SanityImageData } from "@/components/ui/SanityImage";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/cn";
import { urlFor } from "@/sanity/lib/image";
import type { Home } from "@/sanity/lib/data";
import { GalleryGrid, type GalleryTile } from "./GalleryGrid";
import type { LightboxSlide } from "./GalleryLightbox";

/**
 * Asymmetric editorial layout on desktop (12-column grid). On mobile the
 * tiles stack in story order: façade, living, bedroom, bathroom, outdoor, detail.
 */
const LAYOUT = [
  { span: "md:col-span-7", aspect: 4 / 3, sizes: "(min-width: 768px) 58vw, 100vw" },
  { span: "md:col-span-5 md:mt-24", aspect: 4 / 5, sizes: "(min-width: 768px) 42vw, 100vw" },
  { span: "md:col-span-5", aspect: 4 / 5, sizes: "(min-width: 768px) 42vw, 100vw" },
  { span: "md:col-span-7 md:mt-16", aspect: 4 / 3, sizes: "(min-width: 768px) 58vw, 100vw" },
  { span: "md:col-span-8", aspect: 16 / 10, sizes: "(min-width: 768px) 66vw, 100vw" },
  { span: "md:col-span-4 md:mt-20", aspect: 3 / 4, sizes: "(min-width: 768px) 33vw, 100vw" },
];

const SLIDE_WIDTHS = [640, 1080, 1600, 2400];

function toSlide(image: NonNullable<SanityImageData>, alt: string): LightboxSlide {
  const ratio = image.aspectRatio || 3 / 2;
  const make = (w: number) => ({
    src: urlFor(image).width(w).auto("format").quality(82).url(),
    width: w,
    height: Math.round(w / ratio),
  });
  const largest = make(2400);
  return { ...largest, alt, srcSet: SLIDE_WIDTHS.map(make) };
}

export async function ProjectGallery({
  data,
  images,
}: {
  data: NonNullable<Home["projectGallery"]>;
  images: SanityImageData[];
}) {
  const t = await getTranslations("gallery");
  const tc = await getTranslations("common");
  const max = Math.min(Math.max(stegaClean(data.maxImages) ?? 6, 4), 6);

  // Always show the full composition: real images first, placeholders after.
  const list = [...images.filter((img) => img?.asset?._ref), ...Array(max).fill(null)].slice(0, max);
  const withImage = list.filter(Boolean) as NonNullable<SanityImageData>[];
  const slides = withImage.map((img, i) => toSlide(img, img.alt || `${i + 1}`));

  let slideCursor = 0;
  const tiles: GalleryTile[] = list.map((image, i) => {
    const layout = LAYOUT[i % LAYOUT.length];
    const slideIndex = image ? slideCursor++ : null;
    return {
      key: `${i}-${image?.asset?._ref ?? "placeholder"}`,
      className: cn(layout.span),
      slideIndex,
      openLabel: t("open", { index: (slideIndex ?? 0) + 1, total: slides.length, alt: image?.alt ?? "" }),
      media: (
        <SanityImage
          image={image}
          aspect={layout.aspect}
          sizes={layout.sizes}
          hoverScale
          placeholderLabel={tc("imageToCome")}
        />
      ),
    };
  });

  const heading = data.heading || t("label");

  return (
    <section aria-labelledby="gallery-heading" className="pb-[var(--section-y)]">
      <div className="container-site">
        <SectionHeading id="gallery-heading" className={cn("mb-12", !data.showHeading && "sr-only")}>
          {heading}
        </SectionHeading>
        <GalleryGrid
          tiles={tiles}
          slides={slides}
          labels={{
            previous: t("previous"),
            next: t("next"),
            close: t("close"),
            slideOf: t("slideOf", { index: "{index}", total: "{total}" }),
            lightbox: t("lightbox"),
            gallery: heading,
          }}
        />
      </div>
    </section>
  );
}
