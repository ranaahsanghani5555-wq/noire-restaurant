import { db } from "@/lib/db";
import { ok } from "@/lib/api-response";

/** GET /api/gallery — published gallery images. */
export async function GET() {
  const images = await db.galleryImage.findMany({
    where: { isPublished: true },
    orderBy: { sortOrder: "asc" },
  });

  return ok({
    images: images.map((g) => ({
      id: g.id,
      src: g.imageUrl,
      alt: g.altText ?? g.title,
      category: g.category.toLowerCase(),
    })),
  });
}