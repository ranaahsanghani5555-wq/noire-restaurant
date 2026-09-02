import { z } from "zod";
import { db } from "@/lib/db";
import { ok, fail } from "@/lib/api-response";
import { requireStaff } from "@/lib/admin";
import { NotFoundError } from "@/lib/errors";
import { readJson, validationErrorFromZod } from "@/lib/util";

const updateSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "SEATED", "COMPLETED", "CANCELLED", "NO_SHOW"]).optional(),
  tableId: z.string().nullable().optional(),
  notes: z.string().trim().max(2000).optional(),
});

/**
 * PATCH /api/admin/reservations/:id — update status, table, or notes.
 */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireStaff();
    const { id } = await params;
    const body = await readJson(req);
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) return fail(validationErrorFromZod(parsed.error));

    const existing = await db.reservation.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError("Reservation not found");

    const reservation = await db.reservation.update({
      where: { id },
      data: {
        status: parsed.data.status,
        tableId: parsed.data.tableId === null ? null : parsed.data.tableId,
        notes: parsed.data.notes,
      },
      include: { table: true },
    });

    return ok(reservation);
  } catch (e) {
    return fail(e);
  }
}