import { z } from "zod";
import { db } from "@/lib/db";
import { ok, fail } from "@/lib/api-response";
import { requireStaff, paginate } from "@/lib/admin";
import { validationErrorFromZod, decimalsToNumbers } from "@/lib/util";

const querySchema = z.object({
  status: z.string().optional(),
  q: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

/** GET /api/admin/orders?status=&q=&page= — orders list (staff). */
export async function GET(req: Request) {
  try {
    await requireStaff();
    const url = new URL(req.url);
    const parsed = querySchema.safeParse({
      status: url.searchParams.get("status") ?? undefined,
      q: url.searchParams.get("q") ?? undefined,
      page: url.searchParams.get("page") ?? undefined,
      limit: url.searchParams.get("limit") ?? undefined,
    });
    if (!parsed.success) return fail(validationErrorFromZod(parsed.error));

    const { status, q, page, limit } = parsed.data;
    const where = {
      ...(status ? { status: status as never } : {}),
      ...(q
        ? {
            OR: [
              { number: { contains: q, mode: "insensitive" as const } },
              { customerEmail: { contains: q, mode: "insensitive" as const } },
              { customerName: { contains: q, mode: "insensitive" as const } },
            ],
          }
        : {}),
    } as never;

    const { skip, take } = paginate(page, limit);
    const [total, orders] = await Promise.all([
      db.order.count({ where }),
      db.order.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take,
        include: { items: true },
      }),
    ]);

    return ok({ orders: decimalsToNumbers(orders), total }, { meta: { page, limit, total } });
  } catch (e) {
    return fail(e);
  }
}