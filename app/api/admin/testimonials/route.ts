import { z } from "zod";
import { db } from "@/lib/db";
import { ok, created, fail } from "@/lib/api-response";
import { requireManager } from "@/lib/admin";
import { readJson, validationErrorFromZod } from "@/lib/util";

const createSchema = z.object({
  customerName: z.string().trim().min(1).max(120),
  quote: z.string().trim().min(1).max(2000),
  rating: z.number().int().min(1).max(5).default(5),
  image: z.string().url().optional().or(z.literal("")),
  isPublished: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

/** GET /api/admin/testimonials — all testimonials. */
export async function GET() {
  try {
    await requireManager();
    const testimonials = await db.testimonial.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
    return ok({ testimonials });
  } catch (e) {
    return fail(e);
  }
}

/** POST /api/admin/testimonials — create a testimonial. */
export async function POST(req: Request) {
  try {
    await requireManager();
    const body = await readJson(req);
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) return fail(validationErrorFromZod(parsed.error));

    const testimonial = await db.testimonial.create({ data: parsed.data });
    return created(testimonial);
  } catch (e) {
    return fail(e);
  }
}