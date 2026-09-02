import { z } from "zod";
import { ok, fail } from "@/lib/api-response";
import { getSession } from "@/lib/auth/session";
import { readJson, validationErrorFromZod } from "@/lib/util";
import { createOrder } from "@/lib/services/orders";
import { createCheckout } from "@/lib/payments";
import { env } from "@/lib/env";

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

/** POST /api/checkout — create an order and a payment checkout session. */
export async function POST(req: Request) {
  try {
    const session = await getSession();
    const body = await readJson(req);
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) return fail(validationErrorFromZod(parsed.error));

    const order = await createOrder({
      fulfillment: parsed.data.fulfillment,
      items: parsed.data.items,
      userId: session?.userId,
      customerEmail: parsed.data.customerEmail ?? session?.email,
      customerName: parsed.data.customerName ?? session?.name,
    });

    const appUrl = env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
    const checkout = await createCheckout({
      orderId: order.id,
      currency: order.currency.toLowerCase(),
      lineItems: order.items.map((i) => ({
        name: i.name,
        quantity: i.quantity,
        amount: i.unitPrice.toNumber(),
      })),
      successUrl: `${appUrl}/orders/${order.id}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${appUrl}/cart?canceled=1`,
      customerEmail: order.customerEmail ?? undefined,
    });

    return ok({ orderId: order.id, checkoutUrl: checkout.url, mock: checkout.mock });
  } catch (e) {
    return fail(e);
  }
}