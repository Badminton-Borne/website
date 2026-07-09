/**
 * Werkt de teamleden bij met de echte namen, rollen en foto's van
 * Badminton Borne (bron: badmintonverenigingborne.nl/wie-zijn-wij).
 *
 * Draaien:  npm run seed:team   (= sanity exec scripts/seed-team.ts --with-user-token)
 *
 * Idempotent en veilig om opnieuw te draaien:
 *  - Bestaande "Teamlid"-documenten worden per rol (+ groep) gematcht en
 *    bijgewerkt: de echte naam wordt gezet en de fictieve "jaren ervaring"
 *    uit de seed wordt gewist. Bestaat de rol nog niet, dan wordt het
 *    document aangemaakt.
 *  - Foto's worden alléén ge-upload als het teamlid nog geen foto heeft,
 *    zodat een handmatige upload in de Studio nooit overschreven wordt.
 *  - Overgebleven seed-placeholders ("Naam Bestuurslid" / "Naam Trainer")
 *    zonder echte naam worden opgeruimd, zodat er geen nep-kaarten live
 *    blijven staan. Een placeholder die in de Studio al een echte naam
 *    heeft gekregen, blijft ongemoeid.
 *
 * Werkt op gepubliceerde documenten (net als scripts/seed.ts).
 */
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-02-01'})

const UPLOADS = 'https://badmintonverenigingborne.nl/wordpress2/wp-content/uploads'

type Person = {
  role: string
  name: string
  group: 'bestuur' | 'trainer'
  sortOrder: number
  /** Foto-URL's, volledige resolutie eerst, verkleinde variant als fallback. */
  photo?: {urls: string[]; alt: string}
}

// Publiek bekend via wie-zijn-wij. Trainers: alleen Sem is bekend; overige
// trainers/bestuursrollen kan de club later in de Studio toevoegen.
const TEAM: Person[] = [
  {
    group: 'bestuur',
    role: 'Voorzitter',
    name: 'Diederik',
    sortOrder: 0,
    photo: {
      alt: 'Diederik, voorzitter van Badminton Borne',
      urls: [
        `${UPLOADS}/2025/06/WhatsApp-Image-2025-06-18-at-19.38.43.jpeg`,
        `${UPLOADS}/2025/06/WhatsApp-Image-2025-06-18-at-19.38.43-271x300.jpeg`,
      ],
    },
  },
  {
    group: 'bestuur',
    role: 'Secretaris',
    name: 'Max',
    sortOrder: 1,
    photo: {
      alt: 'Max, secretaris van Badminton Borne',
      urls: [
        `${UPLOADS}/2025/09/1599746134888-1.jpeg`,
        `${UPLOADS}/2025/09/1599746134888-1-300x300.jpeg`,
      ],
    },
  },
  {group: 'bestuur', role: 'Penningmeester', name: 'Lukas', sortOrder: 2},
  {group: 'bestuur', role: 'Algemeen bestuurslid', name: 'Vincent Eidhof', sortOrder: 3},
  {group: 'bestuur', role: 'Competitieleider', name: 'Mitchell Bollemeijer', sortOrder: 4},
  {
    group: 'bestuur',
    role: 'Vertrouwenspersoon',
    name: 'Roelie',
    sortOrder: 5,
    photo: {
      alt: 'Roelie, vertrouwenspersoon van Badminton Borne',
      urls: [`${UPLOADS}/2022/06/0001_Roelie.jpg`],
    },
  },
  {group: 'trainer', role: 'Trainer', name: 'Sem Gombert', sortOrder: 0},
]

// Seed-placeholders die verwijderd mogen worden als ze niet met een echte
// naam zijn ingevuld.
const PLACEHOLDER_NAMES = ['Naam Bestuurslid', 'Naam Trainer']

type ImageValue = {
  _type: 'image'
  alt: string
  asset: {_type: 'reference'; _ref: string}
}

/** Haalt de eerste werkende foto-URL op en upload die als Sanity-asset. */
async function uploadPhoto(person: Person): Promise<ImageValue | null> {
  if (!person.photo) return null
  for (const url of person.photo.urls) {
    try {
      const res = await fetch(url)
      if (!res.ok) continue
      const buffer = Buffer.from(await res.arrayBuffer())
      const filename = url.split('/').pop() || `${person.name}.jpg`
      const asset = await client.assets.upload('image', buffer, {filename})
      return {_type: 'image', alt: person.photo.alt, asset: {_type: 'reference', _ref: asset._id}}
    } catch (err) {
      console.warn(`  ! foto ophalen mislukt (${url}): ${(err as Error).message}`)
    }
  }
  console.warn(`  ! geen foto kunnen uploaden voor ${person.name}`)
  return null
}

async function run() {
  const keptIds: string[] = []

  for (const person of TEAM) {
    const existing: {_id: string; hasPhoto: boolean} | null = await client.fetch(
      `*[_type == "teamMember" && group == $group && role == $role && !(_id in path("drafts.**"))][0]{
        _id, "hasPhoto": defined(photo.asset)
      }`,
      {group: person.group, role: person.role},
    )

    if (existing) {
      const patch = client
        .patch(existing._id)
        .set({name: person.name, sortOrder: person.sortOrder})
        .unset(['yearsExperience'])
      if (person.photo && !existing.hasPhoto) {
        const image = await uploadPhoto(person)
        if (image) patch.set({photo: image})
      }
      await patch.commit()
      keptIds.push(existing._id)
      console.log(`✓ bijgewerkt: ${person.name} — ${person.role}`)
    } else {
      const doc: {_type: 'teamMember'; name: string; role: string; group: string; sortOrder: number; photo?: ImageValue} = {
        _type: 'teamMember',
        name: person.name,
        role: person.role,
        group: person.group,
        sortOrder: person.sortOrder,
      }
      if (person.photo) {
        const image = await uploadPhoto(person)
        if (image) doc.photo = image
      }
      const created = await client.create(doc)
      keptIds.push(created._id)
      console.log(`＋ aangemaakt: ${person.name} — ${person.role}`)
    }
  }

  // Overgebleven seed-placeholders opruimen (alleen nog niet ingevulde).
  const stale: {_id: string; role?: string}[] = await client.fetch(
    `*[_type == "teamMember" && name in $names && !(_id in $keep) && !(_id in path("drafts.**"))]{_id, role}`,
    {names: PLACEHOLDER_NAMES, keep: keptIds},
  )
  for (const doc of stale) {
    await client.delete(doc._id)
    console.log(`🗑  verwijderd: lege placeholder — ${doc.role ?? doc._id}`)
  }
  if (stale.length === 0) console.log('− geen lege placeholders om op te ruimen')

  console.log('\nKlaar! Controleer en publiceer het team in de Studio.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
