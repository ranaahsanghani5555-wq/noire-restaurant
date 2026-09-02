import Stripe from "stripe";
import { hasStripe, env } from "@/lib/env";
import { logWarn } from "@/lib/logging";

/**
 * Payment abstraction.
 * Uses Stripe Checkout when STRIPE_SECRET_KEY is configured; otherwise returns
 * a mock checkout URL so orders flow end-to-end without a provider. Never
 * accepts client-supplied prices — totals always come from the server.
 */

let client: Stripe | null = null;
function getClient(): Stripe | null {
  if (!hasStripe) return null;
  if (!client) client = new Stripe(env.STRIPE_SECRET_KEY as string);
  return client;
}

export async function createCheckout({
  orderId,
  currency = "usd",
  lineItems,
  successUrl,
  cancelUrl,
  customerEmail,
}: {
  orderId: string;
  currency?: string;
  lineItems: { name: string; quantity: number; amount: number }[];
  successUrl: string;
  cancelUrl: string;
  customerEmail?: string;
}) {
  const c = getClient();
  if (!c) {
    logWarn("Stripe not configured; returning mock checkout URL.", { orderId });
    return {
      url: `${env.NEXT_PUBLIC_APP_URL}/orders/${orderId}/payment-mock`,
      sessionId: `mock_${orderId}`,
      mock: true as const,
    };
  }

  const items = lineItems.map((li) => ({
    price_data: {
      currency,
      product_data: { name: li.name },
      unit_amount: Math.round(li.amount * 100), // cents from server dollars
    },
    quantity: li.quantity,
  }));

  const session = await c.checkout.sessions.create({
    mode: "payment",
    customer_email: customerEmail,
    line_items: items,
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: { orderId },
    currency,
  });

  return { url: session.url as string, sessionId: session.id, mock: false as const };
}

export async function verifyWebhook(
  payload: string | Buffer,
  signature: string
): Promise<Stripe.Event> {
  const c = getClient();
  if (!c || !env.STRIPE_WEBHOOK_SECRET) {
    throw new Error("Stripe webhooks are not configured.");
  }
  return c.webhooks.constructEvent(
    payload,
    signature,
    env.STRIPE_WEBHOOK_SECRET
  );
}