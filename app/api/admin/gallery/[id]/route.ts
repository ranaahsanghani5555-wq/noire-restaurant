import { z } from "zod";
import { db } from "@/lib/db";
import { ok, fail } from "@/lib/api-response";
import { requireManager } from "@/lib/admin";
import { NotFoundError } from "@/lib/errors";
import { readJson, validationErrorFromZod } from "@/lib/util";

const updateSchema = z.object({
  title: z.string().trim().min(1).max(160).optional(),
  imageUrl: z.string().url().optional(),
  publicId: z.string().nullable().optional(),
  altText: z.string().trim().max(300).nullable().optional(),
  category: z.enum(["FOOD", "DINING", "KITCHEN", "BAR", "MOMENTS"]).optional(),
  sortOrder: z.number().int().optional(),
  isPublished: z.boolean().optional(),
});

/** PATCH /api/admin/gallery/:id — update a gallery image. */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireManager();
    const { id } = await params;
    const existing = await db.galleryImage.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError("Gallery image not found");

    const body = await readJson(req);
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) return fail(validationErrorFromZod(parsed.error));

    const image = await db.galleryImage.update({ where: { id }, data: parsed.data });
    return ok(image);
  } catch (e) {
    return fail(e);
  }
}

/** DELETE /api/admin/gallery/:id — delete a gallery image. */
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireManager();
    const { id } = await params;
    const existing = await db.galleryImage.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError("Gallery image not found");
    await db.galleryImage.delete({ where: { id } });
    return ok({ message: "Gallery image deleted" });
  } catch (e) {
    return fail(e);
  }
}