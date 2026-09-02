import { z } from "zod";
import { db } from "@/lib/db";
import { ok, fail } from "@/lib/api-response";
import { requireManager } from "@/lib/admin";
import { NotFoundError, ConflictError } from "@/lib/errors";
import { readJson, validationErrorFromZod, decimalsToNumbers } from "@/lib/util";

const updateSchema = z.object({
  categoryId: z.string().optional(),
  name: z.string().trim().min(1).max(160).optional(),
  slug: z.string().trim().min(1).max(160).optional(),
  description: z.string().trim().max(1000).nullable().optional(),
  price: z.union([z.number().nonnegative(), z.string().transform(Number)]).optional(),
  image: z.string().url().optional().or(z.literal("")).nullable(),
  ingredients: z.array(z.string()).optional(),
  allergens: z.array(z.string()).optional(),
  dietary: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  available: z.boolean().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

/** PATCH /api/admin/menu/items/:id — update a menu item. */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireManager();
    const { id } = await params;
    const body = await readJson(req);
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) return fail(validationErrorFromZod(parsed.error));

    const existing = await db.menuItem.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError("Menu item not found");

    const data = { ...parsed.data };
    const nextCategoryId = data.categoryId ?? existing.categoryId;
    if (data.slug) {
      const dup = await db.menuItem.findUnique({
        where: { categoryId_slug: { categoryId: nextCategoryId, slug: data.slug } },
      });
      if (dup && dup.id !== id) throw new ConflictError("That slug is taken in this category");
    }

    const item = await db.menuItem.update({ where: { id }, data });
    return ok(decimalsToNumbers(item));
  } catch (e) {
    return fail(e);
  }
}

/** DELETE /api/admin/menu/items/:id — delete a menu item. */
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireManager();
    const { id } = await params;
    const existing = await db.menuItem.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError("Menu item not found");
    await db.menuItem.delete({ where: { id } });
    return ok({ message: "Menu item deleted" });
  } catch (e) {
    return fail(e);
  }
}