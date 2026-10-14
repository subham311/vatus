export const apiVersion =
  process.env.NEXT_SANITY_API_VERSION || "2025-08-15";

/*
 * The project ID and dataset are public (they ship in the browser bundle), so
 * a missing variable falls back to the VATUS project instead of failing the
 * build. Set them in the hosting environment to point at another project.
 */
export const dataset = withFallback(process.env.NEXT_SANITY_DATASET, "production", "NEXT_SANITY_DATASET");

export const projectId = withFallback(process.env.NEXT_SANITY_PROJECT_ID, "089y29c4", "NEXT_SANITY_PROJECT_ID");

export const studioUrl = "/studio";

function withFallback(value: string | undefined, fallback: string, name: string): string {
  if (value) return value;
  if (typeof window === "undefined") {
    console.warn(`[sanity] ${name} is not set; using "${fallback}".`);
  }
  return fallback;
}
