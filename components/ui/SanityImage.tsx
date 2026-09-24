import { Image } from "next-sanity/image";
import { urlFor } from "@/sanity/lib/image";
import { cn } from "@/lib/cn";
import { ImagePlaceholder } from "./ImagePlaceholder";

export type SanityImageData =
  | {
      asset?: { _ref: string } | null;
      crop?: { top?: number; bottom?: number; left?: number; right?: number } | null;
      hotspot?: { x?: number; y?: number; width?: number; height?: number } | null;
      alt?: string | null;
      caption?: string | null;
      lqip?: string | null;
      aspectRatio?: number | null;
    }
  | null
  | undefined;

type Props = {
  image: SanityImageData;
  /** Responsive sizes attribute. Always set this. */
  sizes: string;
  /** Width / height. Omit to use the image's natural proportions. */
  aspect?: number;
  /** Fill the parent box instead of reserving an aspect ratio. */
  fill?: boolean;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
  placeholderLabel: string;
  tone?: "light" | "dark";
  /** Gentle 1.00 → 1.02 scale when an ancestor with `group` is hovered. */
  hoverScale?: boolean;
};

const MAX_WIDTH = 2400;

export function SanityImage({
  image,
  sizes,
  aspect,
  fill = false,
  priority = false,
  className,
  imgClassName,
  placeholderLabel,
  tone = "light",
  hoverScale = false,
}: Props) {
  const ratio = aspect ?? image?.aspectRatio ?? 4 / 3;
  const boxStyle = fill ? undefined : { aspectRatio: String(ratio) };

  if (!image?.asset?._ref) {
    return (
      <div className={cn("relative overflow-hidden", fill && "h-full w-full", className)} style={boxStyle}>
        <ImagePlaceholder label={placeholderLabel} tone={tone} className="absolute inset-0" />
      </div>
    );
  }

  // The editor's crop is applied by the URL builder. The box ratio is set in
  // CSS so it can change per breakpoint; object-position follows the hotspot.
  const src = urlFor(image).width(MAX_WIDTH).url();

  const hx = image.hotspot?.x ?? 0.5;
  const hy = image.hotspot?.y ?? 0.5;

  return (
    <div className={cn("relative overflow-hidden bg-placeholder", fill && "h-full w-full", className)} style={boxStyle}>
      <Image
        src={src}
        alt={image.alt ?? ""}
        fill
        sizes={sizes}
        priority={priority}
        fetchPriority={priority ? "high" : undefined}
        loading={priority ? undefined : "lazy"}
        quality={80}
        placeholder={image.lqip ? "blur" : "empty"}
        blurDataURL={image.lqip ?? undefined}
        style={{ objectPosition: `${hx * 100}% ${hy * 100}%` }}
        className={cn(
          "object-cover",
          hoverScale &&
            "transition-transform duration-[1400ms] ease-out group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100",
          imgClassName,
        )}
      />
    </div>
  );
}
