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
  subject: z.string().trim().max(120).optional(),
  message: z.string().trim().min(5).max(5000),
});

/** POST /api/contact — store a contact message. */
export async function POST(req: Request) {
  try {
    await rateLimit([hashIp(clientIp(req))], { limit: 5, windowSeconds: 60, prefix: "contact" });

    const body = await readJson(req);
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      return fail(validationErrorFromZod(parsed.error, "Invalid contact data"));
    }

    const message = await db.contactMessage.create({
      data: parsed.data,
    });

    return created({ message: "Thank you. Your message has been received.", id: message.id });
  } catch (e) {
    return fail(e);
  }
}