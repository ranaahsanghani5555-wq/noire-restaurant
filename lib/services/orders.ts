import { db } from "@/lib/db";
import { NotFoundError } from "@/lib/errors";
import { Prisma } from "@prisma/client";

/**
 * Server-side order pricing.
 * The client never supplies prices or totals — we re-derive every unit price
 * from the menu and compute subtotal, tax, fees, discount, and total here.
 */

async function fetchSettings() {
  const s = await db.restaurantSettings.findUnique({ where: { id: 1 } });
  const zero = new Prisma.Decimal(0);
  return {
    taxRate: s?.taxRate ?? zero,
    serviceFee: s?.serviceFee ?? zero,
    deliveryFee: s?.deliveryFee ?? zero,
  };
}

export interface OrderLineInput {
  itemId: string;
  quantity: number;
}

export interface PricedOrderLine {
  itemId: string;
  name: string;
  unitPrice: Prisma.Decimal;
  quantity: number;
  lineTotal: Prisma.Decimal;
}

/** Resolve cart/pr order lines and compute all money server-side. */
export async function priceOrder(lines: OrderLineInput[]) {
  if (lines.length === 0) {
    throw new NotFoundError("No items provided.");
  }

  const ids = lines.map((l) => l.itemId);
  const items = await db.menuItem.findMany({
    where: { id: { in: ids }, isActive: true, available: true },
    select: { id: true, name: true, price: true },
  });
  const byId = new Map(items.map((i) => [i.id, i]));

  const pricing = await fetchSettings();

  let subtotal = new Prisma.Decimal(0);
  const priced: PricedOrderLine[] = [];

  for (const line of lines) {
    const menu = byId.get(line.itemId);
    if (!menu) {
      throw new NotFoundError(`Menu item no longer available`);
    }
    const quantity = new Prisma.Decimal(line.quantity);
    const unitPrice = menu.price;
    const lineTotal = unitPrice.mul(quantity);
    subtotal = subtotal.add(lineTotal);
    priced.push({
      itemId: menu.id,
      name: menu.name,
      unitPrice,
      quantity: line.quantity,
      lineTotal,
    });
  }

  // Round money to cents.
  const round2 = (d: Prisma.Decimal) => d.toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP);
  subtotal = round2(subtotal);

  const tax = round2(subtotal.mul(pricing.taxRate));
  const serviceFee = round2(subtotal.mul(pricing.serviceFee));
  const deliveryFee = pricing.deliveryFee;
  const discount = new Prisma.Decimal(0);
  const total = round2(subtotal.add(tax).add(serviceFee).add(deliveryFee).sub(discount));

  return { priced, subtotal, tax, serviceFee, deliveryFee, discount, total };
}

/** Persist an order from priced lines with a human-friendly unique number. */
export async function createOrder(args: {
  fulfillment: "DINE_IN" | "PICKUP" | "DELIVERY";
  items: OrderLineInput[];
  userId?: string;
  customerEmail?: string;
  customerName?: string;
}) {
  const { priced, subtotal, tax, serviceFee, deliveryFee, discount, total } =
    await priceOrder(args.items);

  const number = await nextOrderNumber();

  return db.order.create({
    data: {
      number,
      userId: args.userId,
      customerEmail: args.customerEmail,
      customerName: args.customerName,
      fulfillment: args.fulfillment,
      status: "PENDING",
      paymentStatus: "UNPAID",
      subtotal,
      tax,
      serviceFee,
      deliveryFee,
      discount,
      total,
      items: {
        create: priced.map((l) => ({
          itemId: l.itemId,
          name: l.name,
          unitPrice: l.unitPrice,
          quantity: l.quantity,
          lineTotal: l.lineTotal,
        })),
      },
    },
    include: { items: true },
  });
}

/** Human-friendly, practically-unique order numbers tied to the timestamp. */
function nextOrderNumber(): Promise<string> {
  const base = new Date().toISOString().replace(/\D/g, "").slice(0, 14);
  const rnd = Math.random().toString(36).slice(2, 6).toUpperCase();
  return Promise.resolve(`NOIRE-${base}${rnd}`);
}