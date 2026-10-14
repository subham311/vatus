# VATUS website

Architecture-led residential website for VATUS (Goiânia, Brazil). Next.js 16 (App Router) with an embedded Sanity Studio, PT/EN content managed as separate documents, and live content updates without redeploys.

- Site: `/` (Portuguese, default) and `/en` (English)
- Studio: `/studio`
- Brief and approved mockup: `docs/`

## Stack

| Area | Choice |
| --- | --- |
| Framework | Next.js 16 App Router, React 19, TypeScript strict |
| Styling | Tailwind CSS 4, design tokens as CSS variables in `app/globals.css` |
| CMS | Sanity (embedded Studio), `next-sanity` Live Content API, Presentation tool |
| i18n | `next-intl` (routing + UI strings), `@sanity/document-internationalization` (content) |
| Images | `next-sanity/image` on the Sanity CDN (AVIF/WebP, LQIP blur, hotspot/crop) |
| Interaction | `motion` (floor-plan markers), `react-zoom-pan-pinch`, `yet-another-react-lightbox` |
| Forms | Server action, `zod/mini` (client + server), Cloudflare Turnstile, honeypot, rate limit, optional Resend email |

Next.js 16 note: request interception lives in `proxy.ts` (the former `middleware.ts`).

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the values below
npm run seed                 # EN starter content (see "Seeding")
npm run dev                  # http://localhost:3000, Studio at /studio
```

### Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_SANITY_PROJECT_ID` | yes | Sanity project ID |
| `NEXT_SANITY_DATASET` | yes | Dataset, e.g. `production` |
| `NEXT_SANITY_API_VERSION` | no | Defaults to `2025-08-15` |
| `SANITY_API_READ_TOKEN` | yes | **Viewer** token. Draft mode, Presentation preview and live drafts. Server-side only. |
| `SANITY_API_WRITE_TOKEN` | yes | **Editor** token. Saves contact enquiries and runs the seed. Server-side only, never exposed to the browser. |
| `NEXT_SITE_URL` | yes | Public origin, e.g. `https://vatus.com.br`. Used for canonical, hreflang, sitemap and Open Graph URLs. |
| `NEXT_TURNSTILE_SITE_KEY` | prod | Cloudflare Turnstile site key. Leave empty in development to skip the widget. |
| `TURNSTILE_SECRET_KEY` | prod | Turnstile secret. When empty, the form relies on the honeypot and rate limit only. |
| `RESEND_API_KEY` | no | Enables an email notification for each enquiry. |
| `CONTACT_TO_EMAIL` | no | Recipient(s) of enquiry emails, comma-separated. |
| `CONTACT_FROM_EMAIL` | no | Sender, e.g. `VATUS <site@vatus.com.br>`. Must be a domain verified in Resend. Defaults to Resend's test sender. |

Create tokens with the Sanity CLI (`npx sanity login` first):

```bash
npx sanity tokens create "vatus-web-read" --role viewer
npx sanity tokens create "vatus-web-write" --role editor
```

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build / server |
| `npm run lint` | ESLint |
| `npm run typecheck` | Generates Next route types, then `tsc --noEmit` |
| `npm run typegen` | Extracts the Sanity schema and regenerates `sanity/types.ts` from the GROQ queries |
| `npm run seed` | Creates starter content (existing documents are kept; add `-- --force` to replace them) |
| `npm run check:copy` | Brand guardrail: fails on forbidden phrases in code, messages, seed data and the dataset |

Run `npm run typegen` after changing a schema or a query in `sanity/lib/queries.ts`.

## Seeding

`npm run seed` writes the English master copy from the brief:

- `siteSettings-en`: navigation, header button, WhatsApp message, interest options, financing disclaimer, default SEO
- `homePage-en`: all 14 sections
- `project-residence-01-en`: VATUS Residence 01 with five floor-plan annotations (page disabled)
- Three **draft** journal articles (they appear in the Studio and in preview, and on the live site once published)

No images are seeded. Every missing image renders a deliberate "Image to come" placeholder; stock photography is never used.

Contact details (email, WhatsApp number, Instagram) are not in the brief and are left empty. Add them in **Site settings → Contact**. The floating WhatsApp button appears as soon as a number is set.

## Content editing (Studio)

Open `/studio` and sign in with your Sanity account.

- **Homepage** and **Site settings** are singletons, listed once per language. Each homepage section has its own tab and a **Show this section** switch. Section order is fixed in code.
- **Projects** hold facts, gallery, annotated floor plans, status and availability. The homepage *references* projects: *04 Selected residence* uses one project (its main image, facts, gallery and first floor plan), *12 Available residences* lists any number.
- **Publish project page** (`pageEnabled`) controls `/projects/[slug]`. When off, the URL returns 404, it is excluded from the sitemap, and buttons link to the homepage instead.
- **Floor plans**: upload a redrawn presentation plan, then add annotations with a number, title, text and position as a percentage of the plan (x from the left, y from the top).
- **Journal preview** shows the latest three articles or three chosen ones. The section hides itself when there are no published articles.
- **Enquiries** are read-only records written by the contact form.
- Every image requires alternative text before publishing.

### Portuguese content

Portuguese is the default language for visitors. Content lives in separate documents per language and is never machine translated.

1. Open an English document and use **Translations → Português** in the document toolbar, or open the *(Português)* item of a singleton.
2. Write the Portuguese copy and publish.

Until a Portuguese document exists, Portuguese pages fall back to the English one and the server logs a warning. UI strings (form labels, errors, aria labels) live in `messages/pt.json` and `messages/en.json`.

### Live preview and visual editing

The **Presentation** tool in the Studio opens the site in draft mode with click-to-edit overlays. Published changes reach the live site through the Sanity Live Content API (`<SanityLive />`), with no redeploy or webhook needed.

## Brand guardrails

Enforced in code and checked by `npm run check:copy`:

- Never in navigation or headings: *Minha Casa Minha Vida*, *Financing*, *Cheap Homes*, *Affordable Houses* (the Studio also rejects these in navigation labels).
- Never anywhere: *Luxury at an affordable price, Dream home, Make your dream come true, Best price, Unmissable opportunity, Your MCMV house, European standard, Premium finish at a low price, Financing made easy, Learn how to finance, We arrange your finance.*
- Financing appears only as the independent-lender disclaimer, per residence, when **Show financing note** is on.
- No carousels, autoplay, countdowns, pop-ups or hover-only interactions. All motion respects `prefers-reduced-motion`.

## Analytics

Events are pushed to `window.dataLayer` for Google Tag Manager:

| Event | When |
| --- | --- |
| `generate_lead` | Contact form submitted successfully (`interest`, `locale`) |
| `whatsapp_click` | Floating button or contact-section WhatsApp link (`location`) |

## Deployment (Vercel)

1. Import the repository in Vercel (framework preset: Next.js).
2. Add all environment variables above for Production (and Preview). Set `NEXT_SITE_URL` to the production origin.
3. In Sanity (`npx sanity cors add <origin> --credentials` or manage.sanity.io → API → CORS origins), add with **Allow credentials**:
   - the production origin, e.g. `https://vatus.com.br`
   - `https://*.vercel.app` if you use preview deployments
   - `http://localhost:3000` for local development
4. Live updates use the Live Content API, so no webhook is required. `<SanityLive />` revalidates cached queries when content is published.
5. Turnstile: create a widget at dash.cloudflare.com for the production domain (and `localhost` for testing), then set both keys.
6. Resend (optional): verify the sending domain, then set `RESEND_API_KEY`, `CONTACT_TO_EMAIL` and `CONTACT_FROM_EMAIL`.

Rate limiting is in memory per server instance: it slows abuse, while Turnstile and the honeypot do the main filtering. For stricter limits, add a shared store such as Upstash Redis.

## Project structure

```
app/[locale]/(site)/         homepage, projects/[slug], journal, journal/[slug], about, privacy
app/studio/[[...tool]]/      embedded Sanity Studio
app/api/draft-mode/          enable / disable draft mode
app/actions/contact.ts       contact form server action
components/sections/         the 14 homepage sections and their client parts
components/layout/           Header, MobileMenu, Footer, LocaleSwitcher, WhatsAppButton, JSON-LD
components/ui/               Button, SanityImage, ImagePlaceholder, Reveal, Eyebrow, SectionHeading, …
sanity/schemaTypes/          documents/, objects/, singletons/
sanity/lib/                  client, live, image, queries, fetch (locale fallback), data
sanity/structure.ts          desk structure; sanity.config.ts, sanity.cli.ts
i18n/, messages/             next-intl routing and UI strings
scripts/                     seed.ts, check-copy.ts
```
