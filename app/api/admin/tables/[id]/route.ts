import { z } from "zod";
import { db } from "@/lib/db";
import { ok, fail } from "@/lib/api-response";
import { requireManager } from "@/lib/admin";
import { NotFoundError, ConflictError } from "@/lib/errors";
import { readJson, validationErrorFromZod } from "@/lib/util";

const updateSchema = z.object({
  name: z.string().trim().min(1).max(60).optional(),
  capacity: z.number().int().min(1).max(100).optional(),
  location: z.string().trim().max(120).nullable().optional(),
  isActive: z.boolean().optional(),
});

/** PATCH /api/admin/tables/:id — update a dining table. */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireManager();
    const { id } = await params;
    const body = await readJson(req);
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) return fail(validationErrorFromZod(parsed.error));

    const existing = await db.diningTable.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError("Table not found");

    const table = await db.diningTable.update({
      where: { id },
      data: parsed.data,
    });
    return ok(table);
  } catch (e) {
    return fail(e);
  }
}

/** DELETE /api/admin/tables/:id — remove a dining table (only if not in use). */
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireManager();
    const { id } = await params;
    const count = await db.reservation.count({ where: { tableId: id } });
    if (count > 0) {
      return fail(new ConflictError("Cannot delete a table with reservations"));
    }
    await db.diningTable.delete({ where: { id } });
    return ok({ message: "Table deleted" });
  } catch (e) {
    return fail(e);
  }
}