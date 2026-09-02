import { db } from "@/lib/db";
import { ok, fail } from "@/lib/api-response";
import { requireManager } from "@/lib/admin";

/** GET /api/admin/dashboard — high-level operational stats (manager+). */
export async function GET() {
  try {
    await requireManager();

    const [
      pendingReservations,
      activeOpenReservations,
      todayReservations,
      newInquiries,
      openOrders,
      unreadContacts,
      subscriberCount,
      menuItemCount,
    ] = await Promise.all([
      db.reservation.count({ where: { status: "PENDING" } }),
      db.reservation.count({
        where: { status: { in: ["PENDING", "CONFIRMED", "SEATED"] }, date: { gte: new Date() } },
      }),
      db.reservation.count({
        where: { date: new Date(new Date().toISOString().slice(0, 10) + "T00:00:00.000Z") },
      }),
      db.privateDiningInquiry.count({ where: { status: "NEW" } }),
      db.order.count({ where: { status: { in: ["PENDING", "CONFIRMED", "PREPARING"] } } }),
      db.contactMessage.count({ where: { status: "NEW" } }),
      db.newsletterSubscriber.count({ where: { status: "SUBSCRIBED" } }),
      db.menuItem.count({ where: { isActive: true } }),
    ]);

    return ok({
      pendingReservations,
      activeOpenReservations,
      todayReservations,
      newInquiries,
      openOrders,
      unreadContacts,
      subscriberCount,
      menuItemCount,
    });
  } catch (e) {
    return fail(e);
  }
}