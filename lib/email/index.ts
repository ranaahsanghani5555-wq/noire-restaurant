import { Resend } from "resend";
import { hasResend, env } from "@/lib/env";
import { logWarn } from "@/lib/logging";

/**
 * Email abstraction.
 * Uses Resend when RESEND_API_KEY is configured; otherwise logs a warning and
 * records the intent (no-op) so nothing breaks when no provider is set.
 */

let client: Resend | null = null;
function getClient(): Resend | null {
  if (!hasResend) return null;
  if (!client) client = new Resend(env.RESEND_API_KEY);
  return client;
}

function from(): string {
  return env.EMAIL_FROM || `noire@${env.NEXT_PUBLIC_APP_URL?.replace(/^https?:\/\//, "") ?? "example.com"}`;
}

interface Recipients {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: Recipients) {
  const c = getClient();
  if (!c) {
    logWarn("Email provider not configured; email not sent", {
      to: Array.isArray(to) ? to.join(",") : to,
      subject,
    });
    return { delivered: false as const, reason: "not_configured" };
  }
  const base = { from: from(), to, subject } as const;
  // Resend requires html/text to actually be provided; only pass what exists.
  const payload = html ? { ...base, html } : { ...base, text: text ?? htmlFromSubject(subject) };
  const res = await c.emails.send(payload);
  if (res.error) throw new Error(res.error.message);
  return { delivered: true as const, id: res.data?.id };
}

/** Ultra-simple fallback text body so sends always have a body. */
function htmlFromSubject(_subject: string): string {
  return `<p></p>`;
}

// ── Convenience templates ──────────────────────────────────────────────────

export function reservationConfirmationHtml(input: {
  guestName: string;
  date: string;
  time: string;
  guests: number;
}) {
  return `<h1>Reservation confirmed, ${input.guestName}</h1>
  <p>We've saved your table for <strong>${input.guests}</strong> on <strong>${input.date}</strong> at <strong>${input.time}</strong>.</p>
  <p>We look forward to hosting you at NOIRÉ.</p>`;
}