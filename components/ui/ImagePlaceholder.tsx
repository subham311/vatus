import { cn } from "@/lib/cn";

/**
 * Deliberate placeholder used whenever an editor has not yet supplied an
 * image. Never replaced with stock photography.
 */
export function ImagePlaceholder({
  label,
  className,
  tone = "light",
  aspect,
}: {
  label: string;
  className?: string;
  tone?: "light" | "dark";
  aspect?: string;
}) {
  const dark = tone === "dark";
  return (
    <div
      role="img"
      aria-label={label}
      style={aspect ? { aspectRatio: aspect } : undefined}
      className={cn(
        "relative isolate flex h-full w-full items-end overflow-hidden",
        dark ? "bg-[#2a2a26] text-on-dark-muted" : "bg-placeholder text-muted",
        className,
      )}
    >
      <svg
        aria-hidden="true"
        className="absolute inset-0 -z-10 h-full w-full"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
      >
        <defs>
          <pattern id="vatus-grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path
              d="M10 0H0V10"
              fill="none"
              stroke="currentColor"
              strokeOpacity="0.12"
              strokeWidth="0.2"
              vectorEffect="non-scaling-stroke"
            />
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#vatus-grid)" />
        <line
          x1="0"
          y1="100"
          x2="100"
          y2="0"
          stroke="currentColor"
          strokeOpacity="0.18"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <span className="eyebrow m-4 text-[0.625rem] opacity-80">{label}</span>
    </div>
  );
}
