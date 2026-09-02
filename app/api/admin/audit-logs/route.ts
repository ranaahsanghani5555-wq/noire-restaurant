import { z } from "zod";
import { db } from "@/lib/db";
import { ok, fail } from "@/lib/api-response";
import { requireAdmin, paginate } from "@/lib/admin";
import { validationErrorFromZod } from "@/lib/util";

const querySchema = z.object({
  action: z.string().optional(),
  entity: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

/** GET /api/admin/audit-logs?action=&entity=&page= — audit trail (ADMIN). */
export async function GET(req: Request) {
  try {
    await requireAdmin();
    const url = new URL(req.url);
    const parsed = querySchema.safeParse({
      action: url.searchParams.get("action") ?? undefined,
      entity: url.searchParams.get("entity") ?? undefined,
      page: url.searchParams.get("page") ?? undefined,
      limit: url.searchParams.get("limit") ?? undefined,
    });
    if (!parsed.success) return fail(validationErrorFromZod(parsed.error));

    const { action, entity, page, limit } = parsed.data;
    const where = {
      ...(action ? { action } : {}),
      ...(entity ? { entity } : {}),
    };

    const { skip, take } = paginate(page, limit);
    const [total, logs] = await Promise.all([
      db.auditLog.count({ where }),
      db.auditLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take,
        include: { actor: { select: { name: true, email: true } } },
      }),
    ]);

    return ok({ logs, total }, { meta: { page, limit, total } });
  } catch (e) {
    return fail(e);
  }
}