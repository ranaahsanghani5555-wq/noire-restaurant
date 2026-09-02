import { db } from "@/lib/db";
import { ok, fail } from "@/lib/api-response";
import { NotFoundError } from "@/lib/errors";

/** GET /api/menu/:id — a single active menu item. */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const item = await db.menuItem.findFirst({
      where: { id, isActive: true, available: true },
      include: { category: true },
    });
    if (!item) throw new NotFoundError("Menu item not found");

    return ok({
      dish: {
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price.toNumber(),
        image: item.image,
        category: item.category.slug,
        dietary: item.dietary,
        featured: item.featured,
      },
    });
  } catch (e) {
    return fail(e);
  }
}