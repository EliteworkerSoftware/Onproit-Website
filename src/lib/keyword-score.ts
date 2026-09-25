// Opportunity score (0–100): how worth chasing a keyword is, from three
// things multiplied together —
//   demand    how many people search it (local monthly volume, or Search
//             Console appearances when there's no volume)
//   closeness how near page 1 we already rank
//   area      whether it names a place we serve
// Priority is just the score in bands, so High/Medium/Low always mean the
// same thing and the admin can see exactly why a keyword landed where it did.

export type Priority = "high" | "medium" | "low";

export interface ScoreInput {
  searchVolume: number | null;
  impressions: number | null;
  position: number | null;
  region: string | null;
}

export interface Score {
  score: number;
  priority: Priority;
  demand: number;
  closeness: number;
  area: number;
}

export const HIGH_AT = 45;
export const MEDIUM_AT = 25;

// 10 searches → 26 · 100 → 50 · 1,000 → 75 · 10,000+ → 100 (log scale, so
// a handful of huge generic terms don't drown everything else out).
function demandPoints(searches: number): number {
  if (searches <= 0) return 0;
  return Math.min(100, Math.round(25 * Math.log10(1 + searches)));
}

// Page 2 (11–20) is the sweet spot — real ranking, one push from page 1.
// Already on page 1 still counts (moving up gets more clicks) but less.
function closenessFactor(position: number | null): number {
  if (position == null) return 0.6; // not ranking yet: a fresh opportunity
  if (position <= 10) return 0.9;
  if (position <= 20) return 1;
  if (position <= 30) return 0.85;
  if (position <= 50) return 0.6;
  return 0.4;
}

// Out-of-area is never worth pursuing; a keyword naming no place (e.g.
// "managed it services") is still answered with local results by Google.
function areaFactor(region: string | null): number {
  if (region === "out_of_area") return 0;
  if (region === "in_area") return 1;
  return 0.75;
}

export function scoreKeyword(k: ScoreInput): Score {
  const searches = Math.max(k.searchVolume ?? 0, k.impressions ?? 0);
  const demand = demandPoints(searches);
  const closeness = closenessFactor(k.position);
  const area = areaFactor(k.region);
  const score = Math.round(demand * closeness * area);
  const priority: Priority = score >= HIGH_AT ? "high" : score >= MEDIUM_AT ? "medium" : "low";
  return { score, priority, demand, closeness, area };
}
