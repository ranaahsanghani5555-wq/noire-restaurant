import { z } from "zod";
import { db } from "@/lib/db";
import { ok, fail } from "@/lib/api-response";
import { requireManager } from "@/lib/admin";
import { NotFoundError, ConflictError } from "@/lib/errors";
import { readJson, validationErrorFromZod } from "@/lib/util";

const updateSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  slug: z.string().trim().min(1).max(160).optional(),
  description: z.string().trim().max(500).nullable().optional(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

/** PATCH /api/admin/menu/categories/:id — update a category. */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireManager();
    const { id } = await params;
    const body = await readJson(req);
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) return fail(validationErrorFromZod(parsed.error));

    const existing = await db.menuCategory.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError("Category not found");

    if (parsed.data.slug) {
      const dup = await db.menuCategory.findUnique({ where: { slug: parsed.data.slug } });
      if (dup && dup.id !== id) throw new ConflictError("That slug is taken");
    }

    const category = await db.menuCategory.update({ where: { id }, data: parsed.data });
    return ok(category);
  } catch (e) {
    return fail(e);
  }
}

/** DELETE /api/admin/menu/categories/:id — delete a category (cascades items). */
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireManager();
    const { id } = await params;
    await db.menuCategory.delete({ where: { id } });
    return ok({ message: "Category deleted" });
  } catch (e) {
    return fail(e);
  }
}