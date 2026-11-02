import { getTranslations } from "next-intl/server";
import { stegaClean } from "next-sanity";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SanityImage, type SanityImageData } from "@/components/ui/SanityImage";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { urlFor } from "@/sanity/lib/image";
import type { Home } from "@/sanity/lib/data";
import { GalleryGrid, type GalleryTile } from "./GalleryGrid";
import type { LightboxSlide } from "./GalleryLightbox";

/** The grid shows at most five tiles; the lightbox holds every image. */
const MAX_TILES = 5;

const BIG = "col-span-2 aspect-[4/3] sm:aspect-[16/9] md:aspect-auto md:row-span-2";
const SMALL = "aspect-square md:aspect-auto";
const WIDE = "col-span-2 aspect-[16/9] md:aspect-auto md:col-span-2";

/**
 * Feature layout: one large image on the left (half the width, both rows),
 * the rest fill the right half. Classes per tile count so the grid never has
 * gaps or empty placeholders. Mobile: wide first image, then a 2-up grid.
 */
function layoutFor(count: number): string[] {
  switch (count) {
    case 1:
      return [`${BIG} md:col-span-4`];
    case 2:
      return [`${BIG} md:col-span-2`, `${WIDE} md:row-span-2`];
    case 3:
      return [`${BIG} md:col-span-2`, `${SMALL} md:col-span-2`, `${SMALL} md:col-span-2`];
    case 4:
      return [`${BIG} md:col-span-2`, SMALL, SMALL, WIDE];
    default:
      return [`${BIG} md:col-span-2`, SMALL, SMALL, SMALL, SMALL];
  }
}

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
  projectName,
}: {
  data: NonNullable<Home["projectGallery"]>;
  images: SanityImageData[];
  projectName?: string | null;
}) {
  const t = await getTranslations("gallery");
  const tc = await getTranslations("common");

  const all = images.filter((img): img is NonNullable<SanityImageData> => Boolean(img?.asset?._ref));
  if (!all.length) return null;

  const max = Math.min(Math.max(stegaClean(data.maxImages) ?? MAX_TILES, 1), MAX_TILES);
  const shown = all.slice(0, max);
  const hidden = all.length - shown.length;
  const layout = layoutFor(shown.length);
  const slides = all.map((img, i) => toSlide(img, img.alt || `${i + 1}`));

  const tiles: GalleryTile[] = shown.map((image, i) => {
    const isBig = i === 0;
    const isLast = i === shown.length - 1;
    return {
      key: `${i}-${image.asset?._ref}`,
      className: layout[i] ?? SMALL,
      slideIndex: i,
      openLabel: t("open", { index: i + 1, total: slides.length, alt: image.alt ?? "" }),
      caption: image.caption || image.alt,
      more: isLast && hidden > 0 ? t("more", { count: hidden }) : null,
      media: (
        <SanityImage
          image={image}
          fill
          sizes={isBig ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 25vw, 50vw"}
          hoverScale
          placeholderLabel={tc("imageToCome")}
        />
      ),
    };
  });

  const label = stegaClean(data.heading) || t("label");
  const title = projectName ? t("title", { name: projectName }) : label;

  const header = (
    <div>
      {data.showHeading !== false || !projectName ? <Eyebrow className="mb-4">{label}</Eyebrow> : null}
      <SectionHeading id="gallery-heading">{title}</SectionHeading>
    </div>
  );

  return (
    <section aria-labelledby="gallery-heading" className="pb-[var(--section-y)]">
      <div className="container-site">
        <GalleryGrid
          header={header}
          tiles={tiles}
          slides={slides}
          viewAllLabel={t("viewAll", { count: slides.length })}
          labels={{
            previous: t("previous"),
            next: t("next"),
            close: t("close"),
            slideOf: t("slideOf", { index: "{index}", total: "{total}" }),
            lightbox: t("lightbox"),
            gallery: title,
          }}
        />
      </div>
    </section>
  );
}
