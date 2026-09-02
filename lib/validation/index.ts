import { z } from "zod";
import { PASSWORD_MIN_LENGTH, isStrongEnough } from "@/lib/auth/password";

/** Validate and, where useful, transform raw `req.json()` payloads. */
export function parseBody<T>(schema: z.ZodType<T>, body: unknown): T {
  return schema.parse(body);
}

// ── Auth ───────────────────────────────────────────────────────────────────

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(120),
  email: z.string().trim().toLowerCase().email("A valid email is required"),
  password: z
    .string()
    .min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters`)
    .refine(isStrongEnough, {
      message: "Password must include upper & lowercase letters and a number",
    }),
  phone: z.string().trim().optional(),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("A valid email is required"),
  password: z.string().min(1, "Password is required"),
});

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2).max(120).optional(),
  phone: z.string().trim().optional(),
});

// ── Reservations ───────────────────────────────────────────────────────────

export const reservationSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  email: z.string().trim().toLowerCase().email("A valid email is required"),
  phone: z.string().trim().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  time: z.string().regex(/^\d{1,2}:\d{2}(\s?[AP]M)?$/i, "A valid time is required"),
  guests: z.union([z.number().int().positive(), z.string().trim().transform(Number)]),
  occasion: z.string().trim().max(60).optional(),
  specialRequests: z.string().trim().max(2000).optional(),
});

export type ReservationInput = z.infer<typeof reservationSchema>;

export const availabilitySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  guests: z.number().int().min(1),
  time: z.string().optional(),
});

// ── Contact / private dining / newsletter ──────────────────────────────────

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().toLowerCase().email("A valid email is required"),
  phone: z.string().trim().max(30).optional(),
  subject: z.string().trim().max(120).optional(),
  message: z.string().trim().min(5, "Message is too short").max(5000),
});

export const privateDiningSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().toLowerCase().email("A valid email is required"),
  phone: z.string().trim().max(30).optional(),
  eventDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  guests: z.string().trim().optional(),
  eventType: z.string().trim().max(60).optional(),
  budget: z.string().trim().max(60).optional(),
  message: z.string().trim().max(5000).optional(),
});

export const newsletterSchema = z.object({
  email: z.string().trim().toLowerCase().email("A valid email is required"),
});

// ── Orders ─────────────────────────────────────────────────────────────────

export const cartLineSchema = z.object({
  itemId: z.string().min(1),
  quantity: z.number().int().min(1).max(100),
});

export const createOrderSchema = z.object({
  fulfillment: z.enum(["DINE_IN", "PICKUP", "DELIVERY"]),
  items: z.array(cartLineSchema).min(1, "Order must contain at least one item"),
  customerEmail: z.string().trim().toLowerCase().email().optional(),
  customerName: z.string().trim().optional(),
});

// ── Admin — generic id params and pagination ───────────────────────────────

export const idParamSchema = z.object({
  id: z.string().min(1),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const statusQuerySchema = paginationSchema.extend({
  status: z.string().optional(),
  q: z.string().optional(),
});

// ── Admin CRUD schemas ─────────────────────────────────────────────────────

export const adminMenuCategorySchema = z.object({
  name: z.string().trim().min(1).max(120),
  slug: z.string().trim().min(1).max(160),
  description: z.string().trim().max(500).optional(),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

export const adminMenuItemSchema = z.object({
  categoryId: z.string().min(1),
  name: z.string().trim().min(1).max(160),
  slug: z.string().trim().min(1).max(160),
  description: z.string().trim().max(1000).optional(),
  price: z.union([z.number().nonnegative(), z.string().transform(Number)]),
  image: z.string().url().optional().or(z.literal("")),
  ingredients: z.array(z.string()).default([]),
  allergens: z.array(z.string()).default([]),
  dietary: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  available: z.boolean().default(true),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export const adminGallerySchema = z.object({
  title: z.string().trim().min(1).max(160),
  imageUrl: z.string().url(),
  publicId: z.string().optional(),
  altText: z.string().trim().max(300).optional(),
  category: z.enum(["FOOD", "DINING", "KITCHEN", "BAR", "MOMENTS"]),
  sortOrder: z.number().int().default(0),
  isPublished: z.boolean().default(true),
});

export const adminTestimonialSchema = z.object({
  customerName: z.string().trim().min(1).max(120),
  quote: z.string().trim().min(1).max(2000),
  rating: z.number().int().min(1).max(5).default(5),
  image: z.string().url().optional().or(z.literal("")),
  isPublished: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export const adminTableSchema = z.object({
  name: z.string().trim().min(1).max(60),
  capacity: z.number().int().min(1).max(100),
  location: z.string().trim().max(120).optional(),
  isActive: z.boolean().default(true),
});

export const adminReservationUpdateSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "SEATED", "COMPLETED", "CANCELLED", "NO_SHOW"]),
  tableId: z.string().nullable().optional(),
  notes: z.string().trim().max(2000).optional(),
});

export const adminOrderUpdateSchema = z.object({
  status: z.enum([
    "PENDING",
    "CONFIRMED",
    "PREPARING",
    "READY",
    "OUT_FOR_DELIVERY",
    "COMPLETED",
    "CANCELLED",
    "REFUNDED",
  ]),
});

export const adminSettingsSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  tagline: z.string().trim().max(200).optional(),
  addressLine: z.string().trim().max(200).optional(),
  city: z.string().trim().max(120).optional(),
  phone: z.string().trim().max(30).optional(),
  email: z.string().trim().email().optional(),
  timezone: z.string().trim().max(80).optional(),
  currency: z.string().trim().length(3).optional(),
  taxRate: z.number().min(0).max(1).optional(),
  serviceFee: z.number().min(0).max(1).optional(),
  deliveryFee: z.number().min(0).optional(),
  reservationDurationMin: z.number().int().min(30).max(300).optional(),
  reservationBufferMin: z.number().int().min(0).max(120).optional(),
  minPartySize: z.number().int().min(1).max(50).optional(),
  maxPartySize: z.number().int().min(1).max(200).optional(),
});