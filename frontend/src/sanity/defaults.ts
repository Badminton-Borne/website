import type {
  HomePageData,
  NewsArticleData,
  NewsCardData,
  PageData,
  SiteSettingsData,
} from "./types";

/**
 * Fallback-content: exact de homepage uit de design handoff ("1a").
 * Wordt alleen gebruikt zolang Sanity nog niet gekoppeld/gevuld is, zodat de
 * site altijd rendert. Bron van waarheid ná koppeling: het CMS
 * (studio/scripts/seed.ts zet dezelfde content in Sanity).
 */

const MICROCOPY = "1 maand gratis · geen verplichtingen · maandelijks opzegbaar";

export const HOME_FALLBACK: HomePageData = {
  title: "Homepage",
  sections: [
    {
      _type: "hero",
      _key: "fallback-hero",
      eyebrow: "Badminton in Borne",
      heading: "De snelste sport van Borne",
      tagline: "Van eerste keer tot competitie. Alle leeftijden, alle niveaus.",
      primaryCta: { label: "Plan je eerste bezoek", href: "/probeer-gratis" },
      secondaryCta: { label: "Bekijk trainingstijden", href: "/trainingen" },
      microcopy: MICROCOPY,
      videoUrl:
        "https://badmintonverenigingborne.nl/wordpress2/wp-content/uploads/2023/03/Badminton-Borne.mp4",
      rating: { score: 4.8, source: "op Google", note: "Alle leeftijden en niveaus" },
    },
    {
      _type: "featureGrid",
      _key: "fallback-features",
      eyebrow: "Waarom Badminton Borne",
      heading: "Bij ons speelt iedereen mee",
      features: [
        { _key: "f1", title: "Alle leeftijden en niveaus", description: "Van 8 tot 80. Je stapt in op jouw niveau." },
        { _key: "f2", title: "Gezellig en sociaal", description: "Na de rally is er altijd tijd voor een praatje." },
        { _key: "f3", title: "Eerste maand gratis", description: "Kom vrijblijvend proberen. Racket lenen kan." },
        { _key: "f4", title: "Recreatief tot competitie", description: "Vrij spelen of wedstrijden namens Borne." },
      ],
    },
    {
      _type: "sportHighlight",
      _key: "fallback-cool",
      eyebrow: "Badminton is cool",
      heading: "Sneller dan je denkt",
      body: "Vergeet het beeld van een campingsport. Badminton is explosief, tactisch en keihard. Wie één rally op tempo speelt, weet genoeg.",
      stats: [
        { _key: "s1", value: "±450", label: "kcal per uur*" },
        { _key: "s2", value: "#1", label: "snelste racketsport*" },
      ],
      footnote: "*Cijfers checken vóór publicatie.",
    },
    {
      _type: "announcement",
      _key: "fallback-hal",
      tag: "Nieuw",
      heading: "Splinternieuwe sporthal vanaf augustus",
      body: "Wij spelen er als eersten. Nieuwe vloer, nieuwe start.",
      link: { label: "Meer over de nieuwe hal", href: "/nieuwe-hal" },
    },
    {
      _type: "audienceSegments",
      _key: "fallback-segments",
      eyebrow: "Vind je plek",
      heading: "Waar sta jij?",
      segments: [
        {
          _key: "seg1",
          title: "Eerste keer",
          description: "Nog nooit gespeeld? Begin hier.",
          link: { label: "Begin hier", href: "/probeer-gratis" },
        },
        {
          _key: "seg2",
          title: "Recreatief",
          description: "Voor de lol en de conditie.",
          link: { label: "Speel mee", href: "/volwassenen" },
        },
        {
          _key: "seg3",
          title: "Competitie",
          description: "Speel wedstrijden namens Borne.",
          link: { label: "Bekijk teams", href: "/competitie" },
        },
      ],
    },
    {
      _type: "ctaBanner",
      _key: "fallback-band",
      heading: "Kom een keer langs.\nDe eerste maand is gratis.",
      cta: { label: "Plan je eerste bezoek", href: "/probeer-gratis" },
      microcopy: MICROCOPY,
      theme: "lime",
      enableGame: false,
    },
    {
      _type: "trainingTimes",
      _key: "fallback-tijden",
      eyebrow: "Speelschema",
      heading: "Trainingstijden",
      link: { label: "Alle tijden", href: "/trainingen" },
      rows: (() => {
        const wooldrik = { name: "'t Wooldrik Hal B (nieuwe sporthal)", street: "'t Wooldrik 1", city: "Borne" };
        const hooiberg = { name: "De Hooiberg", street: "Dorsvloer 27", city: "Borne" };
        return [
          { _id: "t1", group: "Jeugd", activity: "training", day: "maandag", startTime: "19:00", endTime: "20:00", location: wooldrik },
          { _id: "t2", group: "Jeugd", activity: "vrij spelen", day: "maandag", startTime: "20:00", endTime: "21:00", location: wooldrik },
          { _id: "t3", group: "Jeugd", day: "donderdag", startTime: "19:00", endTime: "20:00", location: hooiberg },
          { _id: "t4", group: "Volwassenen", activity: "training", day: "maandag", startTime: "20:00", endTime: "21:00", location: wooldrik },
          { _id: "t5", group: "Volwassenen", activity: "vrij spelen", day: "maandag", startTime: "19:00", endTime: "22:00", location: wooldrik },
          { _id: "t6", group: "Volwassenen", activity: "vrij spelen", day: "donderdag", startTime: "20:00", endTime: "21:00", location: hooiberg },
        ];
      })(),
    },
    {
      _type: "gallery",
      _key: "fallback-gallery",
      eyebrow: "De club in actie",
      images: [],
    },
    {
      _type: "testimonials",
      _key: "fallback-reviews",
      eyebrow: "Google reviews",
      heading: "Wat leden zeggen",
      reviews: [
        { _id: "r1", quote: "Superleuke club. Binnen één avond stond ik gewoon mee te spelen.", name: "Sanne", role: "recreant", rating: 5 },
        { _id: "r2", quote: "Onze zoon van 9 gaat elke week met plezier. Goede jeugdtrainers.", name: "Mark", role: "ouder", rating: 5 },
        { _id: "r3", quote: "Fanatiek als je wilt, gezellig als je wilt. Precies goed.", name: "Yasmin", role: "competitie", rating: 5 },
      ],
    },
    {
      _type: "faqList",
      _key: "fallback-faq",
      heading: "Veelgestelde vragen",
      items: [
        {
          _id: "q1",
          question: "Wat kost het?",
          answer:
            "Je eerste maand is gratis. Daarna betaal je een vast bedrag per kwartaal — jeugd goedkoper dan volwassenen. De actuele tarieven staan op de lidmaatschapspagina.",
        },
        {
          _id: "q2",
          question: "Wat moet ik meenemen?",
          answer:
            "Sportkleding en zaalschoenen (geen zwarte zolen). Een racket kun je de eerste weken gratis van ons lenen; shuttles zijn er altijd.",
        },
        {
          _id: "q3",
          question: "Kan ik zomaar langskomen?",
          answer:
            "Ja! Stuur ons vooraf even een berichtje, dan staat er iemand voor je klaar. Je speelt de eerste avond direct mee.",
        },
        {
          _id: "q4",
          question: "Vanaf welke leeftijd?",
          answer:
            "De jeugdtraining is vanaf 8 jaar. Daarboven is er geen grens — bij ons speelt iedereen van 8 tot 80 mee.",
        },
        {
          _id: "q5",
          question: "Heb ik een eigen groep nodig?",
          answer:
            "Nee, je kunt gewoon alleen komen. We delen je in op niveau en je speelt meteen wisselende partijen mee.",
        },
      ],
    },
    {
      _type: "ctaBanner",
      _key: "fallback-final",
      heading: "Klaar voor je eerste smash?",
      cta: { label: "Plan je eerste bezoek", href: "/probeer-gratis" },
      microcopy: MICROCOPY,
      theme: "navy",
      enableGame: true,
    },
  ],
  seo: {
    title: "Badminton Borne — De snelste sport van Borne",
    description:
      "Badmintonvereniging in Borne voor alle leeftijden en niveaus. Eerste maand gratis, geen verplichtingen, maandelijks opzegbaar.",
  },
};

export const SETTINGS_FALLBACK: SiteSettingsData = {
  mainNav: [
    { _key: "n1", label: "Over ons", href: "/over-ons" },
    { _key: "n2", label: "Badminton", href: "/badminton" },
    { _key: "n3", label: "Trainingen", href: "/trainingen" },
    { _key: "n4", label: "Jeugd", href: "/jeugd" },
    { _key: "n5", label: "Volwassenen", href: "/volwassenen" },
    { _key: "n6", label: "Competitie", href: "/competitie" },
    { _key: "n7", label: "Contact", href: "/contact" },
  ],
  headerSecondaryCta: { label: "Lid worden", href: "/lid-worden" },
  headerPrimaryCta: { label: "Plan je eerste bezoek", href: "/probeer-gratis" },
  footerTagline:
    "Elke smash telt. Badminton voor heel Borne — van eerste shuttle tot competitie.",
  footerColumns: [
    {
      _key: "c1",
      title: "Club",
      links: [
        { _key: "l1", label: "Over ons", href: "/over-ons" },
        { _key: "l2", label: "Badminton", href: "/badminton" },
        { _key: "l3", label: "Contact", href: "/contact" },
        { _key: "l4", label: "Sponsoring", href: "/sponsoring" },
        { _key: "l5", label: "Vertrouwenspersoon", href: "/vertrouwenspersoon" },
        { _key: "l6", label: "Uitschrijven", href: "/uitschrijven" },
      ],
    },
    {
      _key: "c2",
      title: "Spelen",
      links: [
        { _key: "l7", label: "Trainingen", href: "/trainingen" },
        { _key: "l8", label: "Jeugd", href: "/jeugd" },
        { _key: "l9", label: "Volwassenen", href: "/volwassenen" },
        { _key: "l10", label: "Competitie", href: "/competitie" },
        { _key: "l11", label: "Badminton vs andere sporten", href: "/badminton-vs-andere-sporten" },
      ],
    },
  ],
  announcement: {
    enabled: false,
    text: "Nieuwe sporthal vanaf augustus — wij spelen er als eersten",
    linkLabel: "Lees meer",
    link: "/nieuwe-hal",
  },
  playTimes: "Maandag 19:00 – 22:00 · Donderdag 19:00 – 21:00",
  contactTitle: "Contact",
  addressLines: "Nieuwe sporthal Borne\n[adres volgt — vanaf augustus]",
  email: "info@badmintonborne.nl",
  socialLinks: [
    { _key: "s1", label: "Instagram", href: "#" },
    { _key: "s2", label: "Facebook", href: "#" },
    { _key: "s3", label: "Kaart", href: "#" },
  ],
  legalLinks: [
    { _key: "p1", label: "Privacy", href: "/privacy" },
    { _key: "p2", label: "Sitemap", href: "/sitemap.xml" },
  ],
  copyright: "© 2026 Badminton Vereniging Borne",
  stickyBarCta: { label: "Plan je eerste bezoek", href: "/probeer-gratis" },
  stickyBarMicrocopy: MICROCOPY,
  defaultSeo: {
    title: "Badminton Borne",
    description:
      "Badmintonvereniging in Borne voor alle leeftijden en niveaus. Eerste maand gratis proberen!",
  },
};

/* ==========================================================================
   Componenten-handoff (artboards 4a–4f, 5a): fallback-subpagina's met exact
   de designcontent, zolang Sanity nog niet gekoppeld/geseed is.
   ⚠ Prijzen en vergelijkingscijfers zijn illustratief — club vult echte
   waarden in via Sanity (voetnoten staan er al).
   ========================================================================== */

const CONTACT_SETTINGS = {
  email: SETTINGS_FALLBACK.email,
  addressLines: SETTINGS_FALLBACK.addressLines,
  playTimes: SETTINGS_FALLBACK.playTimes,
  socialLinks: [
    { _key: "s1", label: "Instagram", href: "#" },
    { _key: "s2", label: "Facebook", href: "#" },
  ],
};

export const PAGE_FALLBACKS: Record<string, PageData> = {
  lidmaatschap: {
    title: "Lidmaatschap",
    slug: "lidmaatschap",
    intro: "Kies het pakket dat bij je past — overstappen kan altijd.",
    sections: [
      {
        _type: "pricingSection",
        _key: "fallback-pricing",
        eyebrow: "Lidmaatschap",
        heading: "Kies je pakket",
        intro:
          "Altijd inclusief shuttles en begeleiding. Eerste maand gratis, daarna per kwartaal — maandelijks opzegbaar.",
        packages: [
          {
            _id: "pkg-jeugd",
            title: "Jeugd",
            description: "Tot 18 jaar. Training met leeftijdsgenoten.",
            price: 36,
            priceSuffix: "per kwartaal*",
            features: [
              "Wekelijkse jeugdtraining",
              "Racket lenen kan altijd",
              "Jeugdtoernooien en clubactiviteiten",
            ],
            highlighted: false,
            ctaLabel: "Kies Jeugd",
            ctaHref: "/lid-worden",
          },
          {
            _id: "pkg-recreatief",
            title: "Recreatief",
            description: "Volwassenen. Vrij spelen op vaste avonden.",
            price: 48,
            priceSuffix: "per kwartaal*",
            features: [
              "Elke week vrij spelen",
              "Shuttles inbegrepen",
              "Gezellige derde helft",
              "Clubtoernooien en activiteiten",
            ],
            highlighted: true,
            highlightLabel: "Meest gekozen",
            ctaLabel: "Kies Recreatief",
            ctaHref: "/lid-worden",
          },
          {
            _id: "pkg-competitie",
            title: "Competitie",
            description: "Training én wedstrijden namens Borne.",
            price: 66,
            priceSuffix: "per kwartaal*",
            features: [
              "Alles uit Recreatief",
              "Wekelijkse competitietraining",
              "Bondscontributie inbegrepen",
            ],
            highlighted: false,
            ctaLabel: "Kies Competitie",
            ctaHref: "/lid-worden",
          },
        ],
        footnote:
          "*Bedragen ter illustratie — actuele tarieven checken vóór publicatie. Eerste maand altijd gratis.",
      },
      {
        _type: "comparisonSection",
        _key: "fallback-comparison",
        eyebrow: "Badminton vs andere sporten",
        heading: "Waarom badminton wint",
        columns: [
          { _key: "col1", label: "Badminton", highlighted: true },
          { _key: "col2", label: "Tennis", highlighted: false },
          { _key: "col3", label: "Padel", highlighted: false },
        ],
        rows: [
          { _key: "row1", label: "Topsnelheid", values: ["±400 km/u*", "±250 km/u", "±180 km/u"] },
          {
            _key: "row2",
            label: "Hele jaar binnen spelen",
            values: ["✓", "Seizoensgebonden", "Vaak buiten"],
          },
          {
            _key: "row3",
            label: "Instapkosten",
            values: ["Laag — racket lenen kan", "Middel", "Middel"],
          },
          {
            _key: "row4",
            label: "Direct meespelen als beginner",
            values: ["✓ Eerste avond al", "Lessen nodig", "Snel te leren"],
          },
          {
            _key: "row5",
            label: "In Borne, zonder wachtlijst",
            values: ["✓", "—", "Wachtlijsten"],
          },
        ],
        footnote: "*Cijfers ter illustratie — checken vóór publicatie.",
        ctaLabel: "Probeer het zelf gratis",
        ctaLink: "/probeer-gratis",
      },
      {
        _type: "newsletterSection",
        _key: "fallback-newsletter",
        heading: "Mis geen smash",
        body: "Eén mailtje per maand over toernooien, de nieuwe hal en clubnieuws.",
        buttonLabel: "Aanmelden",
        note: "Uitschrijven kan altijd met één klik.",
      },
    ],
    seo: {
      title: "Lidmaatschap — Badminton Borne",
      description:
        "Kies je pakket bij Badminton Borne: jeugd, recreatief of competitie. Eerste maand gratis, maandelijks opzegbaar.",
    },
  },
  "over-ons": {
    title: "Over ons",
    slug: "over-ons",
    intro:
      "Dé badmintonclub van Borne — gezellig, fanatiek en voor alle leeftijden.",
    sections: [
      {
        _type: "teamSection",
        _key: "fallback-team",
        eyebrow: "Ons team",
        heading: "Wie je op de baan tegenkomt",
        trainers: [
          { _id: "tm-1", name: "Sem Gombert", role: "Trainer", group: "trainer" },
        ],
        board: [
          { _id: "bm-1", name: "Diederik", role: "Voorzitter", group: "bestuur" },
          { _id: "bm-2", name: "Max", role: "Secretaris", group: "bestuur" },
          { _id: "bm-3", name: "Lukas", role: "Penningmeester", group: "bestuur" },
          { _id: "bm-4", name: "Vincent Eidhof", role: "Algemeen bestuurslid", group: "bestuur" },
          { _id: "bm-5", name: "Mitchell Bollemeijer", role: "Competitieleider", group: "bestuur" },
          { _id: "bm-6", name: "Roelie", role: "Vertrouwenspersoon", group: "bestuur" },
        ],
      },
      {
        _type: "honoraryMembersSection",
        _key: "fallback-ereleden",
        eyebrow: "Ere-leden",
        heading: "De legendes van de club",
        intro:
          "Zonder hen was er geen Badminton Borne. Benoemd door de leden, voor jaren van inzet op en naast de baan.",
        members: [
          {
            _id: "ere-1",
            name: "Naam Erelid",
            memberSince: 1998,
            contribution:
              "Medeoprichter van de club en 25 jaar lang de motor achter de jeugdafdeling.",
          },
          {
            _id: "ere-2",
            name: "Naam Erelid",
            memberSince: 2005,
            contribution:
              "Decennialang competitieleider en nog altijd elke maandag in de hal te vinden.",
          },
          {
            _id: "ere-3",
            name: "Naam Erelid",
            memberSince: 2012,
            contribution:
              "Het gezicht van de gezelligheid — organiseerde jarenlang alle clubtoernooien.",
          },
        ],
      },
      {
        _type: "agendaSection",
        _key: "fallback-agenda",
        eyebrow: "Agenda",
        heading: "Binnenkort bij Borne",
        link: { label: "Hele agenda", href: "/agenda" },
        events: [
          {
            _id: "ev-1",
            title: "Opening nieuwe sporthal",
            description: "Feestelijke eerste speelavond — iedereen welkom, racket lenen kan.",
            date: "2026-08-15T19:00:00Z",
            ctaLabel: "Ik kom",
            ctaLink: "/contact",
            featured: false,
          },
          {
            _id: "ev-2",
            title: "Start competitieseizoen",
            description: "Eerste thuiswedstrijden — kom aanmoedigen.",
            date: "2026-09-05T19:00:00Z",
            ctaLabel: "Programma",
            ctaLink: "/competitie",
            featured: false,
          },
          {
            _id: "ev-3",
            title: "Open toernooi voor niet-leden",
            description: "Neem een vriend mee — team van 2, iedereen kan meedoen.",
            date: "2026-09-27T10:00:00Z",
            ctaLabel: "Doe mee",
            ctaLink: "/contact",
            featured: true,
          },
        ],
      },
      {
        _type: "sponsorsSection",
        _key: "fallback-sponsors",
        eyebrow: "Onze sponsors",
        link: { label: "Ook sponsor worden?", href: "/sponsoring" },
        joinLabel: "Jouw logo hier?",
        joinHref: "/sponsoring",
        sponsors: [
          { _id: "sp-1", name: "Sponsor 1" },
          { _id: "sp-2", name: "Sponsor 2" },
          { _id: "sp-3", name: "Sponsor 3" },
          { _id: "sp-4", name: "Sponsor 4" },
        ],
      },
      {
        _type: "newsletterSection",
        _key: "fallback-newsletter",
        heading: "Mis geen smash",
        body: "Eén mailtje per maand over toernooien, de nieuwe hal en clubnieuws.",
        buttonLabel: "Aanmelden",
        note: "Uitschrijven kan altijd met één klik.",
      },
    ],
    seo: {
      title: "Over ons — Badminton Borne",
      description:
        "Maak kennis met de trainers, het bestuur en de ere-leden van Badminton Borne.",
    },
  },
  contact: {
    title: "Contact",
    slug: "contact",
    intro: "Vragen, proefles plannen of gewoon even kennismaken? We horen graag van je.",
    sections: [
      {
        _type: "contactSection",
        _key: "fallback-contact",
        eyebrow: "Contact",
        heading: "Stel je vraag",
        intro:
          "Twijfel je nog, of wil je gewoon een keer komen kijken? Stuur een berichtje — we reageren meestal binnen een dag.",
        settings: CONTACT_SETTINGS,
      },
      {
        _type: "agendaSection",
        _key: "fallback-agenda",
        eyebrow: "Agenda",
        heading: "Binnenkort bij Borne",
        link: { label: "Hele agenda", href: "/agenda" },
        events: [
          {
            _id: "ev-1",
            title: "Opening nieuwe sporthal",
            description: "Feestelijke eerste speelavond — iedereen welkom, racket lenen kan.",
            date: "2026-08-15T19:00:00Z",
            ctaLabel: "Ik kom",
            ctaLink: "/contact",
            featured: false,
          },
        ],
      },
    ],
    seo: {
      title: "Contact — Badminton Borne",
      description:
        "Stel je vraag aan Badminton Borne. We reageren meestal binnen een dag.",
    },
  },
};

/* ---- Nieuws (NL-only) — voorbeeldberichten tot Sanity gevuld is -------- */

const NEWS_BODY_INTRO = (text: string) => [
  {
    _type: "block",
    _key: "b1",
    style: "normal",
    children: [{ _type: "span", _key: "sp1", text, marks: [] }],
    markDefs: [],
  },
];

export const NEWS_FALLBACK: NewsArticleData[] = [
  {
    _id: "news-1",
    title: "Wij openen de nieuwe sporthal",
    slug: "wij-openen-de-nieuwe-sporthal",
    publishedAt: "2026-07-01T09:00:00Z",
    excerpt:
      "Vanaf augustus spelen we als eersten in de splinternieuwe hal van Borne. Kom kijken op de feestelijke openingsavond.",
    category: "Club",
    featured: true,
    body: NEWS_BODY_INTRO(
      "Vanaf augustus spelen we als eersten in de splinternieuwe sporthal van Borne. Nieuwe vloer, nieuwe verlichting en eindelijk ruimte voor iedereen. Op de openingsavond is iedereen welkom — racket lenen kan, shuttles liggen klaar. [Voorbeeldbericht — vervang via Sanity.]",
    ),
  },
  {
    _id: "news-2",
    title: "Competitieseizoen start in september",
    slug: "competitieseizoen-start-in-september",
    publishedAt: "2026-06-20T09:00:00Z",
    excerpt:
      "Onze teams staan klaar voor het nieuwe seizoen. Kom aanmoedigen bij de eerste thuiswedstrijden.",
    category: "Competitie",
    featured: false,
    body: NEWS_BODY_INTRO(
      "In september beginnen de eerste thuiswedstrijden van het nieuwe competitieseizoen. Publiek is meer dan welkom — de koffie staat klaar. [Voorbeeldbericht — vervang via Sanity.]",
    ),
  },
  {
    _id: "news-3",
    title: "Jeugdtoernooi groot succes",
    slug: "jeugdtoernooi-groot-succes",
    publishedAt: "2026-06-05T09:00:00Z",
    excerpt:
      "Ruim dertig kinderen sloegen hun eerste smashes tijdens het jaarlijkse jeugdtoernooi.",
    category: "Jeugd",
    featured: false,
    body: NEWS_BODY_INTRO(
      "Ruim dertig kinderen deden mee aan het jaarlijkse jeugdtoernooi. Van eerste shuttle tot finale-rally: de zaal stond vol energie. [Voorbeeldbericht — vervang via Sanity.]",
    ),
  },
];

export const NEWS_LIST_FALLBACK: NewsCardData[] = NEWS_FALLBACK.map(
  (article) => {
    const card = { ...article };
    delete card.body;
    return card as NewsCardData;
  },
);
