/**
 * Seeds the EN content from the VATUS brief so the homepage renders
 * immediately. No images are created: placeholders render until editors
 * upload real photography.
 *
 *   npm run seed            create documents that do not exist yet
 *   npm run seed -- --force replace existing seeded documents
 */
import { randomUUID } from "node:crypto";
import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_WRITE_TOKEN;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-08-15";

if (!projectId || !dataset || !token) {
  console.error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET or SANITY_API_WRITE_TOKEN.",
  );
  process.exit(1);
}

const client = createClient({ projectId, dataset, token, apiVersion, useCdn: false });
const force = process.argv.includes("--force");
const language = "en";

const key = () => randomUUID().replace(/-/g, "").slice(0, 12);

function block(text: string, style = "normal") {
  return {
    _type: "block",
    _key: key(),
    style,
    markDefs: [],
    children: [{ _type: "span", _key: key(), text, marks: [] }],
  };
}

const anchor = (label: string, value: string) => ({
  _key: key(),
  _type: "cta",
  label,
  linkType: "anchor",
  anchor: value,
});

const path = (label: string, value: string) => ({
  _key: key(),
  _type: "cta",
  label,
  linkType: "internal",
  path: value,
});

const PROJECT_ID = "project-residence-01-en";

const siteSettings = {
  _id: "siteSettings-en",
  _type: "siteSettings",
  language,
  siteName: "VATUS",
  descriptor: "Architecture • Development • Construction",
  navItems: [
    anchor("Projects", "projects"),
    anchor("Approach", "approach"),
    path("Journal", "/journal"),
    path("About", "/about"),
    anchor("Contact", "contact"),
  ],
  headerCta: { ...anchor("Schedule a call", "contact"), _key: undefined },
  whatsappMessage:
    "Hello, I am contacting VATUS through your website and would like more information about your residences.",
  locationLine: "Goiânia — Goiás — Brazil",
  address: { locality: "Goiânia", region: "GO", country: "BR" },
  contactInterests: [
    ["available-residence", "Available residence"],
    ["future-developments", "Future VATUS developments"],
    ["architecture", "Architecture"],
    ["residential-construction", "Residential construction"],
    ["general", "General enquiry"],
  ].map(([value, label]) => ({ _key: key(), _type: "interestOption", value, label })),
  financingDisclaimer:
    "Depending on the buyer’s circumstances and applicable lending criteria, certain VATUS residences may fall within the value range of residential financing programmes, including Minha Casa Minha Vida. Financing approval and programme eligibility are determined independently by the relevant financial institution.",
  privacyPolicyUrl: "/privacy",
  defaultSeo: {
    _type: "seo",
    title: "VATUS | Architecture, Development & Construction in Goiânia",
    description:
      "VATUS creates thoughtfully designed residential architecture in Goiânia, combining more than 26 years of international experience with careful planning, construction quality and contemporary design.",
    noIndex: false,
  },
};

const residence = {
  _id: PROJECT_ID,
  _type: "project",
  language,
  name: "VATUS Residence 01",
  slug: { _type: "slug", current: "vatus-residence-01" },
  location: "Recanto do Bosque — Goiânia, Brazil",
  locationDetail: "Recanto do Bosque • Goiânia, Goiás",
  area: 90,
  bedrooms: 3,
  bathrooms: 2,
  typology: "Contemporary Residential Architecture",
  intro: [
    block(
      "A compact contemporary residence designed around efficient use of space, natural light and everyday comfort.",
    ),
    block(
      "The project demonstrates a principle central to VATUS: a controlled construction budget should never be an excuse for poor architecture.",
    ),
    block(
      "Every area has been considered in relation to furniture, circulation, daylight, ventilation and the way a family actually uses a home.",
    ),
  ],
  floorPlans: [
    {
      _key: key(),
      _type: "annotatedPlan",
      title: "Ground floor",
      annotations: [
        [1, "Efficient circulation", "Reduce unnecessary circulation so more area becomes genuine living space.", 46, 52],
        [2, "Connected living", "Living, dining and kitchen are considered together.", 30, 34],
        [3, "Usable bedrooms", "Plan around furniture, wardrobes, circulation, privacy and natural light.", 74, 30],
        [4, "Natural light", "Openings are positioned and proportioned as part of the architecture.", 20, 72],
        [5, "Privacy", "Social and private zones are considered as part of the plan.", 64, 68],
      ].map(([number, title, text, x, y]) => ({
        _key: key(),
        _type: "planAnnotation",
        number,
        title,
        text,
        x,
        y,
      })),
    },
  ],
  status: "under-construction",
  availabilityLabel: "Available",
  showPrice: false,
  showFinancingNote: true,
  enquiryInterest: "available-residence",
  pageEnabled: false,
};

const ref = (id: string) => ({ _type: "reference", _ref: id });

const homePage = {
  _id: "homePage-en",
  _type: "homePage",
  language,
  hero: {
    enabled: true,
    heading: "Homes designed for better living.",
    subheading:
      "Architecture, development and construction shaped by more than 26 years of international experience across the United States and United Kingdom. Now creating homes in Goiânia and its surrounding region.",
    locationTag: "Goiânia, Brazil",
    primaryCta: { _type: "cta", label: "Explore our work", linkType: "anchor", anchor: "projects" },
    secondaryCta: { _type: "cta", label: "About VATUS", linkType: "internal", path: "/about" },
  },
  manifesto: {
    enabled: true,
    heading: "Architecture starts with how we live.",
    body: [
      block("We do not begin a home with its façade. We begin with the people who will live inside it."),
      block(
        "How morning light enters a room. How air moves through the house. How the kitchen relates to the living space. Where furniture naturally belongs. How privacy is created. How sound travels. How the building responds to heat. And how every square metre contributes to everyday life.",
      ),
      block("The architecture grows from these decisions."),
    ],
  },
  brandStatement: {
    enabled: true,
    statement: "A good home is not defined by its price.",
    supporting:
      "It is defined by how thoughtfully it has been designed and how carefully it has been built.",
  },
  selectedResidence: {
    enabled: true,
    eyebrow: "Selected residence",
    project: ref(PROJECT_ID),
    exploreLabel: "Explore the design",
    enquireLabel: "Enquire about availability",
  },
  projectGallery: { enabled: true, heading: "Project gallery", showHeading: false, maxImages: 6 },
  floorPlan: {
    enabled: true,
    heading: "Every square metre has a purpose.",
    fullScreenLabel: "View full screen",
  },
  designPrinciples: {
    enabled: true,
    heading: "Designed around people.",
    principles: [
      ["space", "Space", "Good design is not simply about more square metres. It is about making the square metres you have work harder."],
      ["light", "Light", "Window position, orientation and room proportions are considered to create brighter interiors while responding to local climate."],
      ["air", "Air", "Where site and design allow, openings are arranged to support natural air movement."],
      ["temperature", "Temperature", "Roof construction, insulation, orientation, shading, ventilation and materials all influence comfort."],
      ["sound", "Sound", "Room planning and construction systems are considered with privacy and sound transmission in mind."],
    ].map(([k, title, text]) => ({ _key: key(), _type: "principle", key: k, title, text, icon: k })),
  },
  constructionQuality: {
    enabled: true,
    heading: "Quality you can see. Quality you can’t.",
    body: [
      block("The quality of a home is not defined only by its flooring, worktops or façade."),
      block(
        "Much of what determines whether a house performs well for decades disappears once construction is complete.",
      ),
    ],
    items: [
      "Structure",
      "Waterproofing",
      "Electrical installation",
      "Plumbing",
      "Roofing",
      "Insulation",
      "Drainage",
      "Junctions between materials",
      "Fixings and sealing",
    ].map((title) => ({ _key: key(), _type: "qualityItem", title })),
    closing:
      "At VATUS, the elements that will eventually be hidden receive the same attention as the elements that remain visible.",
  },
  materials: {
    enabled: true,
    heading: "Material matters.",
    body: [
      block("We do not select materials simply because they are expensive, fashionable or inexpensive."),
      block(
        "Each material is considered in terms of its purpose, durability, maintenance, appearance and contribution to the performance of the home.",
      ),
      block("Our objective is not excess. It is to use the right material in the right place."),
    ],
    closing: "Better decisions create better homes.",
    items: ["Stone", "Timber", "Metal", "Glass", "Tile", "Rendered surfaces"].map((title) => ({
      _key: key(),
      _type: "material",
      title,
    })),
  },
  intelligentResources: {
    enabled: true,
    heading: "Intelligent use of resources.",
    body: [
      block(
        "Good architecture does not come from spending without limits. It comes from knowing where investment creates real value.",
      ),
      block(
        "We look carefully at construction systems, suppliers, materials and detailing to direct resources towards the elements that most influence comfort, durability and everyday experience.",
      ),
      block("The result is architecture that feels considered rather than excessive."),
    ],
  },
  internationalExperience: {
    enabled: true,
    heading: "International experience. Local understanding.",
    timeline: [
      ["USA", "1999–2008", "Hands-on experience in residential construction and building work in the United States."],
      ["United Kingdom", "2008–2026", "Architecture, residential development, refurbishment, extensions and construction experience within a mature built-environment market."],
      ["Brazil", "Today", "Applying decades of international experience to residential architecture and construction in Goiânia and its surrounding region."],
    ].map(([country, period, text]) => ({ _key: key(), _type: "timelineItem", country, period, text })),
    note:
      "The objective is not to reproduce American or European houses in Brazil. It is to bring a culture of planning, detailing and construction quality to projects designed specifically for Brazilian climate, materials and ways of living.",
    cta: { _type: "cta", label: "Read our story", linkType: "internal", path: "/about" },
  },
  availableResidences: {
    enabled: true,
    eyebrow: "Available residences",
    projects: [{ ...ref(PROJECT_ID), _key: key() }],
    viewLabel: "View residence",
    enquireLabel: "Enquire",
  },
  journalPreview: {
    enabled: true,
    heading: "VATUS Journal",
    intro:
      "Notes on architecture, materials, construction and the details that make homes better places to live.",
    mode: "latest",
    cta: { _type: "cta", label: "Visit the Journal", linkType: "internal", path: "/journal" },
  },
  contact: {
    enabled: true,
    heading: "Let’s talk.",
    subheading: "Homes. Architecture. Development.",
    body:
      "If you are interested in one of our residences, a future VATUS development or would simply like to know more about our work, we would be pleased to hear from you.",
  },
  seo: {
    _type: "seo",
    title: "VATUS | Architecture, Development & Construction in Goiânia",
    description:
      "VATUS creates thoughtfully designed residential architecture in Goiânia, combining more than 26 years of international experience with careful planning, construction quality and contemporary design.",
    noIndex: false,
  },
};

// Copy from the brief (section 6). Credentials stay empty until verified.
const aboutPage = {
  _id: "aboutPage-en",
  _type: "aboutPage",
  language,
  eyebrow: "About VATUS",
  heading: "A life shaped by architecture and construction.",
  subheading: "From the United States to the United Kingdom. Now building a new chapter in Brazil.",
  founderRole: "Founder",
  intro: [
    block("My relationship with construction began in the United States in 1999."),
    block(
      "Working around buildings and construction gave me an understanding that has remained fundamental throughout my career: architecture does not end with a drawing. A successful building requires the relationship between design and construction to work from the beginning.",
    ),
    block(
      "Over the following decades, my experience moved from the practical side of building towards architecture, residential design and development. That journey took me from the United States to London and, eventually, back to Brazil.",
    ),
  ],
  chapters: [
    {
      _key: key(),
      _type: "chapter",
      country: "United States",
      period: "1999–2008",
      body: [
        block(
          "My early professional experience was developed in the United States, where I gained direct exposure to construction and the practical realities of building.",
        ),
        block(
          "Those years created a lasting respect for execution, sequencing, materials and the relationship between what is drawn and what is actually constructed.",
        ),
      ],
    },
    {
      _key: key(),
      _type: "chapter",
      country: "United Kingdom",
      period: "2008–2026",
      body: [
        block(
          "Moving to London opened the next chapter of my career. My work developed increasingly towards architecture and residential projects, including refurbishment, extensions, planning, technical design and the coordination of construction.",
        ),
        block(
          "Working within the UK built environment strengthened my approach to regulation, detailing, building performance and the responsibility architects have for the way people experience space.",
        ),
      ],
    },
    {
      _key: key(),
      _type: "chapter",
      country: "Brazil",
      period: "A new chapter",
      body: [
        block(
          "VATUS brings these experiences together. The objective is not to import an American or British architectural style into Brazil. Brazil has its own climate, materials, culture and way of living.",
        ),
        block(
          "Instead, VATUS applies principles developed through decades of international experience: thoughtful planning; efficient use of space; attention to detail; respect for building performance; appropriate material selection; and careful execution.",
        ),
        block(
          "The result should feel Brazilian, but benefit from a much broader architectural and construction perspective.",
        ),
      ],
    },
  ],
  credentialsHeading: "Qualifications & memberships",
  philosophyEyebrow: "Founder philosophy",
  philosophyHeading: "What I believe.",
  beliefs: [
    "I believe architecture should improve ordinary life.",
    "A window should be where it is for a reason.",
    "A room should work with furniture inside it.",
    "Natural light should be considered before artificial light.",
    "Materials should be chosen for more than appearance.",
    "Comfort should include temperature, sound, privacy and movement.",
    "And the parts of a building that cannot be seen after completion deserve just as much attention as those that can.",
  ],
  philosophyClosing: "These ideas form the foundation of VATUS.",
  closingStatement: "Different countries. Different building cultures. One philosophy.",
  closingSupporting: "Design carefully. Build properly. Create homes that last.",
  primaryCta: { ...anchor("Explore our work", "projects"), _key: undefined },
  secondaryCta: { ...anchor("Get in touch", "contact"), _key: undefined },
};

// Copy from the brief (section 5). The featured article is left for editors.
const journalPage = {
  _id: "journalPage-en",
  _type: "journalPage",
  language,
  eyebrow: "Journal",
  heading: "Architecture, construction and better ways of living.",
  intro:
    "Thoughts, observations and practical insight from our work in residential architecture and construction.",
  featuredLabel: "Featured",
  closingStatement: "Interested in our work?",
  closingCta: { ...anchor("Explore VATUS residences", "projects"), _key: undefined },
};

// Articles are created as drafts: they appear in the Studio and in preview,
// and on the live site once an editor publishes them.
const articles = [
  ["why-good-residential-architecture-starts-with-the-floor-plan", "Why good residential architecture starts with the floor plan"],
  ["natural-light-one-of-the-most-valuable-materials-in-architecture", "Natural light: one of the most valuable materials in architecture"],
  ["quality-you-cannot-see", "Quality you cannot see"],
  // The rest of the launch list (brief section 5).
  ["what-makes-a-residential-floor-plan-genuinely-good", "What makes a residential floor plan genuinely good?"],
  [
    "why-a-90-m2-house-can-feel-larger-than-a-poorly-designed-120-m2-house",
    "Why a 90 m² house can feel larger than a poorly designed 120 m² house",
  ],
  ["designing-for-the-climate-of-goiania", "Designing for the climate of Goiânia"],
  ["thermal-comfort-starts-before-air-conditioning", "Thermal comfort starts before air conditioning"],
  ["how-we-evaluate-materials", "How we evaluate materials"],
  [
    "why-affordable-architecture-does-not-have-to-mean-inferior-architecture",
    "Why affordable architecture does not have to mean inferior architecture",
  ],
].map(([slug, title], i) => ({
  _id: `drafts.article-${slug}-en`,
  _type: "article",
  language,
  title,
  slug: { _type: "slug", current: slug },
  publishedAt: new Date(Date.UTC(2026, 8, 20 - i * 7, 9)).toISOString(),
}));

function clean<T extends Record<string, unknown>>(doc: T): T {
  // Drop undefined values (e.g. the helper _key on singleton CTAs).
  return JSON.parse(JSON.stringify(doc));
}

async function main() {
  const docs: Array<{ _id: string; _type: string } & Record<string, unknown>> = [
    siteSettings,
    residence,
    homePage,
    aboutPage,
    journalPage,
    ...articles,
  ].map((d) => clean(d as Record<string, unknown>) as { _id: string; _type: string });
  const tx = client.transaction();
  for (const doc of docs) {
    if (force) tx.createOrReplace(doc);
    else tx.createIfNotExists(doc);
  }
  await tx.commit({ visibility: "sync" });
  console.log(
    `Seeded ${docs.length} documents into ${projectId}/${dataset}${force ? " (replaced)" : " (existing documents kept)"}:`,
  );
  for (const doc of docs) console.log(`  • ${doc._id}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
