import { z } from "zod";
import { db } from "@/lib/db";
import { ok, fail } from "@/lib/api-response";
import { requireManager, paginate } from "@/lib/admin";
import { validationErrorFromZod } from "@/lib/util";

const querySchema = z.object({
  q: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

/** GET /api/admin/customers?q=&page= — list customer accounts. */
export async function GET(req: Request) {
  try {
    await requireManager();
    const url = new URL(req.url);
    const parsed = querySchema.safeParse({
      q: url.searchParams.get("q") ?? undefined,
      page: url.searchParams.get("page") ?? undefined,
      limit: url.searchParams.get("limit") ?? undefined,
    });
    if (!parsed.success) return fail(validationErrorFromZod(parsed.error));

    const { q, page, limit } = parsed.data;
    const where = q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" as const } },
            { email: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {};

    const { skip, take } = paginate(page, limit);
    const [total, customers] = await Promise.all([
      db.user.count({ where }),
      db.user.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          createdAt: true,
          _count: { select: { reservations: true, orders: true } },
        },
      }),
    ]);

    return ok({ customers, total }, { meta: { page, limit, total } });
  } catch (e) {
    return fail(e);
  }
}