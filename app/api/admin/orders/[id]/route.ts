import { z } from "zod";
import { db } from "@/lib/db";
import { ok, fail } from "@/lib/api-response";
import { requireStaff } from "@/lib/admin";
import { NotFoundError } from "@/lib/errors";
import { readJson, validationErrorFromZod, decimalsToNumbers } from "@/lib/util";

const updateSchema = z.object({
  status: z.enum([
    "PENDING",
    "CONFIRMED",
    "PREPARING",
    "READY",
    "OUT_FOR_DELIVERY",
    "COMPLETED",
    "CANCELLED",
    "REFUNDED",
  ]),
});

/** PATCH /api/admin/orders/:id — update order status (staff). */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireStaff();
    const { id } = await params;
    const body = await readJson(req);
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) return fail(validationErrorFromZod(parsed.error));

    const existing = await db.order.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError("Order not found");

    const order = await db.order.update({
      where: { id },
      data: { status: parsed.data.status },
    });
    return ok(decimalsToNumbers(order));
  } catch (e) {
    return fail(e);
  }
}