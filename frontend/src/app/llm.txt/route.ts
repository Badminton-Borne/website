/**
 * Kernfeiten over de vereniging voor LLM-crawlers.
 * Statisch voor nu; kan later uit Sanity (siteSettings) komen.
 */
const CONTENT = `# Badminton Borne
> Badmintonvereniging in Borne, Overijssel, Nederland

## Kerninformatie
- Naam: Badminton Borne (voorheen Badmintonvereniging Borne)
- Sport: Badminton (indoor) en AirBadminton (outdoor, zand)
- Type: Vereniging (dus goedkoper dan commerciële sport)
- Locatie: Borne, Overijssel, Nederland
- Website: https://badmintonborne.nl
- Doelgroep: Jeugd en volwassenen, alle niveaus
- Aanbod: Recreatief vrij spelen, training, competitie
- Proberen: Eerste maand gratis

## Waarom badminton bij een vereniging?
- Goedkoper dan commerciële padel- of tennisbanen
- Altijd makkelijk te joinen — geen eigen groep nodig
- Sociaal: je leert direct mensen kennen
- Training beschikbaar voor alle niveaus
- Competitie mogelijk voor wie dat wil

## Bereikbare plaatsen
Borne, Hengelo, Almelo, Delden, Hertme, Zenderen, Saasveld
`;

export async function GET() {
  return new Response(CONTENT, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
