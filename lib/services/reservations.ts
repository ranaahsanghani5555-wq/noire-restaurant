import { db } from "@/lib/db";
import { UnavailableError, ConflictError } from "@/lib/errors";
import type { ReservationStatus } from "@prisma/client";

/**
 * Reservation availability engine.
 *
 * A reservation occupies one or more tables from `startTime` to `endTime`
 * within an opening window and is blocked by restaurant closures. We model
 * seat capacity per "slot". A party is seatable if there exists at least one
 * contiguous combination of active tables whose total capacity fits the party
 * AND that is not overlapping an existing confirmed/active reservation.
 *
 * To keep availability genuinely real (not guesswork), we compute per-table
 * overlap over the booking interval rather than a single capacity number.
 */

const ACTIVE_STATUSES: ReservationStatus[] = [
  "PENDING",
  "CONFIRMED",
  "SEATED",
];

const toMinutes = (hhmm: string): number => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

/** Does the proposed [start,end) overlap an active reservation [rStart,rEnd)? */
function overlaps(
  start: number,
  end: number,
  rStart: number,
  rEnd: number
): boolean {
  return start < rEnd && end > rStart;
}

/** Humans expect "18:30" from the UI; normalize to HH:MM (24h) for storage. */
export function normalizeTime(input: string): string {
  const trimmed = input.trim().toUpperCase();
  const match = trimmed.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?$/);
  if (!match) throw new UnavailableError("Invalid time format");
  let hours = Number(match[1]);
  const minutes = match[2] ? Number(match[2]) : 0;
  const meridiem = match[3];
  if (meridiem) {
    if (hours > 12 || hours < 1) throw new UnavailableError("Invalid time");
    if (meridiem === "PM" && hours !== 12) hours += 12;
    if (meridiem === "AM" && hours === 12) hours = 0;
  } else {
    if (hours > 23) throw new UnavailableError("Invalid time");
  }
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

/** Load restaurant settings for the reservation config. */
async function settings() {
  const s = await db.restaurantSettings.findUnique({ where: { id: 1 } });
  const fallback = {
    reservationDurationMin: 90,
    reservationBufferMin: 15,
    minPartySize: 1,
    maxPartySize: 12,
  };
  if (!s) return fallback;
  return {
    reservationDurationMin: s.reservationDurationMin,
    reservationBufferMin: s.reservationBufferMin,
    minPartySize: s.minPartySize,
    maxPartySize: s.maxPartySize,
  };
}

interface CheckResult {
  open: boolean;
  close?: string;
  reason?: string;
  available?: boolean;
  requestedTime?: string;
  guests?: number;
}

/**
 * Validate a requested date/time & party size against opening hours, closures,
 * and party bounds. Returns the normalized startTime and effective window that
 * the caller must then use when checking table availability.
 */
export async function validateAvailability(input: {
  date: string; // "YYYY-MM-DD"
  time?: string;
  guests: number;
}): Promise<CheckResult> {
  const cfg = await settings();

  if (input.guests < cfg.minPartySize || input.guests > cfg.maxPartySize) {
    throw new UnavailableError(
      `Party size must be between ${cfg.minPartySize} and ${cfg.maxPartySize}`
    );
  }

  const date = new Date(`${input.date}T00:00:00.000Z`);
  const day = date.getUTCDay();

  const hours = await db.openingHours.findFirst({
    where: { dayOfWeek: day, isOpen: true },
  });

  if (!hours) {
    return { open: false, reason: "CLOSED_DAY", guests: input.guests };
  }

  const closure = await db.closure.count({
    where: { date: date, scope: "RESERVATION" },
  });
  if (closure > 0) {
    return { open: false, reason: "CLOSURE", guests: input.guests };
  }

  const duration = cfg.reservationDurationMin;
  const start = input.time ? normalizeTime(input.time) : hours.openTime;
  const startMin = toMinutes(start);
  const endMin = startMin + duration;
  const closeMin = toMinutes(hours.closeTime);

  if (endMin > closeMin) {
    return {
      open: false,
      reason: "NOT_IN_OPENING_WINDOW",
      close: hours.closeTime,
      requestedTime: input.time,
      guests: input.guests,
      available: false,
    };
  }

  return {
    open: true,
    close: hours.closeTime,
    requestedTime: input.time,
    guests: input.guests,
    available: await checkTables({
      date,
      start,
      duration,
      guests: input.guests,
      excludeReservationId: undefined,
    }),
  };
}

/**
 * Core scalability check: can the party be seated in the current free
 * capacity during [start, start+duration]? Excludes a reservation being edited
 * (so a user can keep their own booking).
 */
export async function checkTables(args: {
  date: Date;
  start: string; // "18:30" (already normalized)
  duration: number;
  guests: number;
  excludeReservationId?: string;
}): Promise<boolean> {
  const { date, start, duration, guests, excludeReservationId } = args;
  const startMin = toMinutes(start);
  const endMin = startMin + duration;

  const tables = await db.diningTable.findMany({ where: { isActive: true } });

  // Determine which tables are free during this window.
  const active = await db.reservation.findMany({
    where: {
      status: { in: ACTIVE_STATUSES },
      date: date,
      id: excludeReservationId ? { not: excludeReservationId } : undefined,
    },
    select: { tableId: true, startTime: true, endTime: true },
  });

  const busyTableIds = new Set<string>();
  for (const r of active) {
    if (!r.tableId) continue;
    if (overlaps(startMin, endMin, toMinutes(r.startTime), toMinutes(r.endTime))) {
      busyTableIds.add(r.tableId);
    }
  }

  const free = tables
    .filter((t) => !busyTableIds.has(t.id))
    .sort((a, b) => a.capacity - b.capacity);

  return canFit(free, guests);
}

/** Greedy-ish bin packing: try to seat `guests` from the free, sorted tables. */
export function canFit(
  free: { capacity: number }[],
  guests: number
): boolean {
  if (guests <= 0) return true;
  if (free.length === 0) return false;
  // Sum of capacities may just exceed guests if we can split the party.
  const total = free.reduce((sum, t) => sum + t.capacity, 0);
  if (total < guests) return false;

  // Prefer the smallest single table that fits.
  for (let i = 0; i < free.length; i++) {
    if (free[i].capacity >= guests) return true;
  }
  // Otherwise combine the largest tables.
  let capacity = 0;
  for (const t of [...free].sort((a, b) => b.capacity - a.capacity)) {
    capacity += t.capacity;
    if (capacity >= guests) return true;
  }
  return false;
}

/** Suggested alternative times when the requested slot is full. */
export async function alternatives(input: {
  date: string;
  guests: number;
}) {
  const cfg = await settings();
  const date = new Date(`${input.date}T00:00:00.000Z`);
  const day = date.getUTCDay();
  const hours = await db.openingHours.findFirst({
    where: { dayOfWeek: day, isOpen: true },
  });
  if (!hours) return [];

  const duration = cfg.reservationDurationMin;
  const step = 30;
  const slots: string[] = [];
  for (let m = toMinutes(hours.openTime); m + duration <= toMinutes(hours.closeTime); m += step) {
    const hh = Math.floor(m / 60);
    const mm = m % 60;
    const slot = `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
    const available = await checkTables({ date, start: slot, duration, guests: input.guests });
    if (available) slots.push(slot);
  }
  return slots;
}

/** Create a reservation, binding the best fitting free tables. */
export async function createReservation(input: {
  guestName: string;
  email: string;
  phone?: string;
  date: string;
  time: string;
  guests: number;
  occasion?: string;
  specialRequest?: string;
  userId?: string;
  source?: string;
}) {
  const cfg = await settings();
  const start = normalizeTime(input.time);
  const duration = cfg.reservationDurationMin;
  const date = new Date(`${input.date}T00:00:00.000Z`);

  const valid = await validateAvailability({
    date: input.date,
    time: input.time,
    guests: input.guests,
  });

  if (!valid.available) {
    throw new UnavailableError(
      "No tables are available at that time. Please choose another time."
    );
  }

  return db.$transaction(async (tx) => {
    // Reserve the smallest fit currently free.
    const assigned = await assignSmallestTable(tx, {
      date,
      start,
      duration,
      guests: input.guests,
    });
    if (!assigned) {
      throw new ConflictError(
        "This slot was taken while booking. Please pick another time."
      );
    }

    const end = `${minutesToHhmm(toMinutes(start) + duration)}`;
    return tx.reservation.create({
      data: {
        userId: input.userId,
        guestName: input.guestName,
        email: input.email,
        phone: input.phone,
        date,
        startTime: start,
        endTime: end,
        partySize: input.guests,
        tableId: assigned.id,
        occasion: input.occasion,
        specialRequest: input.specialRequest,
        source: input.source ?? "web",
        status: "PENDING",
      },
    });
  });
}

function minutesToHhmm(mins: number): string {
  return `${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;
}

/**
 * Find the smallest single free table (or best combination) that fits, after
 * the window is confirmed to have capacity. Returns the table to assign.
 */
async function assignSmallestTable(
  tx: import("@prisma/client").Prisma.TransactionClient,
  args: { date: Date; start: string; duration: number; guests: number }
) {
  const { date, start, duration, guests } = args;
  const startMin = toMinutes(start);
  const endMin = startMin + duration;

  const tables = await tx.diningTable.findMany({ where: { isActive: true } });
  const active = await tx.reservation.findMany({
    where: { status: { in: ACTIVE_STATUSES }, date },
    select: { tableId: true, startTime: true, endTime: true },
  });

  const busy = new Set<string>();
  for (const r of active) {
    if (!r.tableId) continue;
    if (overlaps(startMin, endMin, toMinutes(r.startTime), toMinutes(r.endTime))) {
      busy.add(r.tableId);
    }
  }

  const free = tables
    .filter((t) => !busy.has(t.id))
    .sort((a, b) => a.capacity - b.capacity);

  // Smallest single table that fits.
  const single = free.find((t) => t.capacity >= guests);
  if (single) return single;

  // Otherwise the largest table if a combination could fit (best-effort).
  const biggest = [...free].sort((a, b) => b.capacity - a.capacity)[0];
  return biggest ?? null;
}