import { db } from "@/lib/db";
import { ok } from "@/lib/api-response";

/** GET /api/restaurant — public restaurant info, hours, and closures. */
export async function GET() {
  const [settings, hours, closures] = await Promise.all([
    db.restaurantSettings.findUnique({ where: { id: 1 } }),
    db.openingHours.findMany({ orderBy: { dayOfWeek: "asc" } }),
    db.closure.findMany({ where: { scope: "RESERVATION" }, orderBy: { date: "asc" } }),
  ]);

  return ok({
    restaurant: settings ?? null,
    hours: hours ?? [],
    closures: closures ?? [],
  });
}