import { z } from "zod";
import { created, fail } from "@/lib/api-response";
import { rateLimit } from "@/lib/rate-limit";
import { clientIp, hashIp } from "@/lib/guards";
import { getSession } from "@/lib/auth/session";
import { readJson, validationErrorFromZod, decimalsToNumbers } from "@/lib/util";
import { createOrder } from "@/lib/services/orders";

const lineSchema = z.object({
  itemId: z.string().min(1),
  quantity: z.number().int().min(1).max(100),
});

const bodySchema = z.object({
  fulfillment: z.enum(["DINE_IN", "PICKUP", "DELIVERY"]),
  items: z.array(lineSchema).min(1),
  customerEmail: z.string().trim().toLowerCase().email().optional(),
  customerName: z.string().trim().min(1).optional(),
});

/** POST /api/orders — create an order; pricing is always server-side. */
export async function POST(req: Request) {
  try {
    await rateLimit([hashIp(clientIp(req))], { limit: 20, windowSeconds: 60, prefix: "order" });

    const session = await getSession();
    const body = await readJson(req);
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      return fail(validationErrorFromZod(parsed.error, "Invalid order data"));
    }

    const order = await createOrder({
      fulfillment: parsed.data.fulfillment,
      items: parsed.data.items,
      userId: session?.userId,
      customerEmail: parsed.data.customerEmail,
      customerName: parsed.data.customerName,
    });

    return created(decimalsToNumbers(order));
  } catch (e) {
    return fail(e);
  }
}