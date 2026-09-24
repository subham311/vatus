import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "089y29c4",
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  },
  typegen: {
    path: ["./sanity/**/*.ts", "./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
    schema: "./sanity/extract.json",
    generates: "./sanity/types.ts",
    overloadClientMethods: true,
  },
});
