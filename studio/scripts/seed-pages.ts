/**
 * Maakt alle subpagina's aan die op de homepage (hero, nav, footer) worden
 * genoemd, gevuld met echte content van badmintonverenigingborne.nl.
 *
 * Draaien:  npm run seed:pages   (= sanity exec scripts/seed-pages.ts --with-user-token)
 * Tip: draai eerst `npm run seed` voor de basiscontent (trainingstijden,
 *      locaties, events, reviews, sponsors, team) — deze pagina's bouwen
 *      daarop voort.
 *
 * Veilig om opnieuw te draaien: pagina's krijgen vaste id's en worden met
 * createIfNotExists aangemaakt, dus bestaande (bewerkte) pagina's blijven
 * ongemoeid. De contributie-bedragen en het adres van De Hooiberg worden
 * bijgewerkt naar de actuele waarden van de live site.
 */
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-02-01'})

const key = () => Math.random().toString(36).slice(2, 12)
const cta = (label: string, href: string) => ({_type: 'cta', label, href})

// ---- Vaste gegevens (live site) ------------------------------------------
const EMAIL = 'info@badmintonborne.nl'
const MICROCOPY = '1 maand gratis · geen verplichtingen · maandelijks opzegbaar'

const FORM_LID_WORDEN =
  'https://docs.google.com/forms/u/1/d/e/1FAIpQLSd8vNEH5tUnLrqmEX0UO9AvYJG8LhbO7DKmcUfCrsQ_84riIQ/viewform?usp=dialog'
const FORM_EERSTE_BEZOEK =
  'https://docs.google.com/forms/d/e/1FAIpQLSeYHTkDkaqky3GMzVr3gJzCTkBrBvYtP2ktijQYLYLqzcqVUQ/viewform?usp=dialog'
const FORM_OPZEGGEN =
  'https://docs.google.com/forms/d/e/1FAIpQLSf9QeoUdTawZb8lKfqTmGfwXaQHF0QOlhyKIgyIFnbtAiPaaw/viewform?usp=dialog'

// ---- Sectie-bouwstenen ----------------------------------------------------
type Section = Record<string, unknown> & {_type: string}
const withKey = (s: Section): Section => ({...s, _key: key()})

const featureGrid = (
  eyebrow: string | undefined,
  heading: string,
  features: Array<[string, string]>,
): Section =>
  withKey({
    _type: 'featureGrid',
    ...(eyebrow ? {eyebrow} : {}),
    heading,
    features: features.map(([title, description]) => ({
      _type: 'feature',
      _key: key(),
      title,
      description,
    })),
  })

const sportHighlight = (
  eyebrow: string | undefined,
  heading: string,
  body: string,
  stats: Array<[string, string]>,
  footnote?: string,
): Section =>
  withKey({
    _type: 'sportHighlight',
    ...(eyebrow ? {eyebrow} : {}),
    heading,
    body,
    stats: stats.map(([value, label]) => ({_type: 'stat', _key: key(), value, label})),
    ...(footnote ? {footnote} : {}),
  })

const announcement = (
  tag: string | undefined,
  heading: string,
  body: string,
  link?: {label: string; href: string},
): Section =>
  withKey({
    _type: 'announcement',
    ...(tag ? {tag} : {}),
    heading,
    body,
    ...(link ? {link: cta(link.label, link.href)} : {}),
  })

const ctaBanner = (
  heading: string,
  label: string,
  href: string,
  theme: 'lime' | 'navy' = 'lime',
  enableGame = false,
  microcopy: string | null = MICROCOPY,
): Section =>
  withKey({
    _type: 'ctaBanner',
    heading,
    cta: cta(label, href),
    ...(microcopy ? {microcopy} : {}),
    theme,
    enableGame,
  })

const trainingTimes = (heading: string, link?: {label: string; href: string}): Section =>
  withKey({
    _type: 'trainingTimes',
    eyebrow: 'Speelschema',
    heading,
    ...(link ? {link: cta(link.label, link.href)} : {}),
  })

const comparison = (
  eyebrow: string,
  heading: string,
  columns: Array<[string, boolean]>,
  rows: Array<[string, string[]]>,
  footnote?: string,
  ctaLabel?: string,
  ctaLink?: string,
): Section =>
  withKey({
    _type: 'comparisonSection',
    eyebrow,
    heading,
    columns: columns.map(([label, highlighted]) => ({
      _type: 'comparisonColumn',
      _key: key(),
      label,
      highlighted,
    })),
    rows: rows.map(([label, values]) => ({
      _type: 'comparisonRow',
      _key: key(),
      label,
      values,
    })),
    ...(footnote ? {footnote} : {}),
    ...(ctaLabel ? {ctaLabel} : {}),
    ...(ctaLink ? {ctaLink} : {}),
  })

const audienceSegments = (
  eyebrow: string,
  heading: string,
  segments: Array<{title: string; description: string; label: string; href: string}>,
): Section =>
  withKey({
    _type: 'audienceSegments',
    eyebrow,
    heading,
    segments: segments.map((s) => ({
      _type: 'segment',
      _key: key(),
      title: s.title,
      description: s.description,
      link: cta(s.label, s.href),
    })),
  })

const faqList = (heading: string, itemIds: string[]): Section =>
  withKey({
    _type: 'faqList',
    heading,
    items: itemIds.map((id) => ({_type: 'reference', _key: key(), _ref: id})),
  })

// ---- Helpers --------------------------------------------------------------
// Deze pagina's + FAQ's worden door dit script beheerd (vaste id's, script =
// bron). createOrReplace, zodat een re-run de content synchroniseert. Let op:
// handmatige Studio-bewerkingen aan deze `page-*`/`faq-*`-documenten worden bij
// een re-run overschreven. De basisseed-pagina's (contact/over-ons/lidmaatschap)
// hebben andere id's en blijven ongemoeid.
async function page(id: string, doc: Record<string, unknown>) {
  await client.createOrReplace({_id: id, _type: 'page', ...doc})
}

async function faq(id: string, question: string, answer: string): Promise<string> {
  await client.createOrReplace({_id: id, _type: 'faqItem', question, answer})
  return id
}

async function patchIfExists(id: string, fields: Record<string, unknown>): Promise<boolean> {
  const exists: number = await client.fetch('count(*[_id == $id])', {id})
  if (!exists) return false
  await client.patch(id).set(fields).commit()
  return true
}

/**
 * Zet een sectie met een vaste _key op een bestaande pagina (bv. de basisseed-
 * pagina "Over ons"): bestaat de sectie al (zelfde _key), dan wordt-ie
 * vervangen; anders ingevoegd. Idempotent, en de rest van de pagina blijft.
 */
async function upsertSection(
  pageId: string,
  marker: string,
  section: Section,
  position: 'before' | 'after',
  anchor: string,
) {
  const keys: string[] | null = await client.fetch(`*[_id == $id][0].sections[]._key`, {id: pageId})
  if (keys?.includes(marker)) {
    await client.patch(pageId).set({[`sections[_key=="${marker}"]`]: section}).commit()
  } else {
    await client.patch(pageId).insert(position, anchor, [section]).commit()
  }
}

// De kern-USP's van de club — gedeeld op de locatie-landingspagina's en op
// "Over ons". (De unieke tekst per pagina staat in intro/sportHighlight/FAQ.)
const USP_FEATURES: Array<[string, string]> = [
  ['Splinternieuwe zaal', 'We spelen in de nieuwe sporthal ’t Wooldrik in Borne: mooie vloer, goede verlichting en ruimte zat.'],
  ['Gezellige club', 'Fanatiek op de baan, gezellig eromheen. Bij ons hoor je er meteen bij.'],
  ['Voor iedereen plek', 'Van 8 tot 80 en van eerste keer tot ervaren speler — iedereen speelt op zijn eigen niveau mee.'],
  ['Recreatie tot competitie', 'Jeugd én volwassenen, recreatief vrij spelen of wedstrijden namens Borne. Alles kan.'],
  ['Begin wanneer je wilt', 'Geen seizoen en geen instapschema: elke week kun je instappen en meteen meespelen.'],
  ['Lage contributie', 'We zijn een vereniging, geen commerciële hal. Daarom is de contributie laag — en je eerste maand is gratis.'],
]

// Lokale SEO-landingspagina's. Per plaats unieke intro, sportHighlight, FAQ's
// en meta — de gedeelde USP-grid + trainingstijden vormen de minderheid van de
// content, dus geen duplicate content. Afstanden bewust richtinggevend
// (geen exacte km's) omdat die niet zijn geverifieerd.
type Place = {
  slug: string
  name: string
  intro: string
  hlHeading: string
  hlBody: string
  stat: [string, string]
  ctaHeading: string
  desc: string
  faqs: Array<[string, string, string]>
}
const PLACES: Place[] = [
  {
    slug: 'borne',
    name: 'Borne',
    intro:
      'Badminton in Borne? Dan zit je bij ons goed. Badminton Borne is dé badmintonvereniging van Borne, met een nieuwe zaal in sportpark ’t Wooldrik.',
    hlHeading: 'Dé badmintonclub van Borne',
    hlBody:
      'Wij zijn geworteld in Borne en spelen in de splinternieuwe sporthal ’t Wooldrik, midden in het dorp. Van de allereerste shuttle tot de competitie: bij ons vindt iedere Bornenaar een plek. Kom gewoon een keer langs — beginnen kan elke week, want we kennen geen seizoen of instapschema.',
    stat: ['dé club', 'van Borne'],
    ctaHeading: 'Kom badmintonnen in Borne.',
    desc: 'Badminton in Borne? Badminton Borne is dé club van het dorp: nieuwe zaal in ’t Wooldrik, gezellig, voor jeugd én volwassenen. Elke week instappen, eerste maand gratis.',
    faqs: [
      ['faq-loc-borne-1', 'Waar kun je badmintonnen in Borne?', 'Bij Badminton Borne, in de nieuwe sporthal ’t Wooldrik (’t Wooldrik 1) en in De Hooiberg. Bekijk de trainingstijden en kom een keer meespelen.'],
      ['faq-loc-borne-2', 'Voor wie is de club?', 'Voor iedereen uit Borne en omgeving: jeugd en volwassenen, recreatief of competitie, beginner of gevorderd. Je speelt op je eigen niveau mee.'],
      ['faq-loc-borne-3', 'Kan ik zomaar beginnen?', 'Ja. We hebben geen seizoen of instapschema — elke week kun je instappen. Je eerste maand is gratis en een racket lenen we je.'],
    ],
  },
  {
    slug: 'zenderen',
    name: 'Zenderen',
    intro:
      'Woon je in Zenderen en wil je badmintonnen? Badminton Borne ligt om de hoek — Zenderen hoort bij de gemeente Borne en je bent zo in onze nieuwe zaal.',
    hlHeading: 'Vanuit Zenderen zo op de baan',
    hlBody:
      'Zenderen ligt pal boven Borne, dus je bent in een paar minuten bij sportpark ’t Wooldrik. Onze vereniging is gezellig en er is plek voor elk niveau, van de jeugd tot de fanatieke competitiespeler. Instappen kan elke week — geen wachtlijst, geen seizoen.',
    stat: ['om de hoek', 'vanuit Zenderen'],
    ctaHeading: 'Badminton, ook vanuit Zenderen.',
    desc: 'Badminton vanuit Zenderen? Badminton Borne ligt om de hoek: nieuwe zaal, gezellige vereniging, recreatie tot competitie. Begin elke week, eerste maand gratis.',
    faqs: [
      ['faq-loc-zenderen-1', 'Kun je vanuit Zenderen bij Badminton Borne spelen?', 'Zeker. Zenderen ligt vlak boven Borne, dus je bent zo bij de hal aan ’t Wooldrik. Veel leden komen uit de dorpen rond Borne.'],
      ['faq-loc-zenderen-2', 'Is er badminton in Zenderen zelf?', 'In Zenderen zelf is geen badmintonvereniging, maar Badminton Borne ligt om de hoek en biedt alles: jeugd, volwassenen, recreatie en competitie.'],
      ['faq-loc-zenderen-3', 'Wanneer kan ik beginnen?', 'Wanneer je wilt. We kennen geen seizoen of instapschema — kom een willekeurige week langs, de eerste maand is gratis.'],
    ],
  },
  {
    slug: 'hertme',
    name: 'Hertme',
    intro:
      'Badminton in Hertme? Kom bij Badminton Borne. Hertme hoort bij de gemeente Borne en ligt op een steenworp van onze nieuwe sporthal.',
    hlHeading: 'Badminton om de hoek van Hertme',
    hlBody:
      'Hertme is een van de dorpen van Borne en ligt vlakbij sportpark ’t Wooldrik. Bij ons is de sfeer gemoedelijk en speelt iedereen mee — jong en oud, recreatief en competitie. Je hoeft niet te wachten op een nieuw seizoen: elke week kun je instappen.',
    stat: ['vlakbij', 'vanuit Hertme'],
    ctaHeading: 'Badminton, ook vanuit Hertme.',
    desc: 'Badminton vanuit Hertme? Bij Badminton Borne speel je om de hoek in een nieuwe zaal — jeugd en volwassenen, recreatie tot competitie, met een lage contributie.',
    faqs: [
      ['faq-loc-hertme-1', 'Kun je vanuit Hertme badmintonnen bij Borne?', 'Ja. Hertme ligt om de hoek bij Borne, dus onze hal aan ’t Wooldrik is zo bereikt. Iedereen uit Hertme is welkom.'],
      ['faq-loc-hertme-2', 'Wat kost het?', 'Omdat we een vereniging zijn, is de contributie laag. Je eerste maand is bovendien gratis, zodat je rustig kunt kijken of het bevalt.'],
      ['faq-loc-hertme-3', 'Voor welke leeftijd?', 'Van ongeveer 8 jaar tot 80+. Jeugd en volwassenen spelen bij ons allebei, op elk niveau.'],
    ],
  },
  {
    slug: 'saasveld',
    name: 'Saasveld',
    intro:
      'Woon je in Saasveld en zoek je een badmintonclub? Badminton Borne ligt vlakbij, net over de gemeentegrens, met een nieuwe zaal en een gezellige vereniging.',
    hlHeading: 'Vanuit Saasveld naar Borne',
    hlBody:
      'Saasveld ligt op een prettige afstand van Borne — goed te doen voor een vaste badmintonavond. Onze club heeft plek voor iedereen: recreatief of competitie, jeugd of volwassenen. En je begint gewoon wanneer het jou uitkomt, zonder seizoen of instapschema.',
    stat: ['vlakbij', 'vanuit Saasveld'],
    ctaHeading: 'Badminton, ook vanuit Saasveld.',
    desc: 'Badminton vanuit Saasveld? Badminton Borne ligt vlakbij: nieuwe zaal, gezellige club, elk niveau. Instappen kan elke week, de eerste maand is gratis.',
    faqs: [
      ['faq-loc-saasveld-1', 'Kun je vanuit Saasveld bij Badminton Borne spelen?', 'Zeker. Saasveld ligt vlakbij Borne, goed te doen voor een avondje badminton. Je bent van harte welkom.'],
      ['faq-loc-saasveld-2', 'Wat biedt de club?', 'Alles van recreatief vrij spelen tot competitie, voor jeugd én volwassenen, in de nieuwe sporthal ’t Wooldrik in Borne.'],
      ['faq-loc-saasveld-3', 'Wanneer kan ik instappen?', 'Elke week. We hebben geen seizoen of instapschema, dus kom gerust een keer meespelen — de eerste maand is gratis.'],
    ],
  },
  {
    slug: 'hengelo',
    name: 'Hengelo',
    intro:
      'Badminton in Hengelo? Veel Hengeloërs spelen al bij Badminton Borne. We zitten vlak naast Hengelo en je staat in een paar minuten in onze nieuwe zaal.',
    hlHeading: 'Al veel leden uit Hengelo',
    hlBody:
      'Borne grenst aan Hengelo, dus je bent zo bij sportpark ’t Wooldrik — en juist daarom komen veel van onze leden uit Hengelo. Onze vereniging is gezellig, betaalbaar en heeft plek voor elk niveau, van jeugd tot competitie. Instappen kan elke week, zonder wachtlijst.',
    stat: ['veel leden', 'uit Hengelo'],
    ctaHeading: 'Badminton vanuit Hengelo? Kom langs.',
    desc: 'Badminton vanuit Hengelo? Veel leden komen uit Hengelo. Badminton Borne: nieuwe zaal vlakbij, gezellig, jeugd tot competitie, lage contributie. Eerste maand gratis.',
    faqs: [
      ['faq-loc-hengelo-1', 'Kun je vanuit Hengelo bij Badminton Borne spelen?', 'Absoluut. We zitten vlak naast Hengelo en veel van onze leden komen uit Hengelo. In een paar minuten sta je in de hal aan ’t Wooldrik.'],
      ['faq-loc-hengelo-2', 'Waarom naar Borne in plaats van in Hengelo?', 'Onze vereniging combineert een splinternieuwe zaal, een gezellige sfeer, plek voor elk niveau en een lage contributie. Kom een keer gratis meespelen en ervaar het verschil.'],
      ['faq-loc-hengelo-3', 'Kan ik het eerst proberen?', 'Ja. Je eerste maand is gratis, een racket lenen we je en beginnen kan elke week — geen seizoen of instapschema.'],
    ],
  },
  {
    slug: 'delden',
    name: 'Delden',
    intro:
      'Woon je in Delden en wil je badmintonnen? Vanuit Delden ben je zo in Borne, waar Badminton Borne in een nieuwe zaal speelt met plek voor iedereen.',
    hlHeading: 'Vanuit Delden naar de baan',
    hlBody:
      'Delden ligt op korte afstand van Borne — een mooie rit voor je vaste badmintonavond. Bij ons speelt iedereen mee: jeugd en volwassenen, recreatief en competitie. En omdat we een vereniging zijn, is de contributie laag. Beginnen kan bovendien elke week.',
    stat: ['korte rit', 'vanuit Delden'],
    ctaHeading: 'Badminton, ook vanuit Delden.',
    desc: 'Badminton vanuit Delden? Bij Badminton Borne speel je in een nieuwe zaal in Borne — voor iedereen, recreatie tot competitie, met een lage contributie.',
    faqs: [
      ['faq-loc-delden-1', 'Kun je vanuit Delden bij Badminton Borne spelen?', 'Ja. Delden ligt op korte afstand van Borne, dus onze hal aan ’t Wooldrik is goed te bereiken. Iedereen uit Delden is welkom.'],
      ['faq-loc-delden-2', 'Wat kost het lidmaatschap?', 'De contributie is laag omdat we een vereniging zijn. De eerste maand is gratis, zodat je vrijblijvend kunt proberen.'],
      ['faq-loc-delden-3', 'Voor welk niveau?', 'Voor elk niveau. Van je allereerste shuttle tot competitie namens Borne — we delen je in op wat bij je past.'],
    ],
  },
  {
    slug: 'azelo',
    name: 'Azelo',
    intro:
      'Badminton in Azelo? Badminton Borne ligt op een steenworp afstand. Azelo hoort bij de gemeente Borne en onze nieuwe zaal is zo bereikt.',
    hlHeading: 'Badminton op een steenworp van Azelo',
    hlBody:
      'Azelo ligt vlakbij Borne, dus je bent snel bij sportpark ’t Wooldrik. Onze club is gezellig en heeft plek voor iedereen — jeugd en volwassenen, recreatief of fanatiek. Je stapt in wanneer je wilt, want we kennen geen seizoen of instapschema.',
    stat: ['steenworp', 'vanuit Azelo'],
    ctaHeading: 'Badminton, ook vanuit Azelo.',
    desc: 'Badminton vanuit Azelo? Badminton Borne ligt op een steenworp: nieuwe zaal, gezellige vereniging, elk niveau. Elke week instappen, eerste maand gratis.',
    faqs: [
      ['faq-loc-azelo-1', 'Kun je vanuit Azelo bij Badminton Borne spelen?', 'Zeker. Azelo ligt op een steenworp van Borne, dus onze hal aan ’t Wooldrik is zo bereikt. Je bent van harte welkom.'],
      ['faq-loc-azelo-2', 'Is er badminton in Azelo zelf?', 'In Azelo zelf niet, maar Badminton Borne ligt vlakbij en biedt alles: jeugd, volwassenen, recreatie en competitie in een nieuwe zaal.'],
      ['faq-loc-azelo-3', 'Wanneer kan ik beginnen?', 'Wanneer je wilt — elke week kun je instappen. Geen seizoen, geen instapschema, en de eerste maand is gratis.'],
    ],
  },
]

async function run() {
  // ---- Contributie: twee pakketten (Jeugd + Senioren) --------------------
  // Competitie is géén apart pakket — de toeslag varieert (€ 50 p.p. jeugd /
  // € 260 per team) en staat in de features + voetnoot. Bestaande pakketten
  // worden NIET overschreven: de club beheert ze in de Studio.
  let pkgs: Array<{_id: string; title: string}> = await client.fetch(
    `*[_type == "membershipPackage" && !(_id in path("drafts.**"))] | order(sortOrder asc){_id, title}`,
  )
  if (pkgs.length === 0) {
    await client.createIfNotExists({
      _id: 'pkg-jeugd',
      _type: 'membershipPackage',
      title: 'Jeugd',
      description: 'T/m 18 jaar. Training met leeftijdsgenoten.',
      price: 18.5,
      priceSuffix: 'per maand',
      features: [
        'Wekelijkse jeugdtraining',
        'Racket lenen kan altijd',
        'Shuttles inbegrepen',
        'Competitie mogelijk (toeslag € 50 p.p. per seizoen)',
      ],
      highlighted: false,
      ctaLabel: 'Aanmelden',
      ctaHref: FORM_LID_WORDEN,
      sortOrder: 0,
    })
    await client.createIfNotExists({
      _id: 'pkg-senioren',
      _type: 'membershipPackage',
      title: 'Senioren',
      description: 'Volwassenen. Vrij spelen én training op vaste avonden.',
      price: 26,
      priceSuffix: 'per maand',
      features: [
        'Elke week vrij spelen én training',
        'Shuttles inbegrepen',
        'Gezellige derde helft',
        'Competitie mogelijk (toeslag per team)',
      ],
      highlighted: true,
      highlightLabel: 'Meest gekozen',
      ctaLabel: 'Aanmelden',
      ctaHref: FORM_LID_WORDEN,
      sortOrder: 1,
    })
    pkgs = await client.fetch(
      `*[_type == "membershipPackage" && !(_id in path("drafts.**"))] | order(sortOrder asc){_id, title}`,
    )
    console.log(`✓ lidmaatschapspakketten aangemaakt (${pkgs.length})`)
  } else {
    console.log(`− lidmaatschapspakketten bestaan al (${pkgs.length}) — club beheert ze in de Studio`)
  }
  const packageRefs = pkgs.map((p) => ({_type: 'reference', _key: key(), _ref: p._id}))
  const PRICING_INTRO =
    'Contributie per maand, plus eenmalig inschrijfgeld. Je eerste maand is altijd gratis — daarna maandelijks opzegbaar.'
  const PRICING_FOOTNOTE =
    'Eenmalig inschrijfgeld: € 10 (jeugd) / € 15 (volwassenen). Competitie spelen kan bij beide pakketten — de toeslag varieert: € 50 p.p. per seizoen (jeugd) of € 260 per team (senioren). Eerste maand gratis.'

  // Bestaande /lidmaatschap-pagina: intro + voetnoot van de prijstabel
  // gelijktrekken met de echte tarieven (illustratieve tekst weghalen).
  const lidmaatschap: {_id: string; pkKey?: string} | null = await client.fetch(
    `*[_type == "page" && slug.current == "lidmaatschap"][0]{_id, "pkKey": sections[_type == "pricingSection"][0]._key}`,
  )
  if (lidmaatschap?._id && lidmaatschap.pkKey) {
    await client
      .patch(lidmaatschap._id)
      .set({
        [`sections[_key=="${lidmaatschap.pkKey}"].intro`]: PRICING_INTRO,
        [`sections[_key=="${lidmaatschap.pkKey}"].footnote`]: PRICING_FOOTNOTE,
      })
      .commit()
    console.log('✓ /lidmaatschap: prijstabel-intro en voetnoot geactualiseerd')
  }

  // ---- Adres De Hooiberg corrigeren (Dorsvloer 25) + postcodes + volgorde --
  await patchIfExists('locatie-hooiberg', {street: 'Dorsvloer 25', city: '7623 DX Borne', sortOrder: 1})
  await patchIfExists('locatie-wooldrik', {city: '7621 AH Borne', sortOrder: 0})
  console.log('✓ locatie-adressen en volgorde bijgewerkt (indien aanwezig)')

  // ---- Reviews ophalen voor testimonials --------------------------------
  const reviewIds: string[] = await client.fetch(
    `*[_type == "review" && !(_id in path("drafts.**"))][0..2]._id`,
  )

  // =========================================================================
  //  BADMINTON (de sport)
  // =========================================================================
  await page('page-badminton', {
    title: 'Badminton',
    slug: {_type: 'slug', current: 'badminton'},
    intro:
      'De snelste racketsport ter wereld — explosief, tactisch en verrassend makkelijk om mee te beginnen. Dit is badminton bij Borne.',
    sections: [
      sportHighlight(
        'De sport',
        'Sneller dan elke andere racketsport',
        'Vergeet het beeld van de campingsport. Een shuttle vertrekt bij een smash harder dan een tennisbal of padelbal, en een rally is een aaneenschakeling van explosieve sprintjes, snelle handen en scherpe tactiek. Wie één keer op tempo speelt, is verkocht.',
        [
          ['±493', 'km/u shuttlesnelheid*'],
          ['#1', 'snelste racketsport*'],
          ['1992', 'olympisch sinds'],
        ],
        '*Officieel gemeten smash-wereldrecord. Cijfers ter illustratie.',
      ),
      featureGrid(undefined, 'Waarom badminton', [
        ['Explosief én tactisch', 'Korte sprints, snelle reflexen en slimme plaatsing — je hoofd en benen werken samen.'],
        ['Het hele jaar binnen', 'Geen last van regen of wind. In de sporthal speel je altijd door.'],
        ['Zo mee te doen', 'Racket lenen kan, shuttles liggen klaar. Je speelt de eerste avond meteen mee.'],
        ['Voor elk niveau', 'Van 8 tot 80, van eerste keer tot competitie — je stapt in op jouw niveau.'],
      ]),
      comparison(
        'Badminton vs andere sporten',
        'Hoe verhoudt badminton zich?',
        [
          ['Badminton', true],
          ['Tennis', false],
          ['Padel', false],
          ['Squash', false],
        ],
        [
          ['Topsnelheid', ['±493 km/u', '±263 km/u', '±180 km/u', '±280 km/u']],
          ['Hele jaar binnen', ['✓', 'Seizoensgebonden', 'Vaak buiten', '✓']],
          ['Racket lenen kan', ['✓', '—', '—', '—']],
          ['Direct meespelen', ['✓ Eerste avond', 'Lessen nodig', 'Snel te leren', 'Pittig te leren']],
        ],
        '*Snelheden zijn records/richtwaarden ter illustratie.',
        'Vergelijk alle sporten',
        '/badminton-vs-andere-sporten',
      ),
      ctaBanner('Kom badminton een keer proberen.', 'Plan je eerste bezoek', '/probeer-gratis', 'lime'),
    ],
    seo: {
      title: 'Badminton — de snelste racketsport | Borne',
      description:
        'Wat maakt badminton zo bijzonder? Snel, tactisch en voor alle leeftijden. Ontdek de sport bij Badminton Borne en kom gratis proberen.',
    },
  })

  // =========================================================================
  //  TRAININGEN
  // =========================================================================
  const faqTr = [
    await faq(
      'faq-tr-meenemen',
      'Wat moet ik meenemen?',
      'Sportkleding en zaalschoenen met een lichte zool (geen zwarte strepen op de vloer). Een racket kun je de eerste weken gratis van ons lenen en shuttles liggen altijd klaar.',
    ),
    await faq(
      'faq-tr-langskomen',
      'Kan ik zomaar langskomen?',
      'Graag! Laat vooraf even weten dat je komt via het formulier of info@badmintonborne.nl, dan staat er iemand voor je klaar en speel je meteen mee.',
    ),
    await faq(
      'faq-tr-zomer',
      'Gelden de tijden ook in de zomer?',
      'In de zomervakantie spelen we op afwijkende tijden en meestal in De Hooiberg. Vanaf eind augustus draait het reguliere rooster in de nieuwe hal ’t Wooldrik. Check de agenda of vraag het even na.',
    ),
    await faq(
      'faq-tr-groep',
      'Heb ik een eigen groep nodig?',
      'Nee. Je komt gewoon alleen en we delen je in op niveau. Je speelt meteen wisselende partijen mee.',
    ),
  ]
  await page('page-trainingen', {
    title: 'Trainingen',
    slug: {_type: 'slug', current: 'trainingen'},
    intro:
      'Waar en wanneer we spelen. Kom gerust een keer meekijken of meespelen — je eerste maand is gratis.',
    sections: [
      trainingTimes('Wanneer we spelen', {label: 'Plan je eerste bezoek', href: '/probeer-gratis'}),
      featureGrid(undefined, 'Goed om te weten', [
        ['Zaalschoenen mee', 'Schone schoenen met een lichte zool — zwarte zolen laten strepen na op de vloer.'],
        ['Racket lenen kan', 'Nog geen racket? Geen probleem, die liggen bij ons klaar. Shuttles ook.'],
        ['Zomerrooster', 'In de zomervakantie spelen we op afwijkende tijden in De Hooiberg.'],
        ['Kom gewoon langs', 'Meld je even aan, dan staat er iemand klaar en speel je meteen mee.'],
      ]),
      faqList('Veelgestelde vragen over trainen', faqTr),
      ctaBanner('Klaar om te spelen?', 'Plan je eerste bezoek', '/probeer-gratis', 'lime'),
    ],
    seo: {
      title: 'Trainingstijden & locaties | Badminton Borne',
      description:
        'Bekijk wanneer en waar Badminton Borne traint en vrij speelt in ’t Wooldrik en De Hooiberg. Kom een keer gratis meespelen.',
    },
  })

  // =========================================================================
  //  JEUGD  (focus: waarom badminton goed is voor een kind)
  // =========================================================================
  const faqJeugd = [
    await faq(
      'faq-jeugd-leeftijd',
      'Vanaf welke leeftijd kan mijn kind meedoen?',
      'De jeugdtraining is vanaf ongeveer 8 jaar. Twijfel je of het al past? Kom een keer vrijblijvend meekijken en meespelen.',
    ),
    await faq(
      'faq-jeugd-racket',
      'Heeft mijn kind een eigen racket nodig?',
      'Nee. De eerste weken leen je een racket van ons en shuttles liggen klaar. Bevalt het, dan help we je graag met de aanschaf van een eigen racket.',
    ),
    await faq(
      'faq-jeugd-eerste-keer',
      'Hoe gaat de eerste keer?',
      'Je kind speelt meteen mee met leeftijdsgenoten. De trainers houden een oogje in het zeil en zorgen dat iedereen het leuk heeft en op niveau meespeelt.',
    ),
    await faq(
      'faq-jeugd-kosten',
      'Wat kost het voor de jeugd?',
      'De jeugdcontributie is € 18,50 per maand, plus eenmalig € 10 inschrijfgeld. De eerste maand is gratis, zodat je rustig kunt kijken of het bevalt.',
    ),
  ]
  await page('page-jeugd', {
    title: 'Jeugd',
    slug: {_type: 'slug', current: 'jeugd'},
    intro:
      'Badminton is een van de leukste én gezondste sporten voor kinderen. Snel, sociaal en overal te spelen — van de sporthal tot de camping.',
    sections: [
      featureGrid('Waarom badminton', 'Zó goed is badminton voor je kind', [
        ['Scherpe reflexen', 'De shuttle vliegt hard en onvoorspelbaar. Kinderen trainen zo als vanzelf hun reactievermogen.'],
        ['Hand-oogcoördinatie', 'Kijken, mikken en bewegen tegelijk — badminton ontwikkelt de motoriek spelenderwijs.'],
        ['Fit en energiek', 'Rennen, springen en slaan: een uur badminton is topsport, verpakt als spel.'],
        ['Nieuwe vriendjes', 'Bij Borne train je met leeftijdsgenoten en hoor je meteen bij de groep.'],
        ['Vooral heel veel plezier', 'Wie lol heeft, blijft bewegen. Plezier staat bij onze jeugd altijd voorop.'],
        ['Overal te spelen', 'Op de camping of in de tuin pakt iedereen zo een racket mee — badminton speel je je hele leven.'],
      ]),
      sportHighlight(
        'Olympische sport',
        'Van de camping tot de Spelen',
        'Iedereen kan op vakantie een balletje slaan, maar bovenin is badminton een olympische topsport — sinds 1992. Dat is precies wat het zo leuk maakt: laagdrempelig om te beginnen, met een plafond dat zo hoog ligt als je zelf wilt.',
        [
          ['1992', 'olympisch sinds'],
          ['vanaf 8', 'jaar welkom'],
        ],
      ),
      trainingTimes('Jeugdtraining', {label: 'Plan een eerste bezoek', href: '/probeer-gratis'}),
      faqList('Veelgestelde vragen van ouders', faqJeugd),
      ctaBanner(
        'Sporten even te duur?\nHet Jeugdfonds betaalt mee.',
        'Lees over het Jeugdfonds Sport & Cultuur',
        '/jeugdfonds-sport-en-cultuur',
        'navy',
        false,
        null,
      ),
      ctaBanner('Laat je kind een keer meespelen.', 'Plan een gratis eerste bezoek', '/probeer-gratis', 'lime', true),
    ],
    seo: {
      title: 'Jeugdbadminton in Borne — goed voor je kind',
      description:
        'Badminton ontwikkelt reactievermogen, coördinatie en sociale contacten — en is vooral heel leuk. Kom met je kind gratis meespelen in Borne.',
    },
  })

  // =========================================================================
  //  VOLWASSENEN
  // =========================================================================
  const volwassenenSections: Section[] = [
    featureGrid('Voor volwassenen', 'Fanatiek als je wilt, gezellig als je wilt', [
      ['Vrij spelen', 'Op vaste avonden vrij inspelen met wisselende tegenstanders — kom wanneer het jou uitkomt.'],
      ['Training', 'Wil je beter worden? Sluit aan bij de training en scherp je techniek en tactiek aan.'],
      ['Competitie', 'Speel wedstrijden namens Borne in de regionale bondscompetitie.'],
      ['Derde helft', 'Na de rally is er altijd tijd voor een praatje. Bij ons is de sport ook sociaal.'],
    ]),
    sportHighlight(
      'Fit blijven',
      'Een uur badminton ≈ 450 kcal*',
      'Even helemaal weg van je scherm en je hoofd leeg spelen. Badminton is een uitstekende conditietraining: je bent constant in beweging zonder dat het voelt als sporten. En je speelt het je hele leven door.',
      [
        ['±450', 'kcal per uur*'],
        ['alle', 'niveaus welkom'],
      ],
      '*Richtwaarde ter illustratie; afhankelijk van intensiteit.',
    ),
    trainingTimes('Wanneer we spelen'),
  ]
  if (reviewIds.length) {
    volwassenenSections.push(
      withKey({
        _type: 'testimonials',
        eyebrow: 'Google reviews',
        heading: 'Wat leden zeggen',
        reviews: reviewIds.map((id) => ({_type: 'reference', _key: key(), _ref: id})),
      }),
    )
  }
  volwassenenSections.push(
    ctaBanner('Kom vrijblijvend een keer meespelen.', 'Plan je eerste bezoek', '/probeer-gratis', 'lime'),
  )
  await page('page-volwassenen', {
    title: 'Volwassenen',
    slug: {_type: 'slug', current: 'volwassenen'},
    intro:
      'Vrij spelen, trainen of competitie — voor volwassenen van alle niveaus. Fanatiek als je wilt, gezellig als je wilt.',
    sections: volwassenenSections,
    seo: {
      title: 'Badminton voor volwassenen in Borne',
      description:
        'Recreatief vrij spelen, training of competitie voor volwassenen van elk niveau. Eerste maand gratis bij Badminton Borne.',
    },
  })

  // =========================================================================
  //  COMPETITIE
  // =========================================================================
  const faqComp = [
    await faq(
      'faq-comp-aanmelden',
      'Hoe kan ik competitie gaan spelen?',
      'Geef het aan bij je trainer of via info@badmintonborne.nl. We kijken samen in welk team en op welk niveau je het beste past.',
    ),
    await faq(
      'faq-comp-kosten',
      'Wat kost competitie?',
      'Competitie komt bovenop je gewone contributie. De competitietoeslag is per seizoen € 50 per persoon (jeugd) of € 260 per team (senioren).',
    ),
    await faq(
      'faq-comp-niveau',
      'Moet ik al goed zijn?',
      'Er is competitie op verschillende niveaus. Als je de basis beheerst en het leuk vindt om wedstrijden te spelen, is er vrijwel altijd een team dat past.',
    ),
  ]
  await page('page-competitie', {
    title: 'Competitie',
    slug: {_type: 'slug', current: 'competitie'},
    intro:
      'Speel wedstrijden namens Borne in de regionale bondscompetitie. Fanatiek, maar altijd met de club voorop.',
    sections: [
      sportHighlight(
        'Wedstrijden spelen',
        'Met je team de baan op',
        'Bij Badmintonvereniging Borne kun je — als je dat wilt — competitie spelen. Dat betekent dat je met een team wedstrijden speelt tegen andere clubs uit de regio, onder de vlag van Badminton Nederland. We komen met meerdere teams uit en spelen regelmatig mee om de titel.',
        [
          ['Regio', 'bondscompetitie (NL)'],
          ['Teams', 'jeugd én senioren'],
        ],
      ),
      featureGrid('Onze teams', 'Wie er namens Borne speelt', [
        ['Team Volwassenen', 'Vincent, Serge, Sem en Michel spelen namens Borne in de regionale bondscompetitie.'],
        ['Team Jeugd', 'Ook onze jeugd komt uit in de competitie. De namen van het jeugdteam vullen we binnenkort aan.'],
      ]),
      featureGrid(undefined, 'Zo werkt competitie', [
        ['In teams', 'Je speelt met een vast team thuis- en uitwedstrijden volgens een programma.'],
        ['Regiocompetitie', 'Georganiseerd door Badminton Nederland (voorheen NBB), dicht bij huis.'],
        ['Jeugd én senioren', 'Competitie op verschillende niveaus — er is bijna altijd een passend team.'],
        ['Extra scherp', 'Met de competitietraining blijf je op niveau en verbeter je gericht.'],
      ]),
      withKey({
        _type: 'agendaSection',
        eyebrow: 'Agenda',
        heading: 'Wedstrijden & activiteiten',
        link: cta('Hele agenda', '/agenda'),
      }),
      faqList('Veelgestelde vragen over competitie', faqComp),
      ctaBanner(
        'Vragen over de competitie?\nMail onze competitieleider.',
        'competitie@badmintonborne.nl',
        'mailto:competitie@badmintonborne.nl',
        'navy',
        false,
        null,
      ),
    ],
    seo: {
      title: 'Competitie bij Badminton Borne',
      description:
        'Speel met een team wedstrijden in de regionale bondscompetitie van Badminton Nederland. Jeugd en senioren — meld je aan bij Borne.',
    },
  })

  // =========================================================================
  //  LID WORDEN
  // =========================================================================
  const faqLid = [
    await faq(
      'faq-lid-proberen',
      'Kan ik eerst gratis proberen?',
      'Ja. Je eerste maand is helemaal gratis en vrijblijvend. Bevalt het, dan krijg je van de trainers het inschrijfformulier.',
    ),
    await faq(
      'faq-lid-racket',
      'Heb ik een racket nodig?',
      'Nog geen racket? Geen probleem, die hebben wij klaarliggen. Shuttles zijn er altijd.',
    ),
    await faq(
      'faq-lid-opzeggen',
      'Kan ik makkelijk opzeggen?',
      'Zeker. Je bent maandelijks opzegbaar met een opzegtermijn van één maand. Meer daarover lees je op de pagina Lidmaatschap opzeggen.',
    ),
  ]
  await page('page-lid-worden', {
    title: 'Lid worden',
    slug: {_type: 'slug', current: 'lid-worden'},
    intro:
      'Eerste maand gratis proberen, daarna pas beslissen. Zo word je lid van Badminton Borne.',
    sections: [
      featureGrid(undefined, 'In drie stappen lid', [
        ['1. Plan je eerste bezoek', 'Laat weten dat je komt en speel vrijblijvend een avond mee.'],
        ['2. Een maand gratis meespelen', 'Racket lenen kan, shuttles liggen klaar. Kijk rustig of het bij je past.'],
        ['3. Vul het aanmeldformulier in', 'Wordt het wat? Dan schrijf je je in via het formulier en ben je lid.'],
      ]),
      withKey({
        _type: 'pricingSection',
        eyebrow: 'Contributie',
        heading: 'Wat kost het lidmaatschap?',
        intro: PRICING_INTRO,
        packages: packageRefs,
        footnote: PRICING_FOOTNOTE,
      }),
      ctaBanner('Klaar om lid te worden?', 'Naar het aanmeldformulier', FORM_LID_WORDEN, 'lime'),
      faqList('Veelgestelde vragen', faqLid),
    ],
    seo: {
      title: 'Lid worden van Badminton Borne',
      description:
        'Word lid van Badminton Borne: eerste maand gratis, daarna vanaf € 18,50 per maand. Racket lenen kan. Meld je aan via het formulier.',
    },
  })

  // =========================================================================
  //  PLAN JE EERSTE BEZOEK (/probeer-gratis)
  // =========================================================================
  const faqProbeer = [
    await faq(
      'faq-probeer-meenemen',
      'Wat neem ik mee?',
      'Sportkleding en zaalschoenen met een lichte zool. Een racket lenen we je, dus verder hoef je niets mee te nemen.',
    ),
    await faq(
      'faq-probeer-kunnen',
      'Moet ik al kunnen badmintonnen?',
      'Nee hoor. We delen je in op jouw niveau en je speelt meteen mee. Nog nooit gespeeld? Ook prima — dan help we je op weg.',
    ),
    await faq(
      'faq-probeer-kosten',
      'Kost het iets?',
      'Nee. Je eerste maand is gratis en volledig vrijblijvend. Je zit nergens aan vast.',
    ),
  ]
  await page('page-probeer-gratis', {
    title: 'Plan je eerste bezoek',
    slug: {_type: 'slug', current: 'probeer-gratis'},
    intro:
      'Kom vrijblijvend een keer meespelen. Je eerste maand is gratis, een racket lenen we je zo — je hoeft alleen even te laten weten dat je komt.',
    sections: [
      featureGrid(undefined, 'Wat je kunt verwachten', [
        ['Je speelt meteen mee', 'We delen je in op niveau, zodat je vanaf de eerste rally lekker bezig bent.'],
        ['Racket van ons', 'Geen eigen racket nodig — lenen kan en shuttles liggen klaar.'],
        ['Geen verplichtingen', 'De eerste maand is gratis. Je zit nergens aan vast.'],
        ['Alle leeftijden', 'Van 8 tot 80 en van eerste keer tot competitie — iedereen is welkom.'],
      ]),
      trainingTimes('Wanneer je kunt langskomen'),
      ctaBanner('Plan je eerste bezoek.', 'Vul het formulier in', FORM_EERSTE_BEZOEK, 'lime', true),
      faqList('Veelgestelde vragen', faqProbeer),
    ],
    seo: {
      title: 'Plan je eerste bezoek | Badminton Borne',
      description:
        'Kom gratis en vrijblijvend meespelen bij Badminton Borne. Racket lenen kan. Plan je eerste bezoek via het formulier.',
    },
  })

  // =========================================================================
  //  NIEUWE HAL
  // =========================================================================
  await page('page-nieuwe-hal', {
    title: 'De nieuwe sporthal',
    slug: {_type: 'slug', current: 'nieuwe-hal'},
    intro:
      'Vanaf eind augustus spelen we in ’t Wooldrik — de gloednieuwe sporthal van Borne. Nieuwe vloer, nieuwe start.',
    sections: [
      announcement(
        'Nieuw',
        '’t Wooldrik Hal B — onze nieuwe thuisbasis',
        'Vanaf 27 augustus spelen we in de nieuwe sporthal aan ’t Wooldrik 1. Een frisse vloer, goede verlichting en eindelijk ruimte voor iedereen. Op onze eerste speelavonden ben je meer dan welkom om mee te doen.',
        {label: 'Bekijk de trainingstijden', href: '/trainingen'},
      ),
      featureGrid(undefined, 'Wat de nieuwe hal brengt', [
        ['Nieuwe vloer & verlichting', 'Prettig spelen op een sportvloer die is gemaakt voor snelle sporten als badminton.'],
        ['Meer ruimte', 'Meer banen betekent meer speeltijd en makkelijker een partij vinden.'],
        ['Air Badminton mogelijk', 'Dankzij de beachhal onderzoeken we of we ook badminton op zand kunnen aanbieden.'],
        ['Centraal in Borne', 'Goed bereikbaar aan ’t Wooldrik 1, 7621 AH Borne.'],
      ]),
      ctaBanner('Kom de nieuwe hal inspelen.', 'Plan je eerste bezoek', '/probeer-gratis', 'lime'),
    ],
    seo: {
      title: 'De nieuwe sporthal ’t Wooldrik | Badminton Borne',
      description:
        'Badminton Borne speelt vanaf eind augustus in de nieuwe sporthal ’t Wooldrik in Borne. Nieuwe vloer, meer ruimte en Air Badminton in beeld.',
    },
  })

  // =========================================================================
  //  AGENDA
  // =========================================================================
  await page('page-agenda', {
    title: 'Agenda',
    slug: {_type: 'slug', current: 'agenda'},
    intro:
      'Toernooien, competitieavonden en clubactiviteiten. Dit staat er binnenkort op de planning.',
    sections: [
      withKey({
        _type: 'agendaSection',
        eyebrow: 'Agenda',
        heading: 'Binnenkort bij Borne',
        link: cta('Al het nieuws', '/nieuws'),
      }),
      featureGrid(undefined, 'Elk jaar terug', [
        ['Glow in the dark badminton', 'Spelen in het donker met lichtgevende shuttles — een van onze populairste avonden.'],
        ['Vrienden- en familietoernooi', 'Neem je vrienden of familie mee: iedereen kan meedoen, van jong tot oud.'],
        ['Clubtoernooien', 'Gezellige onderlinge toernooien voor alle leden, op elk niveau.'],
        ['Start competitieseizoen', 'In september beginnen de eerste thuiswedstrijden — kom aanmoedigen.'],
      ]),
      ctaBanner('Ook een keer meedoen?', 'Plan je eerste bezoek', '/probeer-gratis', 'lime'),
    ],
    seo: {
      title: 'Agenda & activiteiten | Badminton Borne',
      description:
        'Bekijk de aankomende toernooien, competitieavonden en activiteiten van Badminton Borne, zoals Glow in the dark badminton en het vrienden- en familietoernooi.',
    },
  })

  // =========================================================================
  //  SPONSORING
  // =========================================================================
  await page('page-sponsoring', {
    title: 'Sponsoring',
    slug: {_type: 'slug', current: 'sponsoring'},
    intro:
      'Verbind je bedrijf aan de gezelligste badmintonclub van Borne. Van shirtsponsor tot bordreclame — we denken graag met je mee.',
    sections: [
      featureGrid(undefined, 'Sponsormogelijkheden', [
        ['Shirt- of kledingsponsor', 'Jouw logo op de shirts of clubkleding, zichtbaar bij elke training en wedstrijd.'],
        ['Bord- of halreclame', 'Een reclamebord op onze speellocatie, gezien door leden en bezoekers.'],
        ['Toernooi of activiteit', 'Verbind je naam aan een toernooi of clubactiviteit.'],
        ['Maatwerk in overleg', 'Iets anders in gedachten? We denken graag mee over een passende samenwerking.'],
      ]),
      withKey({
        _type: 'sponsorsSection',
        eyebrow: 'Onze sponsors',
        link: cta('Neem contact op', '/contact'),
        joinLabel: 'Jouw logo hier?',
        joinHref: '/contact',
      }),
      ctaBanner('Sponsor worden van Badminton Borne?', 'Mail ons', `mailto:${EMAIL}`, 'navy', false, null),
    ],
    seo: {
      title: 'Sponsoring | Badminton Borne',
      description:
        'Word sponsor van Badminton Borne: shirtsponsor, bordreclame of een toernooi. Verbind je bedrijf aan de club en neem contact op.',
    },
  })

  // =========================================================================
  //  VERTROUWENSPERSOON
  // =========================================================================
  await page('page-vertrouwenspersoon', {
    title: 'Vertrouwenspersoon',
    slug: {_type: 'slug', current: 'vertrouwenspersoon'},
    intro:
      'Zit je ergens mee? Bij onze vertrouwenspersoon kun je in vertrouwen terecht — voor alles wat je liever niet met de rest deelt.',
    sections: [
      featureGrid(undefined, 'Waarvoor je terecht kunt', [
        ['Ongewenst gedrag', 'Voel je je niet prettig behandeld op of naast de baan? Meld het.'],
        ['Pesten of intimidatie', 'Alles wat de sfeer onveilig maakt, mag je met de vertrouwenspersoon bespreken.'],
        ['Twijfels of zorgen', 'Ook als je alleen even je verhaal kwijt wilt of ergens over twijfelt.'],
        ['Een luisterend oor', 'De vertrouwenspersoon luistert, denkt mee en helpt je verder — vertrouwelijk.'],
      ]),
      featureGrid('Vertrouwelijk', 'Zo neem je contact op', [
        ['Onze vertrouwenspersoon', 'Bij Badminton Borne is Roelie onze vertrouwenspersoon. Wat je met haar bespreekt, blijft vertrouwelijk.'],
        ['Liever buiten de club?', 'Bel het Centrum Veilige Sport Nederland via 0900 - 202 55 90 voor onafhankelijk advies.'],
      ]),
      ctaBanner('Praten helpt.', 'Neem vertrouwelijk contact op', `mailto:${EMAIL}`, 'navy'),
    ],
    seo: {
      title: 'Vertrouwenspersoon | Badminton Borne',
      description:
        'Bij Badminton Borne kun je in vertrouwen terecht bij onze vertrouwenspersoon. Voor ongewenst gedrag, zorgen of gewoon een luisterend oor.',
    },
  })

  // =========================================================================
  //  LIDMAATSCHAP OPZEGGEN (/uitschrijven)
  // =========================================================================
  const faqOpzeg = [
    await faq(
      'faq-opzeg-termijn',
      'Wat is de opzegtermijn?',
      'Eén maand, ingaand op de eerste dag van de volgende maand. Zeg je bijvoorbeeld halverwege maart op, dan loopt je lidmaatschap tot en met april.',
    ),
    await faq(
      'faq-opzeg-hoe',
      'Hoe zeg ik op?',
      'Via het opzegformulier op deze pagina. Je krijgt daarna een bevestiging. Vragen? Mail info@badmintonborne.nl.',
    ),
    await faq(
      'faq-opzeg-competitie',
      'En als ik competitie speel?',
      'Speel je competitie, geef dat dan even aan bij het opzeggen, zodat we je team en de bondsinschrijving netjes kunnen afronden.',
    ),
    await faq(
      'faq-opzeg-terug',
      'Kan ik later terugkomen?',
      'Natuurlijk. De deur staat altijd open — je bent van harte welkom om weer mee te spelen.',
    ),
  ]
  await page('page-uitschrijven', {
    title: 'Lidmaatschap opzeggen',
    slug: {_type: 'slug', current: 'uitschrijven'},
    intro:
      'Jammer dat je gaat, maar we maken het je makkelijk. Opzeggen kan met een opzegtermijn van één maand.',
    sections: [
      featureGrid(undefined, 'Zo zeg je op', [
        ['Eén maand opzegtermijn', 'De opzegtermijn gaat in op de eerste dag van de maand na je opzegging.'],
        ['Via het formulier', 'Vul het opzegformulier in met je gegevens — dat is genoeg.'],
        ['Bevestiging', 'Je ontvangt een bevestiging van de opzegging.'],
        ['Altijd welkom terug', 'Verandert er iets? Je bent later van harte welkom om weer mee te spelen.'],
      ]),
      faqList('Veelgestelde vragen over opzeggen', faqOpzeg),
      ctaBanner('Lidmaatschap opzeggen', 'Naar het opzegformulier', FORM_OPZEGGEN, 'navy'),
    ],
    seo: {
      title: 'Lidmaatschap opzeggen | Badminton Borne',
      description:
        'Je lidmaatschap bij Badminton Borne opzeggen kan met een opzegtermijn van één maand. Vul het opzegformulier in — wij regelen de rest.',
    },
  })

  // =========================================================================
  //  BADMINTON VS ANDERE SPORTEN (verzamelpagina)
  // =========================================================================
  await page('page-badminton-vs-andere-sporten', {
    title: 'Badminton vs andere sporten',
    slug: {_type: 'slug', current: 'badminton-vs-andere-sporten'},
    pageGroup: 'vergelijking',
    intro:
      'Padel, tennis, squash — allemaal leuk. Maar hoe verhoudt badminton zich? We zetten het eerlijk naast elkaar.',
    sections: [
      comparison(
        'De vergelijking',
        'Badminton naast de rest',
        [
          ['Badminton', true],
          ['Tennis', false],
          ['Padel', false],
          ['Squash', false],
        ],
        [
          ['Topsnelheid', ['±493 km/u', '±263 km/u', '±180 km/u', '±280 km/u']],
          ['Hele jaar binnen', ['✓', 'Seizoensgebonden', 'Vaak buiten', '✓']],
          ['Direct meespelen', ['✓ Eerste avond', 'Lessen nodig', 'Snel te leren', 'Pittig te leren']],
          ['Racket lenen kan', ['✓', '—', '—', '—']],
          ['Enkel én dubbel', ['✓', '✓', 'Alleen dubbel', 'Vooral enkel']],
          ['In Borne, elke week', ['✓', '—', 'Wachtlijsten', 'Beperkt']],
        ],
        '*Snelheden zijn records/richtwaarden ter illustratie. Kom het vooral zelf ervaren.',
      ),
      audienceSegments('Vergelijk per sport', 'Kies je vergelijking', [
        {
          title: 'Badminton vs padel',
          description: 'Sneller, goedkoper en altijd binnen.',
          label: 'Bekijk het verschil',
          href: '/badminton-vs-padel',
        },
        {
          title: 'Badminton vs tennis',
          description: 'Explosiever en makkelijker te beginnen.',
          label: 'Bekijk het verschil',
          href: '/badminton-vs-tennis',
        },
        {
          title: 'Badminton vs squash',
          description: 'Socialer en voor élke leeftijd.',
          label: 'Bekijk het verschil',
          href: '/badminton-vs-squash',
        },
      ]),
      ctaBanner('Overtuigd? Kom een keer spelen.', 'Plan je eerste bezoek', '/probeer-gratis', 'lime'),
    ],
    seo: {
      title: 'Badminton vs padel, tennis & squash',
      description:
        'Badminton vergeleken met padel, tennis en squash: snelheid, kosten en toegankelijkheid eerlijk naast elkaar. Ontdek waarom badminton wint.',
    },
  })

  // ---- Badminton vs padel (SEO: padel Borne) ----
  const faqPadel = [
    await faq(
      'faq-padel-borne',
      'Kun je padellen in Borne?',
      'Padel wordt steeds populairder in Borne en omgeving en er komen banen bij. Wil je liever binnen spelen, zonder een baan te huren of te reserveren? Dan is badminton bij Badminton Borne een fijn en voordelig alternatief.',
    ),
    await faq(
      'faq-padel-kosten',
      'Is padel of badminton goedkoper in Borne?',
      'Padel reken je meestal per baan per uur af. Bij Badminton Borne betaal je een vaste, lage contributie per maand — shuttles inbegrepen en met een gratis eerste maand. Voor wie regelmatig speelt, is dat voordeliger.',
    ),
    await faq(
      'faq-padel-sneller',
      'Wat is sneller, padel of badminton?',
      'Badminton. Een shuttle haalt bij een smash veel hogere snelheden dan een padelbal, en het spel vraagt meer explosieve sprintjes en snelle reflexen.',
    ),
    await faq(
      'faq-padel-twijfel',
      'Ik twijfel tussen padel en badminton — wat raden jullie aan?',
      'Kom gewoon een keer gratis badmintonnen in Borne en voel het verschil. Bevalt het niet, dan zit je nergens aan vast.',
    ),
  ]
  await page('page-badminton-vs-padel', {
    title: 'Badminton vs padel',
    slug: {_type: 'slug', current: 'badminton-vs-padel'},
    pageGroup: 'vergelijking',
    intro:
      'Padel is booming — ook in en rond Borne wil iedereen het proberen. Maar is padel of badminton de slimste keuze? We vergelijken beide sporten eerlijk: snelheid, kosten en waar je in Borne terechtkunt.',
    sections: [
      comparison(
        'Badminton vs padel',
        'Waarin ze verschillen',
        [
          ['Badminton', true],
          ['Padel', false],
        ],
        [
          ['Topsnelheid', ['±493 km/u (shuttle)', '±180 km/u (bal)']],
          ['Waar je speelt', ['Binnen, het hele jaar', 'Vaak buiten, weersafhankelijk']],
          ['Baan nodig', ['Sporthal, samen delen', 'Padelbaan huren en reserveren']],
          ['Kosten', ['Vaste contributie p/m', 'Baanhuur per uur']],
          ['Instap', ['Racket lenen kan', 'Racket lenen of huren']],
          ['Direct meespelen', ['✓ Eerste avond', 'Ja, snel te leren']],
        ],
        '*Snelheden ter illustratie.',
      ),
      featureGrid(undefined, 'Padel en badminton in Borne', [
        ['Padel in Borne', 'Padel groeit hard en er komen banen bij in de regio. Reken wel op baanhuur, reserveren en vaak buiten spelen.'],
        ['Badminton in Borne', 'Bij Badminton Borne speel je elke week binnen, zonder een baan te huren. Racket lenen kan en je eerste maand is gratis.'],
        ['De kosten', 'Padel betaal je per baan per uur. Badminton kost een vaste, lage contributie per maand — shuttles inbegrepen.'],
        ['Snel meedoen', 'Beide pak je snel op. Bij badminton sta je de eerste avond al te spelen, ingedeeld op jouw niveau.'],
      ]),
      sportHighlight(
        'De korte versie',
        'Sneller, goedkoper en altijd binnen',
        'Padel is heerlijk laagdrempelig, maar je bent afhankelijk van het weer en een vrije baan. Badminton speel je het hele jaar binnen in Borne, je begint met een geleend racket en je staat zonder wachtlijst meteen op de baan.',
        [
          ['±493', 'km/u shuttlesnelheid*'],
          ['€0', 'baanhuur bij Borne'],
        ],
      ),
      faqList('Padel of badminton in Borne?', faqPadel),
      ctaBanner('Eerst gratis badminton proberen in Borne?', 'Plan je eerste bezoek', '/probeer-gratis', 'lime'),
    ],
    seo: {
      title: 'Badminton vs padel in Borne — de verschillen',
      description:
        'Padel of badminton in Borne? Vergelijk snelheid, kosten en gemak. Badminton speel je het hele jaar binnen tegen een lage contributie. Kom gratis proberen.',
    },
  })

  // ---- Badminton vs tennis (SEO: tennis Borne) ----
  const faqTennis = [
    await faq(
      'faq-tennis-borne',
      'Kun je tennissen in Borne?',
      'Er zijn tennismogelijkheden in en rond Borne. Zoek je een sport die het hele jaar binnen doorgaat en waarbij je meteen meespeelt zonder eerst lessen te nemen? Dan is badminton een aanrader.',
    ),
    await faq(
      'faq-tennis-makkelijker',
      'Is badminton makkelijker dan tennis?',
      'Om te beginnen wel. Een shuttle raken lukt sneller dan een tennisbal goed slaan, dus je hebt eerder plezier en langere rally’s — ook als je nog nooit hebt gespeeld.',
    ),
    await faq(
      'faq-tennis-intensief',
      'Wat is intensiever, tennis of badminton?',
      'Badminton is verrassend intensief: veel korte sprints, sprongen en snelle reacties. Een uur badminton is een stevige work-out.',
    ),
    await faq(
      'faq-tennis-proberen',
      'Kan ik badminton gratis proberen in Borne?',
      'Ja. Je eerste maand is gratis en een racket lenen we je. Plan een eerste bezoek en je speelt meteen mee.',
    ),
  ]
  await page('page-badminton-vs-tennis', {
    title: 'Badminton vs tennis',
    slug: {_type: 'slug', current: 'badminton-vs-tennis'},
    pageGroup: 'vergelijking',
    intro:
      'Tennis en badminton lijken familie, maar spelen totaal anders. Denk je aan tennis in Borne? Vergelijk het eerst met badminton: sneller, explosiever en het hele jaar door binnen.',
    sections: [
      comparison(
        'Badminton vs tennis',
        'Waarin ze verschillen',
        [
          ['Badminton', true],
          ['Tennis', false],
        ],
        [
          ['Topsnelheid', ['±493 km/u (shuttle)', '±263 km/u (bal)']],
          ['Waar je speelt', ['Binnen, het hele jaar', 'Buiten of binnen, seizoensgebonden']],
          ['Rally-tempo', ['Explosief, korte sprints', 'Langere slagenwisselingen']],
          ['Ruimte', ['Sporthal, banen delen', 'Grote losse baan']],
          ['Instap', ['Racket lenen kan', 'Lessen vaak nodig']],
          ['Direct meespelen', ['✓ Eerste avond', 'Meer techniek vooraf nodig']],
        ],
        '*Snelheden ter illustratie.',
      ),
      featureGrid(undefined, 'Tennis en badminton in Borne', [
        ['Tennis in Borne', 'Tennis speel je op grote buitenbanen, vaak seizoensgebonden en met lessen om de techniek onder de knie te krijgen.'],
        ['Badminton in Borne', 'Badminton speel je binnen in de sporthal, het hele jaar door, en je stapt zonder lange leerweg meteen in.'],
        ['Techniek & instap', 'Tennis vraagt meer techniek voordat je een rally volhoudt. Bij badminton speel je de eerste avond al mee.'],
        ['Weer & seizoen', 'Geen last van regen, wind of winter: badminton gaat altijd door.'],
      ]),
      sportHighlight(
        'De korte versie',
        'Explosiever en sneller te leren',
        'Tennis is prachtig, maar vraagt techniek, een grote baan en het juiste seizoen. Badminton is compacter en explosiever: korte sprints, snelle handen en meteen plezier. Je stapt in met een geleend racket en speelt de eerste avond al mee.',
        [
          ['±493', 'km/u shuttlesnelheid*'],
          ['1e', 'avond meteen mee'],
        ],
      ),
      faqList('Tennis of badminton in Borne?', faqTennis),
      ctaBanner('Liever binnen spelen? Kom badmintonnen.', 'Plan je eerste bezoek', '/probeer-gratis', 'lime'),
    ],
    seo: {
      title: 'Badminton vs tennis in Borne — de verschillen',
      description:
        'Tennis of badminton in Borne? Badminton is sneller, explosiever en makkelijker te beginnen, het hele jaar binnen. Vergelijk en kom gratis proberen.',
    },
  })

  // ---- Badminton vs squash (SEO: squash Borne) ----
  const faqSquash = [
    await faq(
      'faq-squash-borne',
      'Kun je squashen in Borne?',
      'Er zijn squashmogelijkheden in de regio. Zoek je iets socialers waarbij je met meer mensen tegelijk speelt en dat voor alle leeftijden werkt? Dan past badminton beter.',
    ),
    await faq(
      'faq-squash-zwaar',
      'Is badminton minder zwaar dan squash?',
      'Badminton is intensief, maar je bepaalt zelf het tempo. Squash is door het vele keren en sprinten vaak zwaarder en blessuregevoeliger.',
    ),
    await faq(
      'faq-squash-samen',
      'Kun je badminton met meer mensen spelen?',
      'Ja. Dubbelspel (2 tegen 2) is bij ons heel gewoon, dus je speelt gezellig met z’n vieren in plaats van alleen één-tegen-één.',
    ),
    await faq(
      'faq-squash-leeftijd',
      'Vanaf welke leeftijd kun je badmintonnen?',
      'Vanaf ongeveer 8 jaar, en er is geen bovengrens. Bij Badminton Borne speelt iedereen van 8 tot 80 mee.',
    ),
  ]
  await page('page-badminton-vs-squash', {
    title: 'Badminton vs squash',
    slug: {_type: 'slug', current: 'badminton-vs-squash'},
    pageGroup: 'vergelijking',
    intro:
      'Squash en badminton zijn allebei snelle binnensporten. Toch is badminton socialer, veelzijdiger en voor élke leeftijd. Overweeg je squash in Borne? Lees eerst hoe het zich verhoudt tot badminton.',
    sections: [
      comparison(
        'Badminton vs squash',
        'Waarin ze verschillen',
        [
          ['Badminton', true],
          ['Squash', false],
        ],
        [
          ['Aantal spelers', ['2 of 4 (dubbel!)', 'Meestal 2']],
          ['Sociaal / dubbel', ['✓ Veel dubbelspel', 'Vooral 1-tegen-1']],
          ['Waar je speelt', ['Sporthal, samen', 'Aparte squashbox']],
          ['Alle leeftijden', ['✓ Van 8 tot 80', 'Vooral fanatiek en fit']],
          ['Instap', ['Racket lenen kan', 'Racket + bal nodig']],
          ['Hele jaar binnen', ['✓', '✓']],
        ],
        '*Ter illustratie.',
      ),
      featureGrid(undefined, 'Squash en badminton in Borne', [
        ['Squash in Borne', 'Squash speel je in een aparte squashbox, meestal één-tegen-één en behoorlijk intensief.'],
        ['Badminton in Borne', 'Badminton speel je samen in de sporthal, vaak dubbel (2 tegen 2), wat het een stuk socialer maakt.'],
        ['Voor elke leeftijd', 'Van 8 tot 80: bij badminton speelt iedereen mee. Squash is vooral iets voor de fanatieke, fitte speler.'],
        ['Belasting & blessures', 'Het explosieve keren tegen de muren maakt squash blessuregevoeliger. Badminton is voor de meesten milder vol te houden.'],
      ]),
      sportHighlight(
        'De korte versie',
        'Socialer en voor élke leeftijd',
        'Squash is intens, maar vooral een sport voor twee. Badminton speel je net zo makkelijk met vier: dubbelspel is bij ons de norm, wat het socialer maakt. En doordat het van 8 tot 80 te spelen is, kom je bij Borne iedereen tegen.',
        [
          ['4', 'spelers bij dubbel'],
          ['8–80', 'jaar op de baan'],
        ],
      ),
      faqList('Squash of badminton in Borne?', faqSquash),
      ctaBanner('Liever samen spelen? Kom badmintonnen.', 'Plan je eerste bezoek', '/probeer-gratis', 'lime'),
    ],
    seo: {
      title: 'Badminton vs squash in Borne — de verschillen',
      description:
        'Squash of badminton in Borne? Badminton is socialer (veel dubbelspel) en voor alle leeftijden. Vergelijk de sporten en kom gratis proberen.',
    },
  })

  // =========================================================================
  //  AIR BADMINTON
  // =========================================================================
  const faqAir = [
    await faq(
      'faq-air-aanbieden',
      'Gaan jullie Air Badminton aanbieden?',
      'We overwegen het. De nieuwe sporthal ’t Wooldrik heeft een beachhal, waardoor we badminton op zand zouden kunnen spelen — binnen, het hele jaar door. We kijken of er genoeg animo voor is. Lijkt het je leuk? Laat het ons weten via info@badmintonborne.nl.',
    ),
    await faq(
      'faq-air-shuttle',
      'Wat is de AirShuttle?',
      'De AirShuttle is een speciale, zwaardere shuttle die is gemaakt om buiten te spelen. Hij is windbestendig, zodat een briesje je rally niet verpest.',
    ),
    await faq(
      'faq-air-waar',
      'Waar speel je Air Badminton?',
      'Op zand, gras of een harde ondergrond — op het strand, in het park of in een beachhal. Naast enkel en dubbel kun je ook met drie spelers per kant spelen (triples).',
    ),
  ]
  await page('page-air-badminton', {
    title: 'Air Badminton',
    slug: {_type: 'slug', current: 'air-badminton'},
    intro:
      'Badminton buiten, op het strand of het gras — met een speciale windbestendige shuttle. In de nieuwe hal met beachvloer onderzoeken we of we het gaan aanbieden.',
    sections: [
      sportHighlight(
        'Nieuw bij Borne?',
        'Badminton, maar dan op zand',
        'Air Badminton is de buitenvariant van badminton, ontwikkeld door de wereldbadmintonbond (BWF). Je speelt met de AirShuttle — een zwaardere, windbestendige shuttle — op zand, gras of een harde ondergrond. Dankzij de beachhal in ’t Wooldrik zouden we het zelfs binnen op zand kunnen spelen.',
        [
          ['AirShuttle', 'windbestendig'],
          ['tot 3', 'spelers per kant'],
        ],
      ),
      featureGrid(undefined, 'Wat is Air Badminton?', [
        ['Windbestendige shuttle', 'De AirShuttle is zwaarder en houdt zijn koers, ook met een briesje erbij.'],
        ['Op zand, gras of asfalt', 'Overal te spelen: op het strand, in het park of in de beachhal.'],
        ['Triples: 3 tegen 3', 'Naast enkel en dubbel kun je met drie spelers per kant spelen.'],
        ['Officiële BWF-variant', 'Air Badminton is de erkende buitenvorm van de wereldbadmintonbond.'],
      ]),
      faqList('Air Badminton bij Borne', faqAir),
      ctaBanner('Lijkt Air Badminton je wat?', 'Laat het ons weten', '/contact', 'lime'),
    ],
    seo: {
      title: 'Air Badminton — badminton op zand | Borne',
      description:
        'Air Badminton is de buitenvariant met een windbestendige AirShuttle, op zand of gras. Dankzij de beachhal in ’t Wooldrik overwegen we het bij Borne.',
    },
  })

  // =========================================================================
  //  PRIVACY
  // =========================================================================
  await page('page-privacy', {
    title: 'Privacyverklaring',
    slug: {_type: 'slug', current: 'privacy'},
    intro:
      'Badmintonvereniging Borne gaat zorgvuldig om met je persoonsgegevens. Hier lees je welke gegevens we verwerken en waarom.',
    sections: [
      featureGrid(undefined, 'Hoe wij met je gegevens omgaan', [
        ['Welke gegevens', 'Naam, contactgegevens en lidmaatschapsgegevens die je zelf aan ons doorgeeft.'],
        ['Waarvoor', 'Voor je lidmaatschap, de contributie, competitie-inschrijving bij Badminton Nederland en clubcommunicatie.'],
        ['Met wie we delen', 'Alleen met partijen die nodig zijn voor de vereniging, zoals de bond. Nooit voor commerciële verkoop.'],
        ['Jouw rechten', 'Je mag je gegevens inzien, corrigeren of laten verwijderen. Stuur een mail naar info@badmintonborne.nl.'],
        ['Bewaartermijn', 'We bewaren gegevens niet langer dan nodig voor het lidmaatschap en wettelijke verplichtingen.'],
        ['Vragen of klachten', 'Neem contact op via info@badmintonborne.nl. Je kunt ook terecht bij de Autoriteit Persoonsgegevens.'],
      ]),
      ctaBanner('Vragen over je privacy?', 'Mail ons', `mailto:${EMAIL}`, 'navy'),
    ],
    seo: {
      title: 'Privacyverklaring | Badminton Borne',
      description:
        'Lees hoe Badmintonvereniging Borne omgaat met je persoonsgegevens: welke gegevens we verwerken, waarvoor en welke rechten je hebt.',
    },
  })

  // =========================================================================
  //  JEUGDFONDS SPORT & CULTUUR (SEO, gelinkt vanaf de Jeugd-pagina)
  // =========================================================================
  const faqJf = [
    await faq(
      'faq-jf-wie',
      'Voor wie is het Jeugdfonds Sport & Cultuur?',
      'Voor kinderen en jongeren uit gezinnen met weinig geld. Het fonds betaalt (een deel van) de contributie, zodat je kind toch kan sporten. Check de actuele voorwaarden bij de gemeente Borne of op allekinderendoenmee.nl.',
    ),
    await faq(
      'faq-jf-aanvragen',
      'Hoe vraag ik het aan?',
      'Niet zelf, maar via een intermediair: iemand die je kind beroepsmatig kent, zoals een leerkracht, de buurtsportcoach of een hulpverlener. In Borne helpen Borne Sport (bornesport@borne.nl) en het Sociaal Huus van de gemeente je verder.',
    ),
    await faq(
      'faq-jf-wat',
      'Wat betaalt het fonds precies?',
      'De contributie van de club, die rechtstreeks aan Badminton Borne wordt overgemaakt. Een eventueel restant kan naar bijvoorbeeld een racket of andere sportspullen.',
    ),
    await faq(
      'faq-jf-club',
      'Kan Badminton Borne helpen?',
      'Ja. Laat het ons weten via info@badmintonborne.nl. We denken met je mee en zorgen dat je kind gewoon kan meespelen — de aanvraag zelf loopt via de intermediair.',
    ),
  ]
  await page('page-jeugdfonds-sport-en-cultuur', {
    title: 'Jeugdfonds Sport & Cultuur',
    slug: {_type: 'slug', current: 'jeugdfonds-sport-en-cultuur'},
    intro:
      'Sporten mag niet aan geld liggen. Kan de contributie voor badminton er thuis even niet bij? Het Jeugdfonds Sport & Cultuur betaalt mee, zodat ook jouw kind kan badmintonnen in Borne.',
    sections: [
      featureGrid('Financiële hulp', 'Zo werkt het Jeugdfonds', [
        ['Voor gezinnen met weinig geld', 'Het fonds is er voor kinderen uit gezinnen waar het geld voor sport net niet lukt.'],
        ['Het betaalt de contributie', 'De bijdrage gaat rechtstreeks naar de club. Een restant kan naar materiaal, zoals een racket.'],
        ['Aanvraag via een intermediair', 'Ouders vragen niet zelf aan. Een leerkracht, buurtsportcoach of hulpverlener doet dat voor je.'],
        ['Ook in Borne', 'Borne valt onder Jeugdfonds Sport & Cultuur Hengelo-Borne. Wij helpen je graag op weg.'],
      ]),
      sportHighlight(
        'Zo vraag je het aan',
        'In een paar stappen geregeld',
        'De aanvraag loopt via een intermediair: iemand die je kind beroepsmatig kent, zoals een leerkracht, de buurtsportcoach of een hulpverlener. In Borne kun je terecht bij Borne Sport (bornesport@borne.nl) of het Sociaal Huus van de gemeente Borne. Zij dienen de aanvraag in en de bijdrage wordt rechtstreeks aan de club betaald. Meer info staat op allekinderendoenmee.nl en op borne.nl.',
        [],
      ),
      faqList('Veelgestelde vragen over het Jeugdfonds', faqJf),
      ctaBanner(
        'Vragen over de contributie?\nWe helpen je graag verder.',
        'Mail Badminton Borne',
        `mailto:${EMAIL}`,
        'lime',
        false,
        null,
      ),
    ],
    seo: {
      title: 'Jeugdfonds Sport & Cultuur — badminton in Borne',
      description:
        'Contributie voor badminton lastig te betalen? Het Jeugdfonds Sport & Cultuur betaalt mee zodat je kind kan sporten in Borne. Lees hoe je het aanvraagt.',
    },
  })

  // =========================================================================
  //  BADMINTON VANUIT HET AZC (inclusie + SEO)
  // =========================================================================
  await page('page-badminton-azc-borne', {
    title: 'Badminton vanuit het AZC',
    slug: {_type: 'slug', current: 'badminton-azc-borne'},
    intro:
      'Nieuw in Borne en op zoek naar contact en beweging? Bij Badminton Borne speelt iedereen mee. De sporthal ligt vlakbij en je eerste maand is gratis — je hoeft geen Nederlands te spreken om erbij te horen.',
    sections: [
      featureGrid('Welkom', 'Waarom badminton bij ons past', [
        ['Nieuwe mensen leren kennen', 'Op de baan speel je steeds met anderen. Zo groeit je kring in Borne vanzelf.'],
        ['Dichtbij', 'De sporthal is goed te bereiken vanaf het AZC — je bent er zo.'],
        ['Taal is geen probleem', 'Je hoeft geen Nederlands te spreken. Op de baan wijst het spel zich vanzelf.'],
        ['Gratis proberen', 'De eerste maand is gratis en een racket lenen we je. Kom gewoon een keer mee.'],
      ]),
      sportHighlight(
        'Voor iedereen',
        'Iedereen kan meedoen',
        'Badminton is makkelijk om mee te beginnen: een racket, een shuttle en je speelt. Je hoeft niet goed te zijn en de taal maakt niet uit. We delen je in op niveau, en na een paar keer ken je alweer een hoop mensen uit Borne.',
        [
          ['gratis', 'eerste maand'],
          ['racket', 'van ons te leen'],
        ],
      ),
      trainingTimes('Wanneer je kunt komen', {label: 'Plan je eerste bezoek', href: '/probeer-gratis'}),
      ctaBanner('Kom een keer meespelen.', 'Plan je eerste bezoek', '/probeer-gratis', 'lime'),
    ],
    seo: {
      title: 'Badminton vanuit het AZC — welkom in Borne',
      description:
        'Nieuw in Borne? Bij Badminton Borne speelt iedereen mee: dichtbij het AZC, eerste maand gratis en taal is geen probleem. Vergroot je sociale kring.',
    },
  })

  // =========================================================================
  //  LOKALE SEO-LANDINGSPAGINA'S — "Badminton in <plaats>"
  // =========================================================================
  for (const p of PLACES) {
    const faqIds: string[] = []
    for (const [id, q, a] of p.faqs) faqIds.push(await faq(id, q, a))
    await page(`page-loc-${p.slug}`, {
      title: `Badminton in ${p.name}`,
      slug: {_type: 'slug', current: `badminton-${p.slug}`},
      pageGroup: 'buurt',
      intro: p.intro,
      sections: [
        sportHighlight(`Badminton in ${p.name}`, p.hlHeading, p.hlBody, [p.stat, ['1e maand', 'gratis']]),
        featureGrid('Waarom Badminton Borne', 'Waarom je bij ons op je plek zit', USP_FEATURES),
        trainingTimes('Trainingstijden', {label: 'Plan je eerste bezoek', href: '/probeer-gratis'}),
        faqList(`Veelgestelde vragen — badminton vanuit ${p.name}`, faqIds),
        ctaBanner(p.ctaHeading, 'Plan je eerste bezoek', '/probeer-gratis', 'lime'),
      ],
      seo: {
        title: `Badminton in ${p.name} — bij Badminton Borne`,
        description: p.desc,
      },
    })
  }
  console.log(`✓ ${PLACES.length} lokale landingspagina’s aangemaakt`)

  // ---- Verzamelpagina "Badminton in de buurt" (hub → alle plaatsen) --------
  const placeBySlug = Object.fromEntries(PLACES.map((p) => [p.slug, p]))
  const BLURB: Record<string, string> = {
    borne: 'Dé club van het dorp, met een nieuwe zaal in ’t Wooldrik.',
    zenderen: 'Om de hoek — Zenderen hoort bij de gemeente Borne.',
    hertme: 'Op een steenworp; Hertme is een van de dorpen van Borne.',
    azelo: 'Vlakbij Borne, zo bij sportpark ’t Wooldrik.',
    hengelo: 'Vlak naast Hengelo — veel van onze leden komen er vandaan.',
    delden: 'Op korte afstand; een mooie rit voor je vaste badmintonavond.',
    saasveld: 'Vlakbij, goed te doen voor een avondje badminton.',
  }
  const buurtGroups: Array<{eyebrow: string; heading: string; slugs: string[]}> = [
    {eyebrow: 'Gemeente Borne', heading: 'Borne en de dorpen', slugs: ['borne', 'zenderen', 'hertme', 'azelo']},
    {eyebrow: 'Vlakbij', heading: 'In de buurt van Borne', slugs: ['hengelo', 'delden', 'saasveld']},
  ]
  await page('page-badminton-in-de-buurt', {
    title: 'Badminton in de buurt',
    slug: {_type: 'slug', current: 'badminton-in-de-buurt'},
    pageGroup: 'buurt',
    intro:
      'Woon je in Borne of in een van de dorpen en steden eromheen? Bij Badminton Borne ben je altijd dichtbij. Kies je plaats en zie waarom je bij ons op je plek zit.',
    sections: [
      ...buurtGroups.map((g) =>
        audienceSegments(
          g.eyebrow,
          g.heading,
          g.slugs.map((s) => ({
            title: placeBySlug[s].name,
            description: BLURB[s],
            label: `Badminton in ${placeBySlug[s].name}`,
            href: `/badminton-${s}`,
          })),
        ),
      ),
      featureGrid('Waarom Badminton Borne', 'Waarom je bij ons op je plek zit', USP_FEATURES),
      ctaBanner('Kom een keer meespelen.', 'Plan je eerste bezoek', '/probeer-gratis', 'lime'),
    ],
    seo: {
      title: 'Badminton in de buurt — Borne & omgeving',
      description:
        'Badminton in Borne, Zenderen, Hertme, Azelo, Hengelo, Delden of Saasveld? Bij Badminton Borne speel je altijd dichtbij. Bekijk je plaats en kom proberen.',
    },
  })
  console.log('✓ verzamelpagina /badminton-in-de-buurt aangemaakt')

  // ---- USP's op de "Over ons"-pagina (basisseed-pagina, idempotente patch) --
  const overOnsId: string | null = await client.fetch(
    `*[_type == "page" && slug.current == "over-ons"][0]._id`,
  )
  if (overOnsId) {
    const uspSection: Section = {
      _type: 'featureGrid',
      _key: 'usp-regio',
      eyebrow: 'Waarom Badminton Borne',
      heading: 'Waarom je bij ons op je plek zit',
      features: USP_FEATURES.map(([title, description]) => ({
        _type: 'feature',
        _key: key(),
        title,
        description,
      })),
    }
    await upsertSection(overOnsId, 'usp-regio', uspSection, 'before', 'sections[0]')
    console.log('✓ /over-ons: USP-sectie toegevoegd/bijgewerkt')
  }

  // ---- Footer: losse buurt-kolom weg, één link naar de verzamelpagina ------
  // (een eerdere run kan de 7-links-kolom hebben aangemaakt — die halen we weg)
  await client.patch('siteSettings').unset(['footerColumns[_key=="footer-regio"]']).commit()
  const footerCols: Array<{_key: string; title: string; hrefs?: string[]}> | null =
    await client.fetch(`*[_id == "siteSettings"][0].footerColumns[]{_key, title, "hrefs": links[].href}`)
  const spelen = (footerCols ?? []).find((c) => c.title === 'Spelen')
  if (spelen && !(spelen.hrefs ?? []).includes('/badminton-in-de-buurt')) {
    await client
      .patch('siteSettings')
      .insert('after', `footerColumns[_key=="${spelen._key}"].links[-1]`, [
        {_type: 'cta', _key: key(), label: 'Badminton in de buurt', href: '/badminton-in-de-buurt'},
      ])
      .commit()
  }
  console.log('✓ siteSettings: buurt-kolom vervangen door één link naar /badminton-in-de-buurt')

  console.log('\n✓ Klaar! Subpagina’s + lokale landingspagina’s gesynchroniseerd (script = bron; page-*/faq-* worden bij een re-run overschreven).')
  console.log('  /over-ons kreeg een USP-sectie en de footer één link naar /badminton-in-de-buurt (idempotent; de rest blijft intact).')
  console.log('  Open de Studio, controleer de content en publiceer waar nodig.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
