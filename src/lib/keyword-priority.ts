// Priority from real Search Console numbers: High = real demand and already
// within reach of page 1; Medium = decent demand further out; Low = the rest.
export function computePriority(impressions: number, position: number): "high" | "medium" | "low" {
  if (impressions >= 50 && position <= 30) return "high";
  if (impressions >= 15) return "medium";
  return "low";
}
