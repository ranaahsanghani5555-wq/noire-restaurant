/**
 * Structured, safe server logging.
 * Never log passwords, tokens, card data, or secrets. Prepend a request id
 * when one is available so related log lines can be correlated.
 */

type Level = "info" | "warn" | "error";

function write(level: Level, message: string, meta?: Record<string, unknown>) {
  const line: Record<string, unknown> = { time: new Date().toISOString(), level, message };
  if (meta && Object.keys(meta).length) {
    // Drop any key that looks sensitive before it can reach logs.
    const safe: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(meta)) {
      const key = k.toLowerCase();
      if (/(password|secret|token|api[_-]?key|authorization|card|cvv)/.test(key)) continue;
      safe[k] = v;
    }
    line.meta = safe;
  }
  const out = JSON.stringify(line);
  if (level === "error") console.error(out);
  else if (level === "warn") console.warn(out);
  else console.log(out);
}

export function logInfo(message: string, meta?: Record<string, unknown>) {
  write("info", message, meta);
}

export function logWarn(message: string, meta?: Record<string, unknown>) {
  write("warn", message, meta);
}

export function logError(message: string, error?: Error, meta?: Record<string, unknown>) {
  write("error", message, {
    ...meta,
    errorName: error?.name,
    errorMessage: error?.message,
    // In production we do not dump stacks to logs by default; safe to include
    // in non-production so debugging is easier.
    stack: process.env.NODE_ENV === "production" ? undefined : error?.stack,
  });
}

/** Create a short, unique request id used across logs and responses. */
export function newRequestId(): string {
  return `req_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}