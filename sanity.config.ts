"use client";

import { documentInternationalization } from "@sanity/document-internationalization";
import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";
import { apiVersion, dataset, projectId, studioUrl } from "./sanity/env";
import { localizedTypes, singletonTypes, supportedLanguages } from "./sanity/languages";
import { resolve } from "./sanity/presentation";
import { schemaTypes } from "./sanity/schemaTypes";
import { structure } from "./sanity/structure";

const singletons = new Set<string>(singletonTypes);
const singletonActions = new Set(["publish", "discardChanges", "restore"]);

export default defineConfig({
  name: "vatus",
  title: "VATUS",
  basePath: studioUrl,
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
    // Singletons and enquiries are never created from the global "New" menu.
    templates: (templates) =>
      templates.filter(
        ({ schemaType, id }) =>
          schemaType !== "enquiry" && !(singletons.has(schemaType) && id === schemaType),
      ),
  },
  document: {
    newDocumentOptions: (prev, { creationContext }) =>
      creationContext.type === "global"
        ? prev.filter(
            (item) =>
              !singletons.has(item.templateId.split("-")[0]) &&
              item.templateId !== "enquiry",
          )
        : prev,
    actions: (prev, { schemaType }) => {
      if (singletons.has(schemaType)) {
        return prev.filter(({ action }) => action && singletonActions.has(action));
      }
      if (schemaType === "enquiry") {
        return prev.filter(({ action }) => action === "delete");
      }
      return prev;
    },
  },
  plugins: [
    structureTool({ structure }),
    presentationTool({
      resolve,
      previewUrl: {
        previewMode: { enable: "/api/draft-mode/enable" },
      },
    }),
    documentInternationalization({
      supportedLanguages: [...supportedLanguages],
      schemaTypes: [...localizedTypes],
      languageField: "language",
      apiVersion,
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
