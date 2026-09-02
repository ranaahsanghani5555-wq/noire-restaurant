import { z } from "zod";
import { db } from "@/lib/db";
import { ok, created, fail } from "@/lib/api-response";
import { requireManager } from "@/lib/admin";
import { ConflictError } from "@/lib/errors";
import { readJson, validationErrorFromZod } from "@/lib/util";

const createSchema = z.object({
  name: z.string().trim().min(1).max(120),
  slug: z.string().trim().min(1).max(160),
  description: z.string().trim().max(500).optional(),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

/** GET /api/admin/menu/categories — all menu categories. */
export async function GET() {
  try {
    await requireManager();
    const categories = await db.menuCategory.findMany({
      orderBy: { sortOrder: "asc" },
      include: { _count: { select: { items: true } } },
    });
    return ok({ categories });
  } catch (e) {
    return fail(e);
  }
}

/** POST /api/admin/menu/categories — create a category. */
export async function POST(req: Request) {
  try {
    await requireManager();
    const body = await readJson(req);
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) return fail(validationErrorFromZod(parsed.error));

    const existing = await db.menuCategory.findUnique({ where: { slug: parsed.data.slug } });
    if (existing) throw new ConflictError("A category with that slug already exists");

    const category = await db.menuCategory.create({ data: parsed.data });
    return created(category);
  } catch (e) {
    return fail(e);
  }
}