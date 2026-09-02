import { z } from "zod";
import { db } from "@/lib/db";
import { ok, fail } from "@/lib/api-response";
import { requireAdmin } from "@/lib/admin";
import { readJson, validationErrorFromZod } from "@/lib/util";

const updateSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  tagline: z.string().trim().max(200).nullable().optional(),
  addressLine: z.string().trim().max(200).nullable().optional(),
  city: z.string().trim().max(120).nullable().optional(),
  phone: z.string().trim().max(30).nullable().optional(),
  email: z.string().trim().email().nullable().optional(),
  timezone: z.string().trim().max(80).optional(),
  currency: z.string().trim().length(3).optional(),
  taxRate: z.union([z.number().min(0).max(1), z.string().transform((s) => Number(s))]).optional(),
  serviceFee: z.union([z.number().min(0).max(1), z.string().transform((s) => Number(s))]).optional(),
  deliveryFee: z.union([z.number().min(0), z.string().transform((s) => Number(s))]).optional(),
  reservationDurationMin: z.number().int().min(30).max(300).optional(),
  reservationBufferMin: z.number().int().min(0).max(120).optional(),
  minPartySize: z.number().int().min(1).max(50).optional(),
  maxPartySize: z.number().int().min(1).max(200).optional(),
});

/** GET /api/admin/settings — current restaurant settings (ADMIN). */
export async function GET() {
  try {
    await requireAdmin();
    const settings = await db.restaurantSettings.findUnique({ where: { id: 1 } });
    return ok({ settings });
  } catch (e) {
    return fail(e);
  }
}

/** PATCH /api/admin/settings — update restaurant settings (ADMIN). */
export async function PATCH(req: Request) {
  try {
    await requireAdmin();
    const body = await readJson(req);
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) return fail(validationErrorFromZod(parsed.error));

    const settings = await db.restaurantSettings.upsert({
      where: { id: 1 },
      create: { id: 1, name: parsed.data.name ?? "NOIRÉ", ...parsed.data },
      update: parsed.data,
    });
    return ok(settings);
  } catch (e) {
    return fail(e);
  }
}