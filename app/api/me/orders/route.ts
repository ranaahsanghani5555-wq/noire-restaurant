import { db } from "@/lib/db";
import { ok, fail } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth/permissions";
import { decimalsToNumbers } from "@/lib/util";

/** GET /api/me/orders — the signed-in user's own orders. */
export async function GET() {
  try {
    const session = await requireAuth();
    const orders = await db.order.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: "desc" },
      include: { items: true },
      take: 50,
    });

    return ok({ orders: decimalsToNumbers(orders) });
  } catch (e) {
    return fail(e);
  }
}