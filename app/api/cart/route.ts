import { z } from "zod";
import crypto from "node:crypto";
import { db } from "@/lib/db";
import { ok, created, fail } from "@/lib/api-response";
import { NotFoundError } from "@/lib/errors";
import { getSession } from "@/lib/auth/session";
import { readJson, validationErrorFromZod, decimalsToNumbers } from "@/lib/util";

const addItemSchema = z.object({
  itemId: z.string().min(1),
  quantity: z.number().int().min(1).max(100).default(1),
});

const CART_COOKIE = "noire_guest_cart";

async function resolveCart() {
  const session = await getSession();

  // Signed-in: one cart per user.
  if (session) {
    return db.cart.upsert({
      where: { userId: session.userId },
      create: { userId: session.userId },
      update: {},
    });
  }

  // Guest: derive a stable anonymous id from a cookie, else create one.
  const { cookies } = await import("next/headers");
  const store = await cookies();
  let token = store.get(CART_COOKIE)?.value;
  if (!token) {
    token = crypto.randomBytes(20).toString("hex");
    store.set(CART_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  }
  const cart = await db.cart.upsert({
    where: { guestToken: token },
    create: { guestToken: token },
    update: {},
  });
  return cart;
}

/** GET /api/cart — current cart with populated item info and totals. */
export async function GET() {
  try {
    const cart = await resolveCart();
    const items = await db.cartItem.findMany({
      where: { cartId: cart.id },
      orderBy: { createdAt: "asc" },
    });
    return ok({ cart: decimalsToNumbers({ id: cart.id, items }) });
  } catch (e) {
    return fail(e);
  }
}

/** POST /api/cart — add/merge an item into the cart. */
export async function POST(req: Request) {
  try {
    const cart = await resolveCart();
    const body = await readJson(req);
    const parsed = addItemSchema.safeParse(body);
    if (!parsed.success) {
      return fail(validationErrorFromZod(parsed.error, "Invalid cart item"));
    }

    const menu = await db.menuItem.findFirst({
      where: { id: parsed.data.itemId, isActive: true, available: true },
    });
    if (!menu) throw new NotFoundError("Menu item not available");

    const qty = parsed.data.quantity;
    const existing = await db.cartItem.findFirst({
      where: { cartId: cart.id, itemId: menu.id },
    });

    let item;
    if (existing) {
      item = await db.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + qty },
      });
    } else {
      item = await db.cartItem.create({
        data: {
          cartId: cart.id,
          itemId: menu.id,
          name: menu.name,
          unitPrice: menu.price,
          quantity: qty,
        },
      });
    }

    return created(decimalsToNumbers(item));
  } catch (e) {
    return fail(e);
  }
}