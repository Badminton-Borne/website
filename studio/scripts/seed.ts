/**
 * Vult de dataset met de homepage-content uit het design ("1a").
 * Draaien: npm run seed   (= sanity exec scripts/seed.ts --with-user-token)
 *
 * Veilig om opnieuw te draaien: bestaande documenten worden nooit overschreven.
 */
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-02-01'})

const key = () => Math.random().toString(36).slice(2, 12)

const cta = (label: string, href: string) => ({_type: 'cta', label, href})

const MICROCOPY = '1 maand gratis · geen verplichtingen · maandelijks opzegbaar'

async function ensureCollection<T extends {_type: string}>(
  type: string,
  docs: T[],
): Promise<string[]> {
  const existing: string[] = await client.fetch(
    `*[_type == $type && !(_id in path("drafts.**"))]._id`,
    {type},
  )
  if (existing.length > 0) {
    console.log(`− ${type}: ${existing.length} bestaande documenten, overslaan`)
    return existing
  }
  const ids: string[] = []
  for (const doc of docs) {
    const created = await client.create(doc)
    ids.push(created._id)
  }
  console.log(`✓ ${type}: ${ids.length} documenten aangemaakt`)
  return ids
}

async function run() {
  // ---- Losse documenten -------------------------------------------------
  // Locaties met vaste id's zodat trainingstijden er stabiel naar verwijzen
  await client.createIfNotExists({
    _id: 'locatie-wooldrik',
    _type: 'location',
    name: "'t Wooldrik Hal B (nieuwe sporthal)",
    street: "'t Wooldrik 1",
    city: 'Borne',
  })
  await client.createIfNotExists({
    _id: 'locatie-hooiberg',
    _type: 'location',
    name: 'De Hooiberg',
    street: 'Dorsvloer 27',
    city: 'Borne',
  })
  console.log('✓ locaties aangemaakt (of bestonden al)')

  const locRef = (id: string) => ({_type: 'reference', _ref: id})
  const trainingTimeIds = await ensureCollection('trainingTime', [
    {_type: 'trainingTime', group: 'Jeugd', activity: 'training', day: 'maandag', startTime: '19:00', endTime: '20:00', location: locRef('locatie-wooldrik'), order: 0},
    {_type: 'trainingTime', group: 'Jeugd', activity: 'vrij spelen', day: 'maandag', startTime: '20:00', endTime: '21:00', location: locRef('locatie-wooldrik'), order: 1},
    {_type: 'trainingTime', group: 'Jeugd', day: 'donderdag', startTime: '19:00', endTime: '20:00', location: locRef('locatie-hooiberg'), order: 2},
    {_type: 'trainingTime', group: 'Volwassenen', activity: 'training', day: 'maandag', startTime: '20:00', endTime: '21:00', location: locRef('locatie-wooldrik'), order: 3},
    {_type: 'trainingTime', group: 'Volwassenen', activity: 'vrij spelen', day: 'maandag', startTime: '19:00', endTime: '22:00', location: locRef('locatie-wooldrik'), order: 4},
    {_type: 'trainingTime', group: 'Volwassenen', activity: 'vrij spelen', day: 'donderdag', startTime: '20:00', endTime: '21:00', location: locRef('locatie-hooiberg'), order: 5},
  ])
  void trainingTimeIds // rijen worden via GROQ opgehaald, geen referenties nodig

  const reviewIds = await ensureCollection('review', [
    {_type: 'review', quote: 'Superleuke club. Binnen één avond stond ik gewoon mee te spelen.', name: 'Sanne', role: 'recreant', rating: 5},
    {_type: 'review', quote: 'Onze zoon van 9 gaat elke week met plezier. Goede jeugdtrainers.', name: 'Mark', role: 'ouder', rating: 5},
    {_type: 'review', quote: 'Fanatiek als je wilt, gezellig als je wilt. Precies goed.', name: 'Yasmin', role: 'competitie', rating: 5},
  ])

  // Let op: alleen het eerste antwoord komt uit het design; de rest is
  // voorzetcopy — nalezen vóór livegang.
  const faqIds = await ensureCollection('faqItem', [
    {
      _type: 'faqItem',
      question: 'Wat kost het?',
      answer:
        'Je eerste maand is gratis. Daarna betaal je een vast bedrag per kwartaal — jeugd goedkoper dan volwassenen. De actuele tarieven staan op de lidmaatschapspagina.',
    },
    {
      _type: 'faqItem',
      question: 'Wat moet ik meenemen?',
      answer:
        'Sportkleding en zaalschoenen (geen zwarte zolen). Een racket kun je de eerste weken gratis van ons lenen; shuttles zijn er altijd.',
    },
    {
      _type: 'faqItem',
      question: 'Kan ik zomaar langskomen?',
      answer:
        'Ja! Stuur ons vooraf even een berichtje, dan staat er iemand voor je klaar. Je speelt de eerste avond direct mee.',
    },
    {
      _type: 'faqItem',
      question: 'Vanaf welke leeftijd?',
      answer:
        'De jeugdtraining is vanaf 8 jaar. Daarboven is er geen grens — bij ons speelt iedereen van 8 tot 80 mee.',
    },
    {
      _type: 'faqItem',
      question: 'Heb ik een eigen groep nodig?',
      answer:
        'Nee, je kunt gewoon alleen komen. We delen je in op niveau en je speelt meteen wisselende partijen mee.',
    },
  ])

  // ---- Componenten-handoff (artboards 4a–4f, 5a) -------------------------
  // ⚠ Bedragen, jaren en cijfers zijn illustratief (uit het design) —
  //   de club vult echte waarden in via de Studio.
  // Twee lidmaatschappen: Jeugd en Senioren. Competitie is geen apart
  // pakket — de toeslag varieert (€ 50 p.p. jeugd / € 260 per team) en
  // staat in de features + voetnoot van de prijstabel.
  const packageIds = await ensureCollection('membershipPackage', [
    {
      _type: 'membershipPackage',
      title: 'Jeugd',
      description: 'T/m 18 jaar. Training met leeftijdsgenoten.',
      price: 18.5,
      priceSuffix: 'per maand',
      features: ['Wekelijkse jeugdtraining', 'Racket lenen kan altijd', 'Shuttles inbegrepen', 'Competitie mogelijk (toeslag € 50 p.p. per seizoen)'],
      highlighted: false,
      ctaLabel: 'Aanmelden',
      ctaHref: '/lid-worden',
      sortOrder: 0,
    },
    {
      _type: 'membershipPackage',
      title: 'Senioren',
      description: 'Volwassenen. Vrij spelen én training op vaste avonden.',
      price: 26,
      priceSuffix: 'per maand',
      features: ['Elke week vrij spelen én training', 'Shuttles inbegrepen', 'Gezellige derde helft', 'Competitie mogelijk (toeslag per team)'],
      highlighted: true,
      highlightLabel: 'Meest gekozen',
      ctaLabel: 'Aanmelden',
      ctaHref: '/lid-worden',
      sortOrder: 1,
    },
  ])

  // Echte namen/rollen (bron: wie-zijn-wij). Foto's voegt scripts/seed-team.ts
  // toe; dat script werkt óók een al-geseede dataset bij.
  await ensureCollection('teamMember', [
    {_type: 'teamMember', name: 'Diederik', role: 'Voorzitter', group: 'bestuur', sortOrder: 0},
    {_type: 'teamMember', name: 'Max', role: 'Secretaris', group: 'bestuur', sortOrder: 1},
    {_type: 'teamMember', name: 'Lukas', role: 'Penningmeester', group: 'bestuur', sortOrder: 2},
    {_type: 'teamMember', name: 'Vincent Eidhof', role: 'Algemeen bestuurslid', group: 'bestuur', sortOrder: 3},
    {_type: 'teamMember', name: 'Mitchell Bollemeijer', role: 'Competitieleider', group: 'bestuur', sortOrder: 4},
    {_type: 'teamMember', name: 'Roelie', role: 'Vertrouwenspersoon', group: 'bestuur', sortOrder: 5},
    {_type: 'teamMember', name: 'Sem Gombert', role: 'Trainer', group: 'trainer', sortOrder: 0},
  ])

  await ensureCollection('honoraryMember', [
    {_type: 'honoraryMember', name: 'Naam Erelid', memberSince: 1998, contribution: 'Medeoprichter van de club en 25 jaar lang de motor achter de jeugdafdeling.', sortOrder: 0},
    {_type: 'honoraryMember', name: 'Naam Erelid', memberSince: 2005, contribution: 'Decennialang competitieleider en nog altijd elke maandag in de hal te vinden.', sortOrder: 1},
    {_type: 'honoraryMember', name: 'Naam Erelid', memberSince: 2012, contribution: 'Het gezicht van de gezelligheid — organiseerde jarenlang alle clubtoernooien.', sortOrder: 2},
  ])

  await ensureCollection('event', [
    {_type: 'event', title: 'Opening nieuwe sporthal', description: 'Feestelijke eerste speelavond — iedereen welkom, racket lenen kan.', date: '2026-08-15T19:00:00Z', ctaLabel: 'Ik kom', ctaLink: '/contact', featured: false},
    {_type: 'event', title: 'Start competitieseizoen', description: 'Eerste thuiswedstrijden — kom aanmoedigen.', date: '2026-09-05T19:00:00Z', ctaLabel: 'Programma', ctaLink: '/competitie', featured: false},
    {_type: 'event', title: 'Open toernooi voor niet-leden', description: 'Neem een vriend mee — team van 2, iedereen kan meedoen.', date: '2026-09-27T10:00:00Z', ctaLabel: 'Doe mee', ctaLink: '/contact', featured: true},
  ])

  await ensureCollection('sponsor', [
    {_type: 'sponsor', name: 'Sponsor 1', sortOrder: 0},
    {_type: 'sponsor', name: 'Sponsor 2', sortOrder: 1},
    {_type: 'sponsor', name: 'Sponsor 3', sortOrder: 2},
    {_type: 'sponsor', name: 'Sponsor 4', sortOrder: 3},
  ])

  const newsBody = (text: string) => [
    {
      _type: 'block',
      _key: key(),
      style: 'normal',
      children: [{_type: 'span', _key: key(), text, marks: []}],
      markDefs: [],
    },
  ]

  await ensureCollection('newsArticle', [
    {
      _type: 'newsArticle',
      title: 'Wij openen de nieuwe sporthal',
      slug: {_type: 'slug', current: 'wij-openen-de-nieuwe-sporthal'},
      publishedAt: '2026-07-01T09:00:00Z',
      excerpt: 'Vanaf augustus spelen we als eersten in de splinternieuwe hal van Borne. Kom kijken op de feestelijke openingsavond.',
      category: 'Club',
      featured: true,
      body: newsBody('Vanaf augustus spelen we als eersten in de splinternieuwe sporthal van Borne. Nieuwe vloer, nieuwe verlichting en eindelijk ruimte voor iedereen. Op de openingsavond is iedereen welkom — racket lenen kan, shuttles liggen klaar. [Voorbeeldbericht — vervang via de Studio.]'),
    },
    {
      _type: 'newsArticle',
      title: 'Competitieseizoen start in september',
      slug: {_type: 'slug', current: 'competitieseizoen-start-in-september'},
      publishedAt: '2026-06-20T09:00:00Z',
      excerpt: 'Onze teams staan klaar voor het nieuwe seizoen. Kom aanmoedigen bij de eerste thuiswedstrijden.',
      category: 'Competitie',
      featured: false,
      body: newsBody('In september beginnen de eerste thuiswedstrijden van het nieuwe competitieseizoen. Publiek is meer dan welkom — de koffie staat klaar. [Voorbeeldbericht — vervang via de Studio.]'),
    },
    {
      _type: 'newsArticle',
      title: 'Jeugdtoernooi groot succes',
      slug: {_type: 'slug', current: 'jeugdtoernooi-groot-succes'},
      publishedAt: '2026-06-05T09:00:00Z',
      excerpt: 'Ruim dertig kinderen sloegen hun eerste smashes tijdens het jaarlijkse jeugdtoernooi.',
      category: 'Jeugd',
      featured: false,
      body: newsBody('Ruim dertig kinderen deden mee aan het jaarlijkse jeugdtoernooi. Van eerste shuttle tot finale-rally: de zaal stond vol energie. [Voorbeeldbericht — vervang via de Studio.]'),
    },
  ])

  // ---- Subpagina's (page-builder) ----------------------------------------
  await ensureCollection('page', [
    {
      _type: 'page',
      title: 'Lidmaatschap',
      slug: {_type: 'slug', current: 'lidmaatschap'},
      intro: 'Kies het pakket dat bij je past — overstappen kan altijd.',
      sections: [
        {
          _type: 'pricingSection',
          _key: key(),
          eyebrow: 'Lidmaatschap',
          heading: 'Kies je pakket',
          intro: 'Altijd inclusief shuttles en begeleiding. Eerste maand gratis, daarna per kwartaal — maandelijks opzegbaar.',
          packages: packageIds.map((id) => ({_type: 'reference', _key: key(), _ref: id})),
          footnote: '*Bedragen ter illustratie — actuele tarieven checken vóór publicatie. Eerste maand altijd gratis.',
        },
        {
          _type: 'comparisonSection',
          _key: key(),
          eyebrow: 'Badminton vs andere sporten',
          heading: 'Waarom badminton wint',
          columns: [
            {_type: 'comparisonColumn', _key: key(), label: 'Badminton', highlighted: true},
            {_type: 'comparisonColumn', _key: key(), label: 'Tennis', highlighted: false},
            {_type: 'comparisonColumn', _key: key(), label: 'Padel', highlighted: false},
          ],
          rows: [
            {_type: 'comparisonRow', _key: key(), label: 'Topsnelheid', values: ['±400 km/u*', '±250 km/u', '±180 km/u']},
            {_type: 'comparisonRow', _key: key(), label: 'Hele jaar binnen spelen', values: ['✓', 'Seizoensgebonden', 'Vaak buiten']},
            {_type: 'comparisonRow', _key: key(), label: 'Instapkosten', values: ['Laag — racket lenen kan', 'Middel', 'Middel']},
            {_type: 'comparisonRow', _key: key(), label: 'Direct meespelen als beginner', values: ['✓ Eerste avond al', 'Lessen nodig', 'Snel te leren']},
            {_type: 'comparisonRow', _key: key(), label: 'In Borne, zonder wachtlijst', values: ['✓', '—', 'Wachtlijsten']},
          ],
          footnote: '*Cijfers ter illustratie — checken vóór publicatie.',
          ctaLabel: 'Probeer het zelf gratis',
          ctaLink: '/probeer-gratis',
        },
        {_type: 'newsletterSection', _key: key(), heading: 'Mis geen smash', body: 'Eén mailtje per maand over toernooien, de nieuwe hal en clubnieuws.', buttonLabel: 'Aanmelden', note: 'Uitschrijven kan altijd met één klik.'},
      ],
      seo: {
        title: 'Lidmaatschap — Badminton Borne',
        description: 'Kies je pakket bij Badminton Borne: jeugd, recreatief of competitie. Eerste maand gratis, maandelijks opzegbaar.',
      },
    },
    {
      _type: 'page',
      title: 'Over ons',
      slug: {_type: 'slug', current: 'over-ons'},
      intro: 'Dé badmintonclub van Borne — gezellig, fanatiek en voor alle leeftijden.',
      sections: [
        {_type: 'teamSection', _key: key(), eyebrow: 'Ons team', heading: 'Wie je op de baan tegenkomt'},
        {_type: 'honoraryMembersSection', _key: key(), eyebrow: 'Ere-leden', heading: 'De legendes van de club', intro: 'Zonder hen was er geen Badminton Borne. Benoemd door de leden, voor jaren van inzet op en naast de baan.'},
        {_type: 'agendaSection', _key: key(), eyebrow: 'Agenda', heading: 'Binnenkort bij Borne', link: cta('Hele agenda', '/agenda')},
        {_type: 'sponsorsSection', _key: key(), eyebrow: 'Onze sponsors', link: cta('Ook sponsor worden?', '/sponsoring'), joinLabel: 'Jouw logo hier?', joinHref: '/sponsoring'},
        {_type: 'newsletterSection', _key: key(), heading: 'Mis geen smash', body: 'Eén mailtje per maand over toernooien, de nieuwe hal en clubnieuws.', buttonLabel: 'Aanmelden', note: 'Uitschrijven kan altijd met één klik.'},
      ],
      seo: {
        title: 'Over ons — Badminton Borne',
        description: 'Maak kennis met de trainers, het bestuur en de ere-leden van Badminton Borne.',
      },
    },
    {
      _type: 'page',
      title: 'Contact',
      slug: {_type: 'slug', current: 'contact'},
      intro: 'Vragen, proefles plannen of gewoon even kennismaken? We horen graag van je.',
      sections: [
        {_type: 'contactSection', _key: key(), eyebrow: 'Contact', heading: 'Stel je vraag', intro: 'Twijfel je nog, of wil je gewoon een keer komen kijken? Stuur een berichtje — we reageren meestal binnen een dag.'},
        {_type: 'agendaSection', _key: key(), eyebrow: 'Agenda', heading: 'Binnenkort bij Borne', link: cta('Hele agenda', '/agenda')},
      ],
      seo: {
        title: 'Contact — Badminton Borne',
        description: 'Stel je vraag aan Badminton Borne. We reageren meestal binnen een dag.',
      },
    },
  ])

  // ---- Homepage ----------------------------------------------------------
  await client.createIfNotExists({
    _id: 'homePage',
    _type: 'homePage',
    title: 'Homepage',
    language: 'nl',
    sections: [
      {
        _type: 'hero',
        _key: key(),
        eyebrow: 'Badminton in Borne',
        heading: 'De snelste sport van Borne',
        tagline: 'Van eerste keer tot competitie. Alle leeftijden, alle niveaus.',
        primaryCta: cta('Plan je eerste bezoek', '/probeer-gratis'),
        secondaryCta: cta('Bekijk trainingstijden', '/trainingen'),
        microcopy: MICROCOPY,
        videoUrl:
          'https://badmintonverenigingborne.nl/wordpress2/wp-content/uploads/2023/03/Badminton-Borne.mp4',
        rating: {score: 4.8, source: 'op Google', note: 'Alle leeftijden en niveaus'},
      },
      {
        _type: 'featureGrid',
        _key: key(),
        eyebrow: 'Waarom Badminton Borne',
        heading: 'Bij ons speelt iedereen mee',
        features: [
          {_type: 'feature', _key: key(), title: 'Alle leeftijden en niveaus', description: 'Van 8 tot 80. Je stapt in op jouw niveau.'},
          {_type: 'feature', _key: key(), title: 'Gezellig en sociaal', description: 'Na de rally is er altijd tijd voor een praatje.'},
          {_type: 'feature', _key: key(), title: 'Eerste maand gratis', description: 'Kom vrijblijvend proberen. Racket lenen kan.'},
          {_type: 'feature', _key: key(), title: 'Recreatief tot competitie', description: 'Vrij spelen of wedstrijden namens Borne.'},
        ],
      },
      {
        _type: 'sportHighlight',
        _key: key(),
        eyebrow: 'Badminton is cool',
        heading: 'Sneller dan je denkt',
        body:
          'Vergeet het beeld van een campingsport. Badminton is explosief, tactisch en keihard. Wie één rally op tempo speelt, weet genoeg.',
        stats: [
          {_type: 'stat', _key: key(), value: '±450', label: 'kcal per uur*'},
          {_type: 'stat', _key: key(), value: '#1', label: 'snelste racketsport*'},
        ],
        footnote: '*Cijfers checken vóór publicatie.',
      },
      {
        _type: 'announcement',
        _key: key(),
        tag: 'Nieuw',
        heading: 'Splinternieuwe sporthal vanaf augustus',
        body: 'Wij spelen er als eersten. Nieuwe vloer, nieuwe start.',
        link: cta('Meer over de nieuwe hal', '/nieuwe-hal'),
      },
      {
        _type: 'audienceSegments',
        _key: key(),
        eyebrow: 'Vind je plek',
        heading: 'Waar sta jij?',
        segments: [
          {
            _type: 'segment',
            _key: key(),
            title: 'Eerste keer',
            description: 'Nog nooit gespeeld? Begin hier.',
            link: cta('Begin hier', '/probeer-gratis'),
          },
          {
            _type: 'segment',
            _key: key(),
            title: 'Recreatief',
            description: 'Voor de lol en de conditie.',
            link: cta('Speel mee', '/volwassenen'),
          },
          {
            _type: 'segment',
            _key: key(),
            title: 'Competitie',
            description: 'Speel wedstrijden namens Borne.',
            link: cta('Bekijk teams', '/competitie'),
          },
        ],
      },
      {
        _type: 'ctaBanner',
        _key: key(),
        heading: 'Kom een keer langs.\nDe eerste maand is gratis.',
        cta: cta('Plan je eerste bezoek', '/probeer-gratis'),
        microcopy: MICROCOPY,
        theme: 'lime',
        enableGame: false,
      },
      {
        _type: 'trainingTimes',
        _key: key(),
        eyebrow: 'Speelschema',
        heading: 'Trainingstijden',
        link: cta('Alle tijden', '/trainingen'),
      },
      {
        _type: 'agendaSection',
        _key: key(),
        eyebrow: 'Agenda',
        heading: 'Binnenkort bij Borne',
        link: cta('Hele agenda', '/agenda'),
      },
      {
        _type: 'newsSection',
        _key: key(),
        eyebrow: 'Nieuws',
        heading: 'Nieuws van de club',
        link: cta('Al het nieuws', '/nieuws'),
      },
      {
        _type: 'gallery',
        _key: key(),
        eyebrow: 'De club in actie',
        images: [],
      },
      {
        _type: 'testimonials',
        _key: key(),
        eyebrow: 'Google reviews',
        heading: 'Wat leden zeggen',
        reviews: reviewIds.map((id) => ({_type: 'reference', _key: key(), _ref: id})),
      },
      {
        _type: 'faqList',
        _key: key(),
        heading: 'Veelgestelde vragen',
        items: faqIds.map((id) => ({_type: 'reference', _key: key(), _ref: id})),
      },
      {
        _type: 'ctaBanner',
        _key: key(),
        heading: 'Klaar voor je eerste smash?',
        cta: cta('Plan je eerste bezoek', '/probeer-gratis'),
        microcopy: MICROCOPY,
        theme: 'navy',
        enableGame: true,
      },
    ],
    seo: {
      title: 'Badminton Borne — De snelste sport van Borne',
      description:
        'Badmintonvereniging in Borne voor alle leeftijden en niveaus. Eerste maand gratis, geen verplichtingen, maandelijks opzegbaar.',
    },
  })
  console.log('✓ homePage aangemaakt (of bestond al)')

  // ---- Site-instellingen -------------------------------------------------
  await client.createIfNotExists({
    _id: 'siteSettings',
    _type: 'siteSettings',
    mainNav: [
      {...cta('Home', '/'), _key: key()},
      {...cta('Over ons', '/over-ons'), _key: key()},
      {...cta('Badminton', '/badminton'), _key: key()},
      {...cta('Trainingen', '/trainingen'), _key: key()},
      {...cta('Jeugd', '/jeugd'), _key: key()},
      {...cta('Volwassenen', '/volwassenen'), _key: key()},
      {...cta('Competitie', '/competitie'), _key: key()},
      {...cta('Contact', '/contact'), _key: key()},
    ],
    headerSecondaryCta: cta('Lid worden', '/lid-worden'),
    headerPrimaryCta: cta('Plan je eerste bezoek', '/probeer-gratis'),
    announcement: {
      enabled: false,
      text: 'Nieuwe sporthal vanaf augustus — wij spelen er als eersten',
      linkLabel: 'Lees meer',
      link: '/nieuwe-hal',
    },
    phone: '06 81 05 60 15',
    footerTagline:
      'Elke smash telt. Badminton voor heel Borne — van eerste shuttle tot competitie.',
    footerColumns: [
      {
        _type: 'footerColumn',
        _key: key(),
        title: 'Club',
        links: [
          {...cta('Over ons', '/over-ons'), _key: key()},
          {...cta('Badminton', '/badminton'), _key: key()},
          {...cta('Contact', '/contact'), _key: key()},
          {...cta('Sponsoring', '/sponsoring'), _key: key()},
          {...cta('Vertrouwenspersoon', '/vertrouwenspersoon'), _key: key()},
          {...cta('Uitschrijven', '/uitschrijven'), _key: key()},
        ],
      },
      {
        _type: 'footerColumn',
        _key: key(),
        title: 'Spelen',
        links: [
          {...cta('Trainingen', '/trainingen'), _key: key()},
          {...cta('Jeugd', '/jeugd'), _key: key()},
          {...cta('Volwassenen', '/volwassenen'), _key: key()},
          {...cta('Competitie', '/competitie'), _key: key()},
          {...cta('Badminton vs andere sporten', '/badminton-vs-andere-sporten'), _key: key()},
        ],
      },
    ],
    contactTitle: 'Contact',
    // Adressen komen automatisch uit de "Locatie"-documenten
    email: 'info@badmintonborne.nl',
    socialLinks: [
      {...cta('Instagram', '#'), _key: key()},
      {...cta('Facebook', '#'), _key: key()},
      {...cta('Kaart', '#'), _key: key()},
    ],
    legalLinks: [
      {...cta('Privacy', '/privacy'), _key: key()},
      {...cta('Sitemap', '/sitemap.xml'), _key: key()},
    ],
    copyright: '© 2026 Badminton Vereniging Borne',
    stickyBarCta: cta('Plan je eerste bezoek', '/probeer-gratis'),
    stickyBarMicrocopy: MICROCOPY,
    defaultSeo: {
      title: 'Badminton Borne',
      description:
        'Badmintonvereniging in Borne voor alle leeftijden en niveaus. Eerste maand gratis proberen!',
    },
  })
  console.log('✓ siteSettings aangemaakt (of bestond al)')

  // Bestaande site-instellingen: vul de nieuwe velden aan zonder iets te overschrijven
  await client
    .patch('siteSettings')
    .setIfMissing({
      announcement: {
        enabled: false,
        text: 'Nieuwe sporthal vanaf augustus — wij spelen er als eersten',
        linkLabel: 'Lees meer',
        link: '/nieuwe-hal',
      },
      phone: '06 81 05 60 15',
    })
    .commit()
  console.log('✓ siteSettings: aankondigingsbalk + telefoonnummer aangevuld (indien leeg)')

  console.log('\nKlaar! Open de Studio en publiceer/controleer de content.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
