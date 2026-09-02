import { z } from "zod";
import { db } from "@/lib/db";
import { ok, fail } from "@/lib/api-response";
import { rateLimit } from "@/lib/rate-limit";
import { clientIp, hashIp } from "@/lib/guards";
import { readJson, validationErrorFromZod } from "@/lib/util";

const bodySchema = z.object({
  email: z.string().trim().toLowerCase().email(),
});

/** POST /api/newsletter — subscribe an email address. */
export async function POST(req: Request) {
  try {
    await rateLimit([hashIp(clientIp(req))], { limit: 5, windowSeconds: 300, prefix: "newsletter" });

    const body = await readJson(req);
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      return fail(validationErrorFromZod(parsed.error, "Invalid email"));
    }

    const email = parsed.data.email;

    const existing = await db.newsletterSubscriber.findUnique({ where: { email } });
    if (existing?.status === "UNSUBSCRIBED") {
      await db.newsletterSubscriber.update({
        where: { id: existing.id },
        data: { status: "SUBSCRIBED", unsubscribedAt: null },
      });
    } else if (!existing) {
      await db.newsletterSubscriber.create({ data: { email } });
    }

    return ok({ message: "Welcome to the list. Notes from NOIRÉ arrive monthly." });
  } catch (e) {
    return fail(e);
  }
}

/** DELETE /api/newsletter?email=... — unsubscribe. */
export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const email = (url.searchParams.get("email") ?? "").trim().toLowerCase();
    const parsed = z.string().email().safeParse(email);
    if (!parsed.success) {
      return fail(validationErrorFromZod(parsed.error, "Invalid email"));
    }

    await db.newsletterSubscriber.updateMany({
      where: { email: parsed.data },
      data: { status: "UNSUBSCRIBED", unsubscribedAt: new Date() },
    });

    return ok({ message: "You have been unsubscribed." });
  } catch (e) {
    return fail(e);
  }
}