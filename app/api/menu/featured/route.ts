import { db } from "@/lib/db";
import { ok } from "@/lib/api-response";

/** GET /api/menu/featured — featured, active dishes. */
export async function GET() {
  const items = await db.menuItem.findMany({
    where: { isActive: true, available: true, featured: true },
    orderBy: { sortOrder: "asc" },
    include: { category: true },
  });

  return ok({
    dishes: items.map((i) => ({
      id: i.id,
      name: i.name,
      description: i.description,
      price: i.price.toNumber(),
      image: i.image,
      category: i.category.slug,
      featured: true,
      dietary: i.dietary,
    })),
  });
}