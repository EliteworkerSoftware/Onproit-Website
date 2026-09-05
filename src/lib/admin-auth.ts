import "server-only";
import { createHmac, timingSafeEqual } from "crypto";

export const ADMIN_COOKIE_NAME = "onproit_admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;
export const ADMIN_SESSION_MAX_AGE_SECONDS = SESSION_TTL_MS / 1000;

function sign(value: string) {
  const secret = process.env.ADMIN_SESSION_SECRET || "";
  return createHmac("sha256", secret).update(value).digest("hex");
}

export function createSessionCookieValue(userId: string) {
  const payload = `${userId}.${Date.now() + SESSION_TTL_MS}`;
  return `${payload}.${sign(payload)}`;
}

// The cookie only proves *who the caller claims to be* — nothing about the
// account's current state is baked in, so removing an admin takes effect on
// their very next request instead of waiting out a week-long stale session.
export function readSessionUserId(value: string | undefined): string | null {
  if (!value) return null;
  const parts = value.split(".");
  if (parts.length !== 3) return null;

  const [userId, expires, signature] = parts;
  const payload = `${userId}.${expires}`;
  const expected = sign(payload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  if (Number(expires) <= Date.now()) return null;

  return userId;
}
