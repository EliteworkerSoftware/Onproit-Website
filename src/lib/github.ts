import "server-only";

// Minimal GitHub REST client for reviewing the content agent's pull requests
// from the admin dashboard. GITHUB_TOKEN is a fine-grained token scoped to
// this one repo (Contents + Pull requests: read & write).

const API = "https://api.github.com";

// Only PRs on the content agent's branches can be listed, published, or
// rejected from the dashboard — never an arbitrary PR.
export const CONTENT_AGENT_BRANCH_PREFIX = "content-agent/";

export function isGitHubConfigured(): boolean {
  return Boolean(process.env.GITHUB_TOKEN);
}

function repo() {
  return process.env.GITHUB_REPO || "EliteworkerSoftware/Onproit-Website";
}

export async function gh<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API}/repos/${repo()}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
    },
    cache: "no-store",
  });
  if (res.status === 204) return undefined as T;
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(`GitHub ${res.status}: ${data?.message ?? "request failed"}`);
  }
  return data as T;
}

export interface PullRequest {
  number: number;
  title: string;
  body: string | null;
  html_url: string;
  created_at: string;
  head: { ref: string; sha: string };
  mergeable?: boolean | null;
}

export function isContentAgentPr(pr: PullRequest) {
  return pr.head.ref.startsWith(CONTENT_AGENT_BRANCH_PREFIX);
}

// Vercel's GitHub integration records each branch deploy as a GitHub
// deployment; its latest status carries the preview URL.
export async function getPreviewUrl(sha: string): Promise<string | null> {
  const deployments = await gh<{ id: number }[]>(`/deployments?sha=${sha}&per_page=5`);
  for (const d of deployments) {
    const statuses = await gh<{ state: string; environment_url?: string }[]>(`/deployments/${d.id}/statuses?per_page=1`);
    const latest = statuses[0];
    if (latest?.state === "success" && latest.environment_url) return latest.environment_url;
  }
  return null;
}

// The agent's PR descriptions list each keyword as "**keyword** → ... `/path`".
// Returns the page path written for a keyword, or null if it isn't listed.
export function pathForKeyword(body: string | null, keyword: string): string | null {
  if (!body) return null;
  const line = body.split("\n").find((l) => l.toLowerCase().includes(`**${keyword.toLowerCase()}**`));
  const match = line?.match(/`(\/[a-z0-9\-/]*)`/);
  return match ? match[1] : null;
}

// Every page path the PR description mentions, for the preview links.
export function pathsInBody(body: string | null): string[] {
  if (!body) return [];
  return [...new Set([...body.matchAll(/`(\/[a-z0-9\-/]+)`/g)].map((m) => m[1]))];
}
