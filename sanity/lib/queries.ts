import { defineQuery } from "next-sanity";

/* ---------- Fragments ---------- */

const IMAGE = /* groq */ `{
  asset,
  crop,
  hotspot,
  alt,
  caption,
  "lqip": asset->metadata.lqip,
  "aspectRatio": asset->metadata.dimensions.aspectRatio
}`;

const CTA = /* groq */ `{
  _key,
  label,
  linkType,
  anchor,
  path,
  url,
  "ref": reference->{ _type, "slug": slug.current, pageEnabled }
}`;

const PROJECT_CARD = /* groq */ `{
  _id,
  name,
  "slug": slug.current,
  location,
  locationDetail,
  area,
  bedrooms,
  bathrooms,
  typology,
  status,
  availabilityLabel,
  showPrice,
  "price": select(showPrice == true => price, null),
  showFinancingNote,
  enquiryInterest,
  pageEnabled,
  mainImage${IMAGE}
}`;

const ARTICLE_CARD = /* groq */ `{
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  heroImage${IMAGE},
  "category": category->title,
  "readingTime": round(length(pt::text(body)) / 5 / 200)
}`;

/* ---------- Queries ---------- */

export const SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings" && language == $language][0]{
    siteName,
    descriptor,
    logoDark${IMAGE},
    logoDarkShort${IMAGE},
    logoLight${IMAGE},
    logoLightShort${IMAGE},
    navItems[]${CTA},
    headerCta${CTA},
    email,
    whatsappNumber,
    whatsappMessage,
    instagramUrl,
    locationLine,
    address,
    contactInterests[]{ value, label },
    financingDisclaimer,
    footerText,
    privacyPolicyUrl,
    defaultSeo{ title, description, noIndex, shareImage${IMAGE} }
  }
`);

export const HOME_QUERY = defineQuery(`
  *[_type == "homePage" && language == $language][0]{
    _id,
    _type,
    seo{ title, description, noIndex, shareImage${IMAGE} },
    hero{
      enabled, heading, subheading, locationTag,
      image${IMAGE},
      primaryCta${CTA},
      secondaryCta${CTA}
    },
    manifesto{ enabled, heading, body, image${IMAGE} },
    brandStatement{ enabled, statement, supporting },
    selectedResidence{
      enabled, eyebrow, exploreLabel, enquireLabel,
      project->{
        ...${PROJECT_CARD},
        intro,
        gallery[]${IMAGE},
        "plan": floorPlans[0]{
          title,
          image${IMAGE},
          annotations[]{ _key, number, title, text, x, y }
        }
      }
    },
    projectGallery{ enabled, heading, showHeading, maxImages },
    floorPlan{ enabled, heading, intro, fullScreenLabel },
    designPrinciples{ enabled, heading, principles[]{ _key, key, title, text, icon } },
    constructionQuality{
      enabled, heading, body, closing,
      items[]{ _key, title, image${IMAGE} }
    },
    materials{ enabled, heading, body, closing, items[]{ _key, title, image${IMAGE} } },
    intelligentResources{ enabled, heading, body, image${IMAGE} },
    internationalExperience{
      enabled, heading, note,
      timeline[]{ _key, country, period, text },
      cta${CTA}
    },
    availableResidences{
      enabled, eyebrow, viewLabel, enquireLabel, viewAllLabel, maxCards,
      projects[]->${PROJECT_CARD}
    },
    journalPreview{ enabled, heading, intro, mode, cta${CTA} },
    "journalArticles": select(
      journalPreview.mode == "manual" => journalPreview.articles[]->${ARTICLE_CARD},
      *[_type == "article" && language == $language && defined(slug.current)]
        | order(publishedAt desc)[0...3]${ARTICLE_CARD}
    ),
    contact{ enabled, heading, subheading, body }
  }
`);

export const ABOUT_QUERY = defineQuery(`
  *[_type == "aboutPage" && language == $language][0]{
    _id,
    _type,
    eyebrow,
    heading,
    subheading,
    portrait${IMAGE},
    founderName,
    founderRole,
    intro,
    chapters[]{ _key, country, period, body, images[]${IMAGE} },
    credentialsHeading,
    credentials[]{ _key, title, issuer, year },
    philosophyEyebrow,
    philosophyHeading,
    beliefs,
    philosophyClosing,
    closingStatement,
    closingSupporting,
    primaryCta${CTA},
    secondaryCta${CTA},
    seo{ title, description, noIndex, shareImage${IMAGE} }
  }
`);

export const JOURNAL_PAGE_QUERY = defineQuery(`
  *[_type == "journalPage" && language == $language][0]{
    _id,
    _type,
    eyebrow,
    heading,
    intro,
    heroImage${IMAGE},
    featuredLabel,
    "featuredArticle": featuredArticle->${ARTICLE_CARD},
    closingStatement,
    closingCta${CTA},
    seo{ title, description, noIndex, shareImage${IMAGE} }
  }
`);

export const PRIVACY_QUERY = defineQuery(`
  *[_type == "privacyPage" && language == $language][0]{
    _id,
    _type,
    eyebrow,
    heading,
    intro,
    lastUpdated,
    body,
    seo{ title, description, noIndex, shareImage${IMAGE} }
  }
`);

export const PROJECTS_PAGE_QUERY = defineQuery(`
  *[_type == "projectsPage" && language == $language][0]{
    _id,
    _type,
    eyebrow,
    heading,
    intro,
    closingStatement,
    closingCta${CTA},
    seo{ title, description, noIndex, shareImage${IMAGE} }
  }
`);

/** Projects with their own page: available first, sold last, newest first within each. */
export const PROJECTS_INDEX_QUERY = defineQuery(`
  *[_type == "project" && language == $language && pageEnabled == true && defined(slug.current)]
    | order(
        select(status == "available" => 0, status == "under-construction" => 1, status == "reserved" => 2, status == "sold" => 3, 4) asc,
        _createdAt desc
      )${PROJECT_CARD}
`);

export const PROJECT_QUERY = defineQuery(`
  *[_type == "project" && language == $language && slug.current == $slug][0]{
    ...${PROJECT_CARD},
    intro,
    concept,
    highlights,
    availability,
    gallery[]${IMAGE},
    seo{ title, description, noIndex, shareImage${IMAGE} },
    "translations": *[_type == "translation.metadata" && references(^._id)][0]
      .translations[].value->{ language, "slug": slug.current, pageEnabled }
  }
`);

export const JOURNAL_INDEX_QUERY = defineQuery(`
  *[_type == "article" && language == $language && defined(slug.current)]
    | order(publishedAt desc)${ARTICLE_CARD}
`);

export const ARTICLE_QUERY = defineQuery(`
  *[_type == "article" && language == $language && slug.current == $slug][0]{
    ...${ARTICLE_CARD},
    body,
    "author": author->name,
    seo{ title, description, noIndex, shareImage${IMAGE} },
    socialImage${IMAGE},
    "relatedArticles": relatedArticles[]->${ARTICLE_CARD},
    "latestArticles": *[
      _type == "article" && language == $language && defined(slug.current) && slug.current != $slug
    ] | order(publishedAt desc)[0...3]${ARTICLE_CARD},
    "translations": *[_type == "translation.metadata" && references(^._id)][0]
      .translations[].value->{ language, "slug": slug.current }
  }
`);

export const SITEMAP_QUERY = defineQuery(`{
  "projects": *[_type == "project" && pageEnabled == true && defined(slug.current) && seo.noIndex != true]{
    language, "slug": slug.current, _updatedAt
  },
  "articles": *[_type == "article" && defined(slug.current) && seo.noIndex != true]{
    language, "slug": slug.current, _updatedAt
  },
  "home": *[_type == "homePage"]{ language, _updatedAt, "maxCards": availableResidences.maxCards },
  "projectLanguages": *[_type == "project" && pageEnabled == true && defined(slug.current)].language,
  "privacy": *[_type == "privacyPage" && defined(body[0]) && seo.noIndex != true]{ language, _updatedAt }
}`);

export const PROJECT_SLUGS_QUERY = defineQuery(`
  *[_type == "project" && pageEnabled == true && defined(slug.current)]{
    language, "slug": slug.current
  }
`);
