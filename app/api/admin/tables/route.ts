import { z } from "zod";
import { db } from "@/lib/db";
import { ok, created, fail } from "@/lib/api-response";
import { requireManager } from "@/lib/admin";
import { readJson, validationErrorFromZod } from "@/lib/util";

const createSchema = z.object({
  name: z.string().trim().min(1).max(60),
  capacity: z.number().int().min(1).max(100),
  location: z.string().trim().max(120).optional(),
  isActive: z.boolean().default(true),
});

/** GET /api/admin/tables — all dining tables. */
export async function GET() {
  try {
    await requireManager();
    const tables = await db.diningTable.findMany({
      orderBy: { capacity: "asc" },
      include: { _count: { select: { reservations: true } } },
    });
    return ok({ tables });
  } catch (e) {
    return fail(e);
  }
}

/** POST /api/admin/tables — create a dining table. */
export async function POST(req: Request) {
  try {
    await requireManager();
    const body = await readJson(req);
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) return fail(validationErrorFromZod(parsed.error));

    const table = await db.diningTable.create({ data: parsed.data });
    return created(table);
  } catch (e) {
    return fail(e);
  }
}