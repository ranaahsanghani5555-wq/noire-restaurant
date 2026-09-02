import { db } from "@/lib/db";
import { ok } from "@/lib/api-response";

/** GET /api/menu — active menu grouped by category, with active items. */
export async function GET() {
  const categories = await db.menuCategory.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    include: {
      items: {
        where: { isActive: true, available: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  return ok({
    categories: categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      items: c.items.map((i) => ({
        id: i.id,
        name: i.name,
        description: i.description,
        price: i.price.toNumber(),
        image: i.image,
        featured: i.featured,
        dietary: i.dietary,
        category: c.slug,
      })),
    })),
  });
}