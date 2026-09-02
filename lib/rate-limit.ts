import { Redis } from "@upstash/redis";
import { hasUpstash } from "@/lib/env";
import { RateLimitError } from "@/lib/errors";

/**
 * Request rate limiting.
 * Uses Upstash Redis when configured (ideal for serverless/Vercel); otherwise
 * falls back to a simple in-memory fixed-window limiter that works locally,
 * in dev, and in tests.
 */

interface InMemoryBucket {
  count: number;
  resetAt: number;
}

const memory = new Map<string, InMemoryBucket>();

function inMemoryLimit(identifier: string, limit: number, windowMs: number) {
  const now = Date.now();
  const bucket = memory.get(identifier);
  if (!bucket || bucket.resetAt <= now) {
    memory.set(identifier, { count: 1, resetAt: now + windowMs });
    return { success: true };
  }
  if (bucket.count >= limit) return { success: false };
  bucket.count += 1;
  return { success: true };
}

/** Fixed-window counter using Upstash's atomic INCR + EXPIRE. */
async function upstashLimit(redis: Redis, identifier: string, limit: number, windowSeconds: number) {
  const key = `rl:${identifier}`;
  const count = await redis.incr(key);
  if (count === 1) await redis.expire(key, windowSeconds);
  return { success: count <= limit };
}

export interface RateLimiter {
  limit: (identifier: string) => Promise<{ success: boolean }>;
}

let _redis: Redis | null = null;
function redis() {
  if (!_redis) _redis = Redis.fromEnv();
  return _redis;
}

export function getRateLimiter(limit: number, windowSeconds: number, prefix = "rl"): RateLimiter {
  if (hasUpstash) {
    const r = redis();
    return {
      async limit(identifier: string) {
        return upstashLimit(r, `${prefix}:${identifier}`, limit, windowSeconds);
      },
    };
  }
  const windowMs = windowSeconds * 1000;
  return {
    async limit(identifier: string) {
      return inMemoryLimit(`${prefix}:${identifier}`, limit, windowMs);
    },
  };
}

/**
 * Guard helper used by route handlers. Throws RateLimitError when exceeded.
 * `identifiers` - combine anything that uniquely identifies the caller, e.g.
 * a session user id and/or a hash of the request IP.
 */
export async function rateLimit(
  identifiers: string[],
  opts?: { limit?: number; windowSeconds?: number; prefix?: string }
) {
  const limiter = getRateLimiter(opts?.limit ?? 30, opts?.windowSeconds ?? 60, opts?.prefix ?? "noire");
  const key = identifiers.filter(Boolean).join(":") || "anonymous";
  const result = await limiter.limit(key);
  if (!result.success) throw new RateLimitError();
}