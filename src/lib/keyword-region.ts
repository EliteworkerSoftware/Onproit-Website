// Search Console only reports the searcher's country, never city/state, so
// there's no way to see location directly. Most local-intent queries embed
// the town right in the text (e.g. "managed it services wayne nj"), so we
// classify from the keyword string itself against the real service area.

// These are the defaults. The live lists are editable in Admin → Settings →
// Service Area (stored in app_settings, see service-area.ts); these apply
// until someone saves there, and as a fallback if the database is unreachable.
export const DEFAULT_IN_AREA = [
  "camden", "cherry hill", "voorhees", "haddonfield", "haddon",
  "burlington", "mount laurel", "moorestown", "marlton", "medford", "evesham",
  "gloucester", "deptford", "glassboro", "washington twp", "washington township",
  "ocean county", "toms river", "brick", "lakewood",
  "atlantic city", "egg harbor", "galloway", "atlantic county",
  "cumberland", "vineland", "bridgeton",
  "cape may", "wildwood", "ocean city",
  "salem", "pennsville",
  "mercer", "princeton", "trenton", "hamilton",
  "philadelphia", "philly", "bucks county", "montgomery county", "delaware county pa", "king of prussia",
  "wilmington", "newark de", "new castle county", "delaware",
  "south jersey", "southern nj", "southern new jersey",
];

// Known North/Central Jersey towns and counties, outside the real service
// area. Not exhaustive — new ones can show up as the sync runs — but covers
// the major North Jersey cities plus everything seen so far.
export const DEFAULT_OUT_OF_AREA = [
  "bergen", "hackensack", "paramus", "fort lee", "teaneck", "bergenfield",
  "essex county", "newark", "montclair", "livingston", "west orange", "bloomfield", "nutley", "fairfield",
  "hudson county", "jersey city", "hoboken", "union city", "bayonne", "kearny", "west new york",
  "passaic", "clifton", "paterson", "wayne",
  "morris county", "morristown", "parsippany", "denville", "randolph",
  "union county", "elizabeth", "linden", "plainfield", "westfield",
  "somerset county", "somerville", "franklin township",
  "sussex county", "sandyston", "newton nj",
  "warren county nj", "hunterdon county",
  "north jersey", "northern nj", "northern new jersey",
  "middlesex county", "edison", "woodbridge", "new brunswick",
];

export type KeywordRegion = "in_area" | "out_of_area" | "unspecified";

export interface ServiceArea {
  inArea: string[];
  outOfArea: string[];
}

export const DEFAULT_SERVICE_AREA: ServiceArea = { inArea: DEFAULT_IN_AREA, outOfArea: DEFAULT_OUT_OF_AREA };

// A keyword is in-area if it contains any in-area term (checked first, so
// "newark de" wins over "newark"), out-of-area if it contains an out-of-area
// term, and unspecified if it names no known place.
export function classifyKeywordRegion(keyword: string, area: ServiceArea = DEFAULT_SERVICE_AREA): KeywordRegion {
  const k = keyword.toLowerCase();
  if (area.inArea.some((t) => k.includes(t))) return "in_area";
  if (area.outOfArea.some((t) => k.includes(t))) return "out_of_area";
  return "unspecified";
}

// Settings textarea <-> list: one place per line (commas also work),
// lowercased, blanks and duplicates dropped.
export function parseAreaList(text: string): string[] {
  return [...new Set(text.split(/[\n,]/).map((t) => t.trim().toLowerCase()).filter(Boolean))];
}
