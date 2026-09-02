import { db } from "@/lib/db";
import { fail } from "@/lib/api-response";
import { verifyWebhook } from "@/lib/payments";
import { logWarn } from "@/lib/logging";

/**
 * POST /api/webhooks/stripe
 * Receives Stripe checkout events and reconciles payment status.
 * Driven by STRIPE_WEBHOOK_SECRET; returns 400 when payload/signature invalid.
 */
export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature");
  if (!signature) return fail(new Error("Missing stripe-signature header"));

  const payload = await req.text();
  let event;
  try {
    event = await verifyWebhook(payload, signature);
  } catch (err) {
    logWarn("Stripe webhook verification failed", {
      message: err instanceof Error ? err.message : String(err),
    });
    return fail(new Error("Invalid signature"));
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as {
        id?: string;
        metadata?: { orderId?: string };
      };
      const orderId = session.metadata?.orderId;
      if (orderId) {
        await db.order.updateMany({
          where: { id: orderId, stripeSessionId: null },
          data: { paymentStatus: "PAID", stripeSessionId: session.id },
        });
      }
    }
    return new Response(JSON.stringify({ success: true, received: true }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (err) {
    return fail(err);
  }
}