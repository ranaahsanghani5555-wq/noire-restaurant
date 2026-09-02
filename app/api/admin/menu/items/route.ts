import { z } from "zod";
import { db } from "@/lib/db";
import { ok, created, fail } from "@/lib/api-response";
import { requireManager } from "@/lib/admin";
import { ConflictError } from "@/lib/errors";
import { readJson, validationErrorFromZod, decimalsToNumbers } from "@/lib/util";

const createSchema = z.object({
  categoryId: z.string().min(1),
  name: z.string().trim().min(1).max(160),
  slug: z.string().trim().min(1).max(160),
  description: z.string().trim().max(1000).optional(),
  price: z.union([z.number().nonnegative(), z.string().transform(Number)]),
  image: z.string().url().optional().or(z.literal("")),
  ingredients: z.array(z.string()).default([]),
  allergens: z.array(z.string()).default([]),
  dietary: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  available: z.boolean().default(true),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

/** GET /api/admin/menu/items?categoryId=... — menu items (optionally filtered). */
export async function GET(req: Request) {
  try {
    await requireManager();
    const url = new URL(req.url);
    const categoryId = url.searchParams.get("categoryId") ?? undefined;
    const items = await db.menuItem.findMany({
      where: categoryId ? { categoryId } : undefined,
      orderBy: [{ categoryId: "asc" }, { sortOrder: "asc" }],
      include: { category: true },
    });
    return ok({ items: decimalsToNumbers(items) });
  } catch (e) {
    return fail(e);
  }
}

/** POST /api/admin/menu/items — create a menu item. */
export async function POST(req: Request) {
  try {
    await requireManager();
    const body = await readJson(req);
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) return fail(validationErrorFromZod(parsed.error));

    const dup = await db.menuItem.findUnique({
      where: { categoryId_slug: { categoryId: parsed.data.categoryId, slug: parsed.data.slug } },
    });
    if (dup) throw new ConflictError("An item with that slug already exists in this category");

    const item = await db.menuItem.create({
      data: {
        ...parsed.data,
        price: parsed.data.price,
      },
      include: { category: true },
    });
    return created(decimalsToNumbers(item));
  } catch (e) {
    return fail(e);
  }
}