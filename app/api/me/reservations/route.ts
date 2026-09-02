import { db } from "@/lib/db";
import { ok, fail } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth/permissions";

/** GET /api/me/reservations — the signed-in user's own reservations. */
export async function GET() {
  try {
    const session = await requireAuth();
    const reservations = await db.reservation.findMany({
      where: { userId: session.userId },
      orderBy: { date: "desc" },
      include: { table: true },
    });

    return ok({
      reservations: reservations.map((r) => ({
        id: r.id,
        date: r.date.toISOString().slice(0, 10),
        startTime: r.startTime,
        status: r.status,
        partySize: r.partySize,
        table: r.table?.name ?? null,
      })),
    });
  } catch (e) {
    return fail(e);
  }
}