// How a buyer would phrase each service in a search — used to build the
// starting phrases for DataForSEO keyword research ("<phrase> <town>").
// Client-safe: the Find new keywords panel shows these as the service picker.
export const RESEARCH_SERVICES: { slug: string; label: string; phrase: string }[] = [
  { slug: "managed-it", label: "Managed IT Services", phrase: "managed it services" },
  { slug: "it-support", label: "IT Help Desk / Support", phrase: "it support" },
  { slug: "cybersecurity", label: "Cybersecurity", phrase: "cybersecurity services" },
  { slug: "network-wifi", label: "Network & WiFi", phrase: "business wifi installation" },
  { slug: "cloud", label: "Cloud Solutions", phrase: "cloud services" },
  { slug: "backup-recovery", label: "Data Backup & Recovery", phrase: "data backup services" },
  { slug: "cabling", label: "Structured Cabling", phrase: "network cabling" },
  { slug: "av-integration", label: "AV & Conference Rooms", phrase: "conference room av installation" },
  { slug: "security-cameras", label: "Security Cameras", phrase: "security camera installation" },
  { slug: "entry-access-control", label: "Access Control", phrase: "access control systems" },
  { slug: "consulting", label: "IT Consulting", phrase: "it consulting" },
  { slug: "voip", label: "VoIP Phone Systems", phrase: "business phone system" },
  { slug: "ai-integration", label: "AI Integration", phrase: "ai consulting for small business" },
];

// Where a keyword came from, as shown on the dashboard.
export const KEYWORD_SOURCE_LABEL: Record<string, string> = {
  search_console: "from Search Console",
  dataforseo: "from DataForSEO research",
  agent: "from DataForSEO research (agent)",
  manual: "added by you",
};
