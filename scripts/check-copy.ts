/**
 * Brand guardrail: fails if any forbidden phrase appears in source, UI
 * messages, seed data or (when credentials exist) the Sanity dataset.
 *
 *   npm run check:copy
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { createClient } from "next-sanity";

const FORBIDDEN = [
  "luxury at an affordable price",
  "dream home",
  "make your dream come true",
  "best price",
  "unmissable opportunity",
  "your mcmv house",
  "european standard",
  "premium finish at a low price",
  "financing made easy",
  "learn how to finance",
  "we arrange your finance",
  "cheap homes",
  "affordable houses",
];

/** Allowed only inside the independent-lender disclaimer. */
const RESTRICTED = ["minha casa minha vida"];
const DISCLAIMER_MARKER = "determined independently by the relevant financial institution";

const ROOT = process.cwd();
const SCAN = ["app", "components", "lib", "messages", "sanity", "scripts/seed.ts"];
const SKIP = new Set(["node_modules", ".next", "types.ts", "extract.json", "check-copy.ts"]);
const EXT = /\.(tsx?|json|md)$/;

function files(path: string): string[] {
  const full = join(ROOT, path);
  const stat = statSync(full);
  if (stat.isFile()) return EXT.test(full) ? [full] : [];
  return readdirSync(full).flatMap((name) => (SKIP.has(name) ? [] : files(join(path, name))));
}

const problems: string[] = [];

function check(text: string, where: string) {
  const lower = text.toLowerCase();
  for (const phrase of FORBIDDEN) {
    if (lower.includes(phrase)) problems.push(`${where}: forbidden phrase “${phrase}”`);
  }
  for (const phrase of RESTRICTED) {
    let i = lower.indexOf(phrase);
    while (i !== -1) {
      const context = lower.slice(Math.max(0, i - 400), i + 400);
      if (!context.includes(DISCLAIMER_MARKER)) {
        problems.push(`${where}: “${phrase}” outside the financing disclaimer`);
      }
      i = lower.indexOf(phrase, i + phrase.length);
    }
  }
}

for (const file of SCAN.flatMap(files)) {
  const text = readFileSync(file, "utf8")
    // The Studio navigation validator lists banned words on purpose.
    .replace(/const banned = \/.*\/i;/g, "");
  check(text, relative(ROOT, file));
}

async function checkDataset() {
  const { NEXT_PUBLIC_SANITY_PROJECT_ID: projectId, NEXT_PUBLIC_SANITY_DATASET: dataset } = process.env;
  const token = process.env.SANITY_API_READ_TOKEN;
  if (!projectId || !dataset) {
    console.log("• Skipping dataset check (no Sanity env).");
    return;
  }
  const client = createClient({ projectId, dataset, token, apiVersion: "2025-08-15", useCdn: false, perspective: "raw" });
  const docs = await client.fetch<Array<{ _id: string } & Record<string, unknown>>>(
    `*[_type in ["siteSettings", "homePage", "project", "article", "category", "author"]]`,
  );
  for (const doc of docs) {
    const { financingDisclaimer, ...rest } = doc as { financingDisclaimer?: string };
    check(JSON.stringify(rest), `dataset:${doc._id}`);
    if (financingDisclaimer) check(financingDisclaimer, `dataset:${doc._id}.financingDisclaimer`);
  }
  console.log(`• Checked ${docs.length} Sanity documents.`);
}

checkDataset()
  .catch((err) => console.warn("• Dataset check failed:", err.message))
  .finally(() => {
    if (problems.length) {
      console.error(`\n✖ ${problems.length} copy problem(s):\n  ${problems.join("\n  ")}`);
      process.exit(1);
    }
    console.log("✓ No forbidden phrases found.");
  });
