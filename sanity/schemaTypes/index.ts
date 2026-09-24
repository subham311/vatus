import type { SchemaTypeDefinition } from "sanity";
import { article } from "./documents/article";
import { enquiry } from "./documents/enquiry";
import { project } from "./documents/project";
import { author, category } from "./documents/taxonomy";
import { cta } from "./objects/cta";
import { imageWithAlt } from "./objects/imageWithAlt";
import {
  annotatedPlan,
  diagram,
  interestOption,
  material,
  planAnnotation,
  principle,
  pullQuote,
  qualityItem,
  timelineItem,
} from "./objects/misc";
import { richText } from "./objects/richText";
import { seo } from "./objects/seo";
import { homePage } from "./singletons/homePage";
import { siteSettings } from "./singletons/siteSettings";

export const schemaTypes: SchemaTypeDefinition[] = [
  // Singletons
  siteSettings,
  homePage,
  // Documents
  project,
  article,
  category,
  author,
  enquiry,
  // Objects
  imageWithAlt,
  seo,
  cta,
  richText,
  timelineItem,
  principle,
  qualityItem,
  material,
  planAnnotation,
  annotatedPlan,
  interestOption,
  pullQuote,
  diagram,
];
