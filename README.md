# Badminton Borne — website

Clubwebsite van Badminton Vereniging Borne: [badmintonborne.nl](https://badmintonborne.nl).
Next.js-frontend met Sanity als headless CMS, gehost op Vercel.

## Architectuur

```
bezoeker ──▶ Vercel (Next.js 16, App Router) ──▶ Sanity Content Lake (project atjj2izc)
                    │                                      ▲
                    ├─ /api/contact ───────────────────────┤  (privé contactSubmission-documenten)
                    ├─ /api/newsletter ────────────────────┘  (Laposta, of privé newsletterSignup)
                    │
redactie ──▶ Sanity Studio (lokaal of *.sanity.studio) ──▶ Content Lake
```

- **`frontend/`** — Next.js 16 (App Router, TypeScript, Tailwind v4, next-intl NL/EN/AR).
  Rendert alle pagina's server-side/statisch en werkt live bij via `next-sanity` (wijzigingen
  in de Studio verschijnen zonder redeploy).
- **`studio/`** — Sanity Studio (schema's, structuur, seed- en beheerscripts). Draait los van
  de site; deployt niet mee naar Vercel.

### Contentmodel (page builder)

Elke pagina is een lijst **secties** die de redactie in de Studio samenstelt en ordent:

- `homePage` (singleton) en `page`-documenten (subpagina's, op slug) hebben een `sections[]`-array.
- Sectie-types: hero, featureGrid, sportHighlight, announcement, audienceSegments, ctaBanner,
  trainingTimes, gallery, testimonials, faqList, **pricingSection, teamSection,
  honoraryMembersSection, contactSection, comparisonSection, agendaSection, sponsorsSection,
  newsletterSection, newsSection**.
- Losse documenten: `membershipPackage`, `teamMember`, `honoraryMember`, `event`, `sponsor`,
  `newsArticle` (nieuws is **uitsluitend Nederlands**), `trainingTime`, `review`, `faqItem`,
  en privé: `contactSubmission`, `newsletterSignup`.
- `siteSettings` (singleton): navigatie, footer, contactinfo, speelavonden, aankondigingsbalk.

De frontend spiegelt dit in `frontend/src/components/home/SectionRenderer.tsx` (dispatcher) met
sectiecomponenten in `frontend/src/components/{home,sections}/`. Queries/types/fallbacks staan in
`frontend/src/sanity/`. Zonder Sanity-env rendert de site volledig op ingebouwde
designcontent (`frontend/src/sanity/defaults.ts`) — handig voor demo's en als vangnet.

### Routes

- `/{locale}` — homepage (secties uit `homePage`)
- `/{locale}/[slug]` — subpagina's uit `page`-documenten (met breadcrumb-hero)
- `/{locale}/nieuws` + `/{locale}/nieuws/[slug]` — nieuwsoverzicht (categorie-filter) en artikelen
- `/api/contact`, `/api/newsletter` — formulier-endpoints (schrijven server-side naar Sanity)

## Lokaal ontwikkelen

```bash
# eenmalig
cd frontend && npm install
cd ../studio && npm install

# site op http://localhost:3000
cd frontend && npm run dev

# Studio op http://localhost:3333
cd studio && npm run dev
```

Env-variabelen: zie `.env.example` (waarden staan in `frontend/.env.local` en `studio/.env`,
niet in git). Nieuwe machine? Draai de scripts hieronder.

## Beheerscripts (studio/scripts/)

Alle provisioning loopt via de Sanity CLI-login (`npx sanity login` — account:
administratie@badmintonborne.nl):

| Script | Doel |
| --- | --- |
| `python3 studio/scripts/setup-sanity.py` | Project/dataset/CORS/read-token aanmaken en env-bestanden schrijven (idempotent) |
| `cd studio && npm run seed` | Dataset vullen met de designcontent (slaat bestaande documenten over) |
| `python3 studio/scripts/create-write-token.py` | Editor-token voor het contactformulier/nieuwsbrief in env zetten |

## Deployment

- **Vercel-project** `badminton-borne` (account administratie@badmintonborne.nl), Root
  Directory `frontend`, gekoppeld aan deze GitHub-repo.
- Push naar `main` → productie ([badminton-borne.vercel.app](https://badminton-borne.vercel.app)
  en na de DNS-omzetting badmintonborne.nl). Elke andere branch → preview-URL.
- Env-vars staan in Vercel (production + preview): `NEXT_PUBLIC_SANITY_PROJECT_ID`,
  `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_API_READ_TOKEN`, `SANITY_API_WRITE_TOKEN`,
  `NEXT_PUBLIC_SITE_URL` (optioneel `LAPOSTA_API_KEY` + `LAPOSTA_LIST_ID` voor de nieuwsbrief).

## Accounts & eigendom

Alles van de club hangt aan **administratie@badmintonborne.nl**: het Sanity-project
(`atjj2izc`), het Vercel-account en deze GitHub-organisatie. Vrijwilligers committen vanaf hun
persoonlijke GitHub-account als member van de organisatie.

## Handig om te weten

- Prijzen, jaartallen en vergelijkingscijfers uit het design zijn **illustratief** — de
  voetnoten in de Studio markeren wat de club vóór publicatie moet checken.
- De aankondigingsbalk (Site-instellingen → Aankondigingsbalk) staat standaard uit.
- De oude Strapi-back-up (`strapi-backup-2026-07-06.tar.gz`) staat bewust alleen lokaal,
  niet in git (mogelijk persoonsgegevens).
