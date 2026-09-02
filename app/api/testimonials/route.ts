import { db } from "@/lib/db";
import { ok } from "@/lib/api-response";

/** GET /api/testimonials — published guest testimonials. */
export async function GET() {
  const testimonials = await db.testimonial.findMany({
    where: { isPublished: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return ok({
    testimonials: testimonials.map((t) => ({
      id: t.id,
      quote: t.quote,
      guest: t.customerName,
      image: t.image,
      rating: t.rating,
    })),
  });
}