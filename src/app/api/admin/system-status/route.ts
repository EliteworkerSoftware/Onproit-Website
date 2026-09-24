import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/current-admin";
import { isMailerConfigured } from "@/lib/mailer";
import { getSettings, parseNotificationEmails } from "@/lib/get-settings";
import { gh, isGitHubConfigured } from "@/lib/github";
import { isDataForSeoConfigured } from "@/lib/dataforseo";
import { isSearchConsoleConfigured } from "@/lib/search-console";
import { isIndexNowConfigured } from "@/lib/indexnow";

type Check = { name: string; ok: boolean; detail: string; optional?: boolean };

// Live checks that each integration's credentials actually work — not just
// that the env var exists — without side effects: Mailgun uses test mode
// (accepted, never delivered), Turnstile is asked to verify a dummy token
// (its error code says whether the *secret* was the problem), GitHub and
// DataForSEO are read-only calls.
async function checkMailgun(): Promise<Check> {
  const name = "Email sending (Mailgun)";
  if (!isMailerConfigured()) return { name, ok: false, detail: "MAILGUN_API_KEY or MAILGUN_DOMAIN is missing" };
  const settings = await getSettings();
  const to = parseNotificationEmails(settings.contact_notification_emails)[0];
  if (!to) return { name, ok: false, detail: "No notification email set in Settings" };

  const body = new URLSearchParams({
    from: process.env.CONTACT_FROM_EMAIL || `ONPRO IT Website <postmaster@${process.env.MAILGUN_DOMAIN}>`,
    to,
    subject: "System status check",
    text: "Test mode — never delivered.",
    "o:testmode": "yes",
  });
  const res = await fetch(`https://api.mailgun.net/v3/${process.env.MAILGUN_DOMAIN}/messages`, {
    method: "POST",
    headers: { Authorization: `Basic ${Buffer.from(`api:${process.env.MAILGUN_API_KEY}`).toString("base64")}` },
    body,
  });
  if (res.ok) return { name, ok: true, detail: `Working — notifications go to ${settings.contact_notification_emails}` };
  if (res.status === 401 || res.status === 403) return { name, ok: false, detail: "Mailgun rejected the API key" };
  return { name, ok: false, detail: `Mailgun returned ${res.status}` };
}

async function checkTurnstile(): Promise<Check> {
  const name = "Contact form spam protection (Turnstile)";
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return { name, ok: false, detail: "TURNSTILE_SECRET_KEY is missing — the contact form rejects every submission" };
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret, response: "system-status-check" }),
  });
  const data = await res.json().catch(() => ({}));
  const codes: string[] = data["error-codes"] ?? [];
  if (codes.includes("invalid-input-secret") || codes.includes("missing-input-secret")) {
    return { name, ok: false, detail: "Cloudflare rejected the secret key — the contact form rejects every submission" };
  }
  if (!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) {
    return { name, ok: false, detail: "NEXT_PUBLIC_TURNSTILE_SITE_KEY is missing" };
  }
  return { name, ok: true, detail: "Working — Cloudflare accepted the secret key" };
}

async function checkGitHub(): Promise<Check> {
  const name = "Publish button for website changes (GitHub)";
  if (!isGitHubConfigured()) return { name, ok: false, detail: "GITHUB_TOKEN is missing" };
  try {
    await gh("/pulls?state=open&per_page=1");
    return { name, ok: true, detail: "Working — connected to the website repo" };
  } catch (err) {
    return { name, ok: false, detail: err instanceof Error ? err.message : "GitHub request failed" };
  }
}

async function checkDataForSeo(): Promise<Check> {
  const name = "Keyword search volumes (DataForSEO)";
  if (!isDataForSeoConfigured()) return { name, ok: false, optional: true, detail: "Not connected (optional)" };
  const auth = Buffer.from(`${process.env.DATAFORSEO_LOGIN}:${process.env.DATAFORSEO_PASSWORD}`).toString("base64");
  const res = await fetch("https://api.dataforseo.com/v3/appendix/user_data", { headers: { Authorization: `Basic ${auth}` } });
  const data = await res.json().catch(() => null);
  const balance = data?.tasks?.[0]?.result?.[0]?.money?.balance;
  if (!res.ok || data?.status_code !== 20000) return { name, ok: false, detail: "DataForSEO rejected the login" };
  return { name, ok: true, detail: typeof balance === "number" ? `Working — balance $${balance.toFixed(2)}` : "Working" };
}

function present(name: string, ok: boolean, missing: string, optional = false): Check {
  return { name, ok, optional, detail: ok ? "Configured" : missing };
}

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const safe = (fn: () => Promise<Check>, name: string) =>
    fn().catch((err): Check => ({ name, ok: false, detail: err instanceof Error ? err.message : "Check failed" }));

  const checks = await Promise.all([
    safe(checkMailgun, "Email sending (Mailgun)"),
    safe(checkTurnstile, "Contact form spam protection (Turnstile)"),
    safe(checkGitHub, "Publish button for website changes (GitHub)"),
    safe(checkDataForSeo, "Keyword search volumes (DataForSEO)"),
  ]);

  checks.push(
    present("Google Search Console", isSearchConsoleConfigured(), "Search Console credentials are missing"),
    present("Content agent access", Boolean(process.env.CONTENT_AGENT_SECRET), "CONTENT_AGENT_SECRET is missing"),
    present("Scheduled jobs", Boolean(process.env.CRON_SECRET), "CRON_SECRET is missing"),
    present("Instant indexing (IndexNow)", isIndexNowConfigured(), "Not connected (optional)", true)
  );

  return NextResponse.json({ checks, checkedAt: new Date().toISOString() });
}
