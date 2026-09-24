import "server-only";

import type { Locale } from "@/i18n/routing";

/**
 * Runs a localised query and falls back to English when the requested
 * language has no document yet. Content is never machine translated.
 */
export async function withLocaleFallback<T>(
  locale: Locale,
  label: string,
  run: (language: Locale) => Promise<{ data: T }>,
): Promise<{ data: T; language: Locale; isFallback: boolean }> {
  const { data } = await run(locale);
  if (data != null || locale === "en") {
    return { data, language: locale, isFallback: false };
  }
  console.warn(
    `[i18n] No "${locale}" ${label} document found, falling back to "en". Create the ${locale.toUpperCase()} version in the Studio.`,
  );
  const fallback = await run("en");
  return { data: fallback.data, language: "en", isFallback: true };
}
