import type {
  Dish,
  GalleryImage,
  MenuCategory,
  Testimonial,
  RestaurantInfo,
} from "./data";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  API MODULE — THE BACKEND-SWAP SEAM
 * ─────────────────────────────────────────────────────────────────────────────
 *  Every page and component talks to the outside world through these functions.
 *  They now call the real NOIRÉ backend (/api/*). Responses use the
 *  canonical envelope:  { success:true, data }  OR  { success:false, error }.
 *
 *  All functions preserve their original signatures and data shapes so the
 *  frontend components never change.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const API = ""; // same-origin; swap for an absolute base URL when needed.

/**
 * Fetch and unwrap the API envelope.
 * Throws an Error (with the server's message) on any non-2xx or failure body.
 */
async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: { "content-type": "application/json", ...(init?.headers ?? {}) },
    cache: "no-store",
  });

  let body: unknown = null;
  try {
    body = await res.json();
  } catch {
    body = null;
  }

  if (!res.ok || !body || typeof body !== "object" || !("success" in body)) {
    const message =
      body && typeof body === "object" && "error" in body
        ? (body as { error?: { message?: string } }).error?.message
        : `Request failed (${res.status})`;
    const fieldErrors =
      body && typeof body === "object" && "error" in body
        ? (body as { error?: { fieldErrors?: Record<string, string> } }).error?.fieldErrors
        : undefined;
    const err = new Error(message ?? "Request failed") as Error & {
      status?: number;
      fieldErrors?: Record<string, string>;
    };
    err.status = res.status;
    err.fieldErrors = fieldErrors;
    throw err;
  }

  const envelope = body as { success: boolean; data: T; meta?: unknown };
  return envelope.data;
}

/** Convert a menu item (backend) into the frontend Dish shape. */
function toDish(item: {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  image?: string | null;
  category: string;
  featured?: boolean;
  dietary?: string[];
}): Dish {
  return {
    id: item.id,
    name: item.name,
    description: item.description ?? "",
    price: item.price,
    image: item.image ?? "",
    category: item.category,
    featured: item.featured ?? false,
    dietary: item.dietary ?? [],
  };
}

/** Fetch the full menu, grouped by category. */
export async function getMenu(): Promise<MenuCategory[]> {
  const data = await request<{ categories: { id: string; name: string; slug: string; description: string | null; items: ReturnType<typeof toDish>[] }[] }>("/api/menu");
  return data.categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description ?? "",
    dishIds: c.items.map((i) => i.id),
    // Also expose items for consumption where helpful.
    items: c.items,
  }));
}

/** Fetch dishes that are featured on the homepage. */
export async function getFeaturedDishes(): Promise<Dish[]> {
  const data = await request<{ dishes: ReturnType<typeof toDish>[] }>("/api/menu/featured");
  return data.dishes.map(toDish);
}

/** Fetch a single dish by its id. */
export async function getDishById(id: string): Promise<Dish | undefined> {
  const data = await request<{ dish?: ReturnType<typeof toDish> }>(`/api/menu/${id}`);
  return data.dish ? toDish(data.dish) : undefined;
}

/** Fetch the gallery images. */
export async function getGallery(): Promise<GalleryImage[]> {
  const data = await request<{ images: { id: string; src: string; alt: string; category: string }[] }>("/api/gallery");
  return data.images.map((i) => ({
    id: i.id,
    src: i.src,
    alt: i.alt,
    category: (i.category as GalleryImage["category"]) ?? "moments",
  }));
}

/** Fetch guest testimonials. */
export async function getTestimonials(): Promise<Testimonial[]> {
  const data = await request<{ testimonials: { id: string; quote: string; guest: string; image?: string | null; rating?: number }[] }>("/api/testimonials");
  return data.testimonials.map((t) => ({
    id: t.id,
    quote: t.quote,
    guest: t.guest,
    source: t.rating ? `${t.rating}/5` : undefined,
  }));
}

/** Fetch restaurant information (address, hours, contact). */
export async function getRestaurantInfo(): Promise<RestaurantInfo> {
  const data = await request<{ restaurant: Record<string, unknown> | null; hours?: never[]; closures?: never[] }>("/api/restaurant");
  const r = (data.restaurant ?? {}) as Record<string, string | null>;
  return {
    name: (r.name as string) ?? "NOIRÉ",
    tagline: (r.tagline as string) ?? "",
    address: {
      street: (r.addressLine as string) ?? "",
      city: (r.city as string) ?? "",
    },
    phone: (r.phone as string) ?? "",
    email: (r.email as string) ?? "",
    instagram: "",
    facebook: "",
    hours: [],
  };
}

export interface ReservationRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: string;
  occasion: string;
  specialRequests?: string;
}

export interface ReservationResult {
  ok: boolean;
  confirmation?: string;
  message: string;
}

/** Submit a reservation request to the real backend. */
export async function submitReservation(request_: ReservationRequest): Promise<ReservationResult> {
  const guests = request_.guests.replace("+", "").trim();
  const data = await request<{ confirmation: string; message: string }>("/api/reservations", {
    method: "POST",
    body: JSON.stringify({
      firstName: request_.firstName,
      lastName: request_.lastName,
      email: request_.email,
      phone: request_.phone,
      date: request_.date,
      time: request_.time,
      guests: Number(guests) || 2,
      occasion: request_.occasion,
      specialRequests: request_.specialRequests ?? "",
    }),
  });
  return { ok: true, confirmation: data.confirmation, message: data.message };
}

export interface ContactRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactResult {
  ok: boolean;
  message: string;
}

/** Submit a contact form message to the real backend. */
export async function submitContact(request2: ContactRequest): Promise<ContactResult> {
  const data = await request<{ message: string }>("/api/contact", {
    method: "POST",
    body: JSON.stringify({
      name: request2.name,
      email: request2.email,
      subject: request2.subject,
      message: request2.message,
    }),
  });
  return { ok: true, message: data.message };
}

export interface EventInquiryRequest {
  name: string;
  email: string;
  phone: string;
  eventType: string;
  guests: string;
  date: string;
  budget: string;
  message: string;
}

export interface EventInquiryResult {
  ok: boolean;
  message: string;
}

/** Submit a private dining inquiry to the real backend. */
export async function submitEventInquiry(request3: EventInquiryRequest): Promise<EventInquiryResult> {
  const data = await request<{ message: string }>("/api/private-dining", {
    method: "POST",
    body: JSON.stringify({
      name: request3.name,
      email: request3.email,
      phone: request3.phone,
      eventType: request3.eventType,
      guests: request3.guests ? Number(String(request3.guests).replace(/\D/g, "")) || undefined : undefined,
      eventDate: request3.date || undefined,
      budget: request3.budget,
      message: request3.message,
    }),
  });
  return { ok: true, message: data.message };
}

/** Submit a newsletter signup to the real backend. */
export async function subscribeNewsletter(email: string): Promise<{ ok: boolean; message: string }> {
  const data = await request<{ message: string }>("/api/newsletter", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
  return { ok: true, message: data.message };
}

/**
 * Free-text search across the restaurant's content.
 */
export async function searchEverything(
  query: string
): Promise<{
  dishes: Dish[];
  pages: { title: string; href: string; excerpt: string }[];
}> {
  const q = query.trim();
  if (!q) return { dishes: [], pages: [] };
  const data = await request<{
    dishes: ReturnType<typeof toDish>[];
    pages: { title: string; href: string; excerpt: string }[];
  }>(`/api/search?q=${encodeURIComponent(q)}`);
  return { dishes: data.dishes.map(toDish), pages: data.pages };
}