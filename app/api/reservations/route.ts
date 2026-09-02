import { z } from "zod";
import { ok, fail } from "@/lib/api-response";
import { rateLimit } from "@/lib/rate-limit";
import { clientIp, hashIp } from "@/lib/guards";
import { getSession } from "@/lib/auth/session";
import { readJson, validationErrorFromZod } from "@/lib/util";
import { createReservation } from "@/lib/services/reservations";
import { sendEmail, reservationConfirmationHtml } from "@/lib/email";

const bodySchema = z.object({
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  email: z.string().trim().toLowerCase().email(),
  phone: z.string().trim().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().min(1),
  guests: z.coerce.number().int().min(1),
  occasion: z.string().trim().max(60).optional(),
  specialRequests: z.string().trim().max(2000).optional(),
});

/** POST /api/reservations — create a reservation request. */
export async function POST(req: Request) {
  try {
    await rateLimit([hashIp(clientIp(req))], { limit: 10, windowSeconds: 60, prefix: "reservation" });

    const session = await getSession();
    const body = await readJson(req);
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      return fail(validationErrorFromZod(parsed.error, "Invalid reservation data"));
    }

    const data = parsed.data;
    const guestName = `${data.firstName} ${data.lastName}`;

    const reservation = await createReservation({
      guestName,
      email: data.email,
      phone: data.phone,
      date: data.date,
      time: data.time,
      guests: data.guests,
      occasion: data.occasion,
      specialRequest: data.specialRequests,
      userId: session?.userId,
      source: "web",
    });

    // Fire-and-forget confirmation email; never block the happy path.
    void sendEmail({
      to: data.email,
      subject: `Your NOIRÉ reservation — ${data.date}`,
      html: reservationConfirmationHtml({
        guestName,
        date: data.date,
        time: data.time,
        guests: data.guests,
      }),
    });

    return ok(
      {
        confirmation: `NR-${reservation.createdAt.getTime().toString(36).toUpperCase()}`,
        message: "Your reservation request has been received.",
        reservation,
      },
      { status: 201 }
    );
  } catch (e) {
    return fail(e);
  }
}