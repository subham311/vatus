import { CogIcon } from "@sanity/icons/Cog";
import { defineArrayMember, defineField, defineType } from "sanity";
import { languageField } from "../shared";

const LOGO_HINT = {
  long: "Desktop header and footer. Horizontal version.",
  short: "Tablet and mobile header. Symbol or compact version.",
};

function logoField(name: string, title: string, size: "long" | "short", tone: "dark" | "light") {
  return defineField({
    name,
    title,
    type: "imageWithAlt",
    group: "brand",
    fieldset: "logos",
    options: { accept: "image/svg+xml", hotspot: false },
    description: `${LOGO_HINT[size]} ${
      tone === "dark" ? "Dark artwork." : "White or light artwork."
    } SVG only, with the canvas trimmed tight to the artwork — any empty space around the logo in the file makes it look small on the site.`,
  });
}

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  icon: CogIcon,
  fieldsets: [
    {
      name: "logos",
      title: "Logos",
      description:
        "The long logo shows on desktop and in the footer, the short logo on tablet and mobile. Leave all empty to use the typeset VATUS wordmark.",
      options: { columns: 2 },
    },
  ],
  groups: [
    { name: "brand", title: "Brand", default: true },
    { name: "navigation", title: "Navigation" },
    { name: "contact", title: "Contact" },
    { name: "legal", title: "Legal & footer" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    languageField,
    defineField({
      name: "siteName",
      type: "string",
      group: "brand",
      initialValue: "VATUS",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "descriptor",
      type: "string",
      group: "brand",
      initialValue: "Architecture • Development • Construction",
    }),
    logoField("logoDark", "Long logo — for light backgrounds", "long", "dark"),
    logoField("logoDarkShort", "Short logo — for light backgrounds", "short", "dark"),
    logoField("logoLight", "Long logo — for dark backgrounds", "long", "light"),
    logoField("logoLightShort", "Short logo — for dark backgrounds", "short", "light"),
    defineField({
      name: "navItems",
      title: "Navigation items",
      type: "array",
      group: "navigation",
      description:
        "Never add financing, programme or price-led items to the navigation.",
      of: [defineArrayMember({ type: "cta" })],
      validation: (R) =>
        R.custom((items: Array<{ label?: string }> | undefined) => {
          const banned = /minha casa minha vida|financ|cheap|affordable|barat|financiamento/i;
          const hit = items?.find((i) => i.label && banned.test(i.label));
          return hit ? `“${hit.label}” is not allowed in the navigation.` : true;
        }),
    }),
    defineField({ name: "headerCta", title: "Header button", type: "cta", group: "navigation" }),
    defineField({ name: "email", type: "string", group: "contact" }),
    defineField({
      name: "whatsappNumber",
      title: "WhatsApp number",
      type: "string",
      group: "contact",
      description: "International format, digits only, e.g. 5562999999999",
      validation: (R) =>
        R.custom((v: string | undefined) =>
          !v || /^\d{8,15}$/.test(v) ? true : "Use digits only, including country code.",
        ),
    }),
    defineField({
      name: "whatsappMessage",
      title: "WhatsApp pre-filled message",
      type: "text",
      rows: 2,
      group: "contact",
    }),
    defineField({ name: "instagramUrl", title: "Instagram URL", type: "url", group: "contact" }),
    defineField({
      name: "locationLine",
      type: "string",
      group: "contact",
      initialValue: "Goiânia — Goiás — Brazil",
    }),
    defineField({
      name: "address",
      title: "Address (structured data)",
      type: "object",
      group: "contact",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: "streetAddress", type: "string" }),
        defineField({ name: "locality", type: "string", initialValue: "Goiânia" }),
        defineField({ name: "region", type: "string", initialValue: "GO" }),
        defineField({ name: "postalCode", type: "string" }),
        defineField({ name: "country", type: "string", initialValue: "BR" }),
      ],
    }),
    defineField({
      name: "contactInterests",
      title: "Contact form interest options",
      type: "array",
      group: "contact",
      of: [defineArrayMember({ type: "interestOption" })],
    }),
    defineField({
      name: "financingDisclaimer",
      title: "Financing disclaimer",
      type: "text",
      rows: 4,
      group: "legal",
      description: "Shown only on residences with “Show financing note” enabled.",
    }),
    defineField({ name: "footerText", type: "text", rows: 2, group: "legal" }),
    defineField({
      name: "privacyPolicyUrl",
      title: "Privacy policy link",
      type: "string",
      group: "legal",
      description: "A path such as /privacy or a full URL.",
    }),
    defineField({ name: "defaultSeo", title: "Default SEO", type: "seo", group: "seo" }),
  ],
  preview: {
    select: { language: "language" },
    prepare: ({ language }) => ({ title: `Site settings (${language?.toUpperCase() ?? "?"})` }),
  },
});
