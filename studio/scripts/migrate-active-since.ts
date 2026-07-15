/**
 * Eenmalige migratie: teamMember.yearsExperience (aantal jaren) →
 * teamMember.activeSince (startjaartal). De site rekent de jaren ervaring
 * voortaan zelf uit, zodat niemand dit jaarlijks hoeft bij te werken.
 *
 * Draaien:  npm run migrate:active-since
 *           (= sanity exec scripts/migrate-active-since.ts --with-user-token)
 *
 * Idempotent: pakt alleen documenten die nog yearsExperience hebben (incl.
 * concepten, zodat een open concept de oude waarde niet later terugzet).
 * Een al ingevuld activeSince wordt nooit overschreven.
 */
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-02-01'})

async function run() {
  const year = new Date().getFullYear()
  const docs: {_id: string; name?: string; yearsExperience: number; activeSince?: number}[] =
    await client.fetch(
      `*[_type == "teamMember" && defined(yearsExperience)]{_id, name, yearsExperience, activeSince}`,
    )
  if (docs.length === 0) {
    console.log('− niets te migreren (geen teamMember met yearsExperience)')
    return
  }
  for (const doc of docs) {
    const activeSince = doc.activeSince ?? year - doc.yearsExperience
    const patch = client.patch(doc._id).unset(['yearsExperience'])
    if (doc.activeSince == null) patch.set({activeSince})
    await patch.commit()
    console.log(`✓ ${doc.name ?? doc._id}: ${doc.yearsExperience} jaar ervaring → actief sinds ${activeSince}`)
  }
  console.log(`\nKlaar: ${docs.length} teamleden gemigreerd.`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
