import { z } from "zod";
import { db } from "@/lib/db";
import { ok, fail } from "@/lib/api-response";
import { requireManager } from "@/lib/admin";
import { NotFoundError } from "@/lib/errors";
import { readJson, validationErrorFromZod } from "@/lib/util";

const updateSchema = z.object({
  customerName: z.string().trim().min(1).max(120).optional(),
  quote: z.string().trim().min(1).max(2000).optional(),
  rating: z.number().int().min(1).max(5).optional(),
  image: z.string().url().nullable().optional().or(z.literal("")),
  isPublished: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

/** PATCH /api/admin/testimonials/:id — update a testimonial. */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireManager();
    const { id } = await params;
    const existing = await db.testimonial.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError("Testimonial not found");

    const body = await readJson(req);
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) return fail(validationErrorFromZod(parsed.error));

    const testimonial = await db.testimonial.update({ where: { id }, data: parsed.data });
    return ok(testimonial);
  } catch (e) {
    return fail(e);
  }
}

/** DELETE /api/admin/testimonials/:id — delete a testimonial. */
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireManager();
    const { id } = await params;
    await db.testimonial.delete({ where: { id } });
    return ok({ message: "Testimonial deleted" });
  } catch (e) {
    return fail(e);
  }
}