/** Format a price in whole dollars, e.g. 18 -> "$18". */
export function formatPrice(price: number): string {
  return `$${price}`;
}

/** Format a date value (from an <input type="date">) for display. */
export function formatDate(date: string): string {
  if (!date) return "";
  const [y, m, d] = date.split("-");
  if (!y || !m || !d) return date;
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const monthName = months[Number(m) - 1] ?? m;
  return `${monthName} ${Number(d)}, ${y}`;
}

/**
 * Friendly reservation window — used by the reservations page.
 * Returns today's date as a `yyyy-mm-dd` string (local time).
 */
export function todayISO(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Human list helper — joines contact details nicely (internal use). */
export function joinList(items: string[]): string {
  return items.join(", ");
}