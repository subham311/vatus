import { CogIcon } from "@sanity/icons/Cog";
import { DocumentsIcon } from "@sanity/icons/Documents";
import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { EnvelopeIcon } from "@sanity/icons/Envelope";
import { HomeIcon } from "@sanity/icons/Home";
import { LockIcon } from "@sanity/icons/Lock";
import { TagIcon } from "@sanity/icons/Tag";
import { UserIcon } from "@sanity/icons/User";
import type { StructureBuilder, StructureResolver } from "sanity/structure";
import { apiVersion } from "./env";
import { supportedLanguages } from "./languages";

/**
 * Singletons appear as one item per language. The item opens the existing
 * document for that language (whatever its ID, e.g. one created from the
 * Translations menu) or a fixed-ID document such as `homePage-pt`.
 */
function singleton(
  S: StructureBuilder,
  getClient: Parameters<StructureResolver>[1]["getClient"],
  type: "siteSettings" | "homePage" | "aboutPage" | "journalPage" | "privacyPage" | "projectsPage",
  title: string,
  icon: typeof HomeIcon,
) {
  return S.listItem()
    .title(title)
    .icon(icon)
    .id(type)
    .child(
      S.list()
        .title(title)
        .id(`${type}-languages`)
        .items(
          supportedLanguages.map((lang) =>
            S.listItem()
              .title(`${title} (${lang.title})`)
              .id(`${type}-${lang.id}`)
              .icon(icon)
              .child(async () => {
                const existing = await getClient({ apiVersion }).fetch<string | null>(
                  `*[_type == $type && language == $lang] | order(_updatedAt desc)[0]._id`,
                  { type, lang: lang.id },
                );
                const id = existing?.replace(/^drafts\./, "") ?? `${type}-${lang.id}`;
                return S.document()
                  .schemaType(type)
                  .documentId(id)
                  .initialValueTemplate(`${type}-${lang.id}`)
                  .title(`${title} (${lang.title})`);
              }),
          ),
        ),
    );
}

function byLanguage(S: StructureBuilder, type: string, title: string, icon: typeof HomeIcon) {
  return S.listItem()
    .title(title)
    .icon(icon)
    .id(type)
    .child(
      S.list()
        .title(title)
        .id(`${type}-by-language`)
        .items([
          ...supportedLanguages.map((lang) =>
            S.listItem()
              .title(`${title} (${lang.title})`)
              .id(`${type}-${lang.id}`)
              .icon(icon)
              .child(
                S.documentTypeList(type)
                  .title(`${title} (${lang.title})`)
                  .filter("_type == $type && language == $lang")
                  .params({ type, lang: lang.id })
                  .initialValueTemplates([S.initialValueTemplateItem(`${type}-${lang.id}`)]),
              ),
          ),
          S.divider(),
          S.listItem()
            .title(`All ${title.toLowerCase()}`)
            .id(`${type}-all`)
            .icon(icon)
            .child(S.documentTypeList(type).title(`All ${title.toLowerCase()}`)),
        ]),
    );
}

export const structure: StructureResolver = (S, { getClient }) =>
  S.list()
    .title("VATUS")
    .items([
      singleton(S, getClient, "homePage", "Homepage", HomeIcon),
      singleton(S, getClient, "projectsPage", "Projects page", HomeIcon),
      singleton(S, getClient, "aboutPage", "About page", UserIcon),
      singleton(S, getClient, "journalPage", "Journal page", DocumentsIcon),
      singleton(S, getClient, "privacyPage", "Privacy page", LockIcon),
      singleton(S, getClient, "siteSettings", "Site settings", CogIcon),
      S.divider(),
      byLanguage(S, "project", "Projects", HomeIcon),
      S.divider(),
      byLanguage(S, "article", "Journal articles", DocumentTextIcon),
      byLanguage(S, "category", "Categories", TagIcon),
      byLanguage(S, "author", "Authors", UserIcon),
      S.divider(),
      S.listItem()
        .title("Enquiries")
        .icon(EnvelopeIcon)
        .id("enquiry")
        .child(
          S.documentTypeList("enquiry")
            .title("Enquiries")
            .defaultOrdering([{ field: "createdAt", direction: "desc" }])
            .initialValueTemplates([]),
        ),
    ]);
