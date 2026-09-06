// Search Console only reports the searcher's country, never city/state, so
// there's no way to see location directly. Most local-intent queries embed
// the town right in the text (e.g. "managed it services wayne nj"), so we
// classify from the keyword string itself against the real service area.

const IN_AREA = [
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
const OUT_OF_AREA = [
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

export function classifyKeywordRegion(keyword: string): KeywordRegion {
  const k = keyword.toLowerCase();
  if (IN_AREA.some((t) => k.includes(t))) return "in_area";
  if (OUT_OF_AREA.some((t) => k.includes(t))) return "out_of_area";
  return "unspecified";
}
