import { z } from "zod";
import { db } from "@/lib/db";
import { created, fail } from "@/lib/api-response";
import { rateLimit } from "@/lib/rate-limit";
import { clientIp, hashIp } from "@/lib/guards";
import { readJson, validationErrorFromZod } from "@/lib/util";

const bodySchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().toLowerCase().email(),
  phone: z.string().trim().max(30).optional(),
  eventDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  guests: z.coerce.number().int().min(1).optional(),
  eventType: z.string().trim().max(60).optional(),
  budget: z.string().trim().max(60).optional(),
  message: z.string().trim().max(5000).optional(),
});

/** POST /api/private-dining — store a private dining inquiry. */
export async function POST(req: Request) {
  try {
    await rateLimit([hashIp(clientIp(req))], { limit: 5, windowSeconds: 60, prefix: "private-dining" });

    const body = await readJson(req);
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      return fail(validationErrorFromZod(parsed.error, "Invalid inquiry data"));
    }

    const data = parsed.data;
    const inquiry = await db.privateDiningInquiry.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        eventDate: data.eventDate ? new Date(`${data.eventDate}T00:00:00.000Z`) : undefined,
        guestCount: data.guests,
        eventType: data.eventType,
        budget: data.budget,
        message: data.message,
      },
    });

    return created({
      message: "Thank you. Our private dining team will be in touch.",
      id: inquiry.id,
    });
  } catch (e) {
    return fail(e);
  }
}