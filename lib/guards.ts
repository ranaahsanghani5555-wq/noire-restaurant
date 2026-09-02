import { createHash } from "node:crypto";

/**
 * Best-effort client IP from a Next.js Request.
 * Falls back to "anonymous" so rate limiting never breaks on missing headers.
 */
export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "anonymous";
}

/** Hashing the IP keeps raw addresses out of logs/Redis counters. */
export function hashIp(ip: string): string {
  return createHash("sha256").update(ip).digest("hex").slice(0, 24);
}

/** Stable rate-limit identity combining a user id (if any) and the IP hash. */
export function rateLimitKey(userId: string | null | undefined, ip: string): string[] {
  const keys = [hashIp(ip)];
  if (userId) keys.push(userId);
  return keys;
}