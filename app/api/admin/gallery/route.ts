import { z } from "zod";
import { db } from "@/lib/db";
import { ok, created, fail } from "@/lib/api-response";
import { requireManager } from "@/lib/admin";
import { readJson, validationErrorFromZod } from "@/lib/util";

const createSchema = z.object({
  title: z.string().trim().min(1).max(160),
  imageUrl: z.string().url(),
  publicId: z.string().optional(),
  altText: z.string().trim().max(300).optional(),
  category: z.enum(["FOOD", "DINING", "KITCHEN", "BAR", "MOMENTS"]).default("FOOD"),
  sortOrder: z.number().int().default(0),
  isPublished: z.boolean().default(true),
});

/** GET /api/admin/gallery — all gallery images. */
export async function GET() {
  try {
    await requireManager();
    const images = await db.galleryImage.findMany({ orderBy: { sortOrder: "asc" } });
    return ok({ images });
  } catch (e) {
    return fail(e);
  }
}

/** POST /api/admin/gallery — add a gallery image. */
export async function POST(req: Request) {
  try {
    await requireManager();
    const body = await readJson(req);
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) return fail(validationErrorFromZod(parsed.error));

    const image = await db.galleryImage.create({ data: parsed.data });
    return created(image);
  } catch (e) {
    return fail(e);
  }
}