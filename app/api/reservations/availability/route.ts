import { z } from "zod";
import { ok, fail } from "@/lib/api-response";
import { validationErrorFromZod } from "@/lib/util";
import { validateAvailability, alternatives } from "@/lib/services/reservations";

const querySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  guests: z.coerce.number().int().min(1),
  time: z.string().optional(),
});

/** GET /api/reservations/availability?date=YYYY-MM-DD&guests=2&time=19:00 */
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const raw = {
      date: url.searchParams.get("date") ?? "",
      guests: url.searchParams.get("guests") ?? "",
      time: url.searchParams.get("time") ?? undefined,
    };

    const parsed = querySchema.safeParse(raw);
    if (!parsed.success) {
      return fail(
        validationErrorFromZod(parsed.error, "Invalid reservation query")
      );
    }

    const result = await validateAvailability(parsed.data);

    if (!result.open) {
      return ok({
        available: false,
        reason: result.reason,
        close: result.close,
      });
    }

    // Provide a few alternative times when the requested slot is full.
    let alternativesList: string[] = [];
    if (!result.available) {
      alternativesList = await alternatives({
        date: parsed.data.date,
        guests: parsed.data.guests,
      });
    }

    return ok({
      available: Boolean(result.available),
      requestedTime: parsed.data.time ?? undefined,
      close: result.close,
      alternatives: alternativesList,
    });
  } catch (e) {
    return fail(e);
  }
}