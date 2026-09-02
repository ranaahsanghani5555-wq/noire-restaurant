import { z } from "zod";

/**
 * Central, validated access to environment variables.
 * Public (`NEXT_PUBLIC_*`) values are safe to expose; everything else is
 * secret and must never be sent to the client. This module only lives on the
 * server for non-public keys.
 */

const envSchema = z.object({
  // Public
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),

  // Secrets — optional at parse time so the app can build/dev without a live
  // database; the DB client and auth guard require them explicitly at runtime.
  DATABASE_URL: z.string().optional(),
  AUTH_SECRET: z.string().optional(),

  // Email (optional)
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().optional(),

  // Media (optional)
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),

  // Payments (optional)
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),

  // Rate limiting (optional)
  UPSTASH_REDIS_REST_URL: z.string().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),

  // Seed-only
  SEED_ADMIN_EMAIL: z.string().optional(),
  SEED_ADMIN_PASSWORD: z.string().optional(),
});

function loadEnv() {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    // Build-time safety: surface a clear, actionable message instead of a
    // confusing crash. Non-secret errors only.
    const detail = parsed.error.issues
      .map((issue) => `${issue.path.join(".")} ${issue.message}`)
      .join("; ");
    throw new Error(`Invalid environment: ${detail}`);
  }
  return parsed.data;
}

export const env = loadEnv();

/** True only when the corresponding secret is configured (services active). */
export const hasResend = Boolean(env.RESEND_API_KEY);
export const hasCloudinary = Boolean(
  env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET
);
export const hasStripe = Boolean(env.STRIPE_SECRET_KEY);
export const hasUpstash = Boolean(
  env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN
);