import { ZodError } from "zod";
import { ValidationError } from "@/lib/errors";

/**
 * Convert a ZodError into a ValidationError with per-field messages keyed by
 * the dot-path of the failing field (e.g. "email").
 */
export function validationErrorFromZod(error: ZodError, fallback = "Validation failed"): ValidationError {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".");
    if (!fieldErrors[key]) {
      fieldErrors[key] = issue.message;
    }
  }
  return new ValidationError(fallback, fieldErrors);
}

/** Try to parse the request body as JSON, failing safely on bad input. */
export async function readJson(req: Request): Promise<unknown> {
  try {
    return await req.json();
  } catch {
    throw new ValidationError("The request body is not valid JSON");
  }
}

/** Convert DB Decimal values to plain numbers recursively for JSON responses. */
export function decimalsToNumbers<T>(value: T): T {
  return JSON.parse(
    JSON.stringify(value, (_key, v) =>
      v && typeof v === "object" && typeof v.toNumber === "function"
        ? v.toNumber()
        : v
    )
  ) as T;
}