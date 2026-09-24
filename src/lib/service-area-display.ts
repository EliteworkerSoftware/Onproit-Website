// Turns the service-area match list (Admin → Settings, which holds matching
// fragments like "haddon" or "southern nj") into clean, region-grouped place
// names for the public /service-areas page. Known places get a proper name
// and region; anything added in Settings that isn't known here still shows
// up under "More areas", title-cased, so an edit never silently disappears.

type Region = "South Jersey" | "Jersey Shore & Atlantic County" | "Central Jersey" | "Philadelphia & Suburbs" | "Delaware";

export const REGION_ORDER: (Region | "More Areas")[] = [
  "South Jersey",
  "Jersey Shore & Atlantic County",
  "Central Jersey",
  "Philadelphia & Suburbs",
  "Delaware",
  "More Areas",
];

// null = a matching alias or a whole region name, not a place to list.
const PLACES: Record<string, { name: string; region: Region } | null> = {
  camden: { name: "Camden", region: "South Jersey" },
  "cherry hill": { name: "Cherry Hill", region: "South Jersey" },
  voorhees: { name: "Voorhees", region: "South Jersey" },
  haddonfield: { name: "Haddonfield", region: "South Jersey" },
  haddon: null,
  burlington: { name: "Burlington County", region: "South Jersey" },
  "mount laurel": { name: "Mount Laurel", region: "South Jersey" },
  moorestown: { name: "Moorestown", region: "South Jersey" },
  marlton: { name: "Marlton", region: "South Jersey" },
  medford: { name: "Medford", region: "South Jersey" },
  evesham: { name: "Evesham", region: "South Jersey" },
  gloucester: { name: "Gloucester County", region: "South Jersey" },
  deptford: { name: "Deptford", region: "South Jersey" },
  glassboro: { name: "Glassboro", region: "South Jersey" },
  "washington township": { name: "Washington Township", region: "South Jersey" },
  "washington twp": null,
  cumberland: { name: "Cumberland County", region: "South Jersey" },
  vineland: { name: "Vineland", region: "South Jersey" },
  bridgeton: { name: "Bridgeton", region: "South Jersey" },
  salem: { name: "Salem County", region: "South Jersey" },
  pennsville: { name: "Pennsville", region: "South Jersey" },
  "west berlin": { name: "West Berlin", region: "South Jersey" },
  "ocean county": { name: "Ocean County", region: "Jersey Shore & Atlantic County" },
  "toms river": { name: "Toms River", region: "Jersey Shore & Atlantic County" },
  brick: { name: "Brick", region: "Jersey Shore & Atlantic County" },
  lakewood: { name: "Lakewood", region: "Jersey Shore & Atlantic County" },
  "atlantic county": { name: "Atlantic County", region: "Jersey Shore & Atlantic County" },
  "atlantic city": { name: "Atlantic City", region: "Jersey Shore & Atlantic County" },
  "egg harbor": { name: "Egg Harbor", region: "Jersey Shore & Atlantic County" },
  galloway: { name: "Galloway", region: "Jersey Shore & Atlantic County" },
  "cape may": { name: "Cape May", region: "Jersey Shore & Atlantic County" },
  wildwood: { name: "Wildwood", region: "Jersey Shore & Atlantic County" },
  "ocean city": { name: "Ocean City", region: "Jersey Shore & Atlantic County" },
  mercer: { name: "Mercer County", region: "Central Jersey" },
  princeton: { name: "Princeton", region: "Central Jersey" },
  trenton: { name: "Trenton", region: "Central Jersey" },
  hamilton: { name: "Hamilton", region: "Central Jersey" },
  philadelphia: { name: "Philadelphia", region: "Philadelphia & Suburbs" },
  philly: null,
  "bucks county": { name: "Bucks County", region: "Philadelphia & Suburbs" },
  "montgomery county": { name: "Montgomery County", region: "Philadelphia & Suburbs" },
  "delaware county pa": { name: "Delaware County, PA", region: "Philadelphia & Suburbs" },
  "king of prussia": { name: "King of Prussia", region: "Philadelphia & Suburbs" },
  wilmington: { name: "Wilmington", region: "Delaware" },
  "newark de": { name: "Newark, DE", region: "Delaware" },
  "new castle county": { name: "New Castle County", region: "Delaware" },
  delaware: null,
  "south jersey": null,
  "southern nj": null,
  "southern new jersey": null,
};

export interface DisplayPlace {
  name: string;
  term: string;
}

function titleCase(term: string) {
  return term.replace(/\b\w/g, (c) => c.toUpperCase()).replace(/\b(Nj|Pa|De)\b/g, (s) => s.toUpperCase());
}

export function groupServiceArea(inArea: string[]): { region: string; places: DisplayPlace[] }[] {
  const groups = new Map<string, DisplayPlace[]>();
  for (const term of inArea) {
    const known = PLACES[term];
    if (known === null) continue;
    const region = known?.region ?? "More Areas";
    const place = { name: known?.name ?? titleCase(term), term };
    groups.set(region, [...(groups.get(region) ?? []), place]);
  }
  return REGION_ORDER.filter((r) => groups.has(r)).map((region) => ({
    region,
    places: groups.get(region)!.sort((a, b) => a.name.localeCompare(b.name)),
  }));
}
