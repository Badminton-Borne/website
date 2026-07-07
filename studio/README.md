# Badminton Borne — Sanity Studio

Het CMS voor badmintonverenigingborne.nl. De homepage is opgebouwd uit
secties (page builder) die redacteuren kunnen toevoegen, herordenen en
bewerken.

## Eenmalige setup

Je moet ingelogd zijn bij Sanity (`npx sanity login`). Maak daarna project,
dataset, CORS en frontend-token in één keer aan:

```bash
python3 studio/scripts/setup-sanity.py   # vanuit de repo-root
cd studio
npm install
npm run seed        # laadt de homepage-content uit het design
npm run dev         # Studio op http://localhost:3333
```

## Structuur

- **Homepage** (singleton) — secties-array met alle homepage-blokken:
  hero, USP-kaarten, sport-highlight, aankondiging, doelgroepkaarten,
  CTA-band, trainingstijden, fotogalerij, reviews, FAQ.
- **Site-instellingen** (singleton) — menu, header-knoppen, footer,
  mobiele sticky CTA-balk, standaard SEO.
- **Trainingstijden / Reviews / Veelgestelde vragen** — losse documenten.
  Trainingstijden verschijnen automatisch (gesorteerd op volgorde) in het
  trainingstijden-blok; reviews en FAQ's kies je per blok.

## Scripts

| Commando | Doel |
| --- | --- |
| `npm run dev` | Studio lokaal draaien |
| `npm run seed` | Startcontent inladen (idempotent, overschrijft niets) |
| `npm run typegen` | Schema extraheren + TypeScript-types genereren naar `frontend/src/sanity/types.generated.ts` |
| `npm run deploy` | Studio hosten op *.sanity.studio |
