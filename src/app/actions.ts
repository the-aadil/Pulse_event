"use server";

import { cache } from "react";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import {
  bookingSchema,
  enquirySchema,
  loginSchema,
  adminEventSchema,
  flattenZodError,
} from "@/lib/validation";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import {
  createSession,
  destroySession,
  getSession,
  verifyPassword,
} from "@/lib/auth";

export type ActionResult = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
  reference?: string;
  retryAfter?: number;
};

async function getRateKey(action: string) {
  const h = await headers();
  return `${action}:${getClientIp(h)}`;
}

/**
 * isAdmin — cached per server-action invocation so multiple calls
 * within the same action request only hit the DB once.
 */
const isAdmin = cache(async (): Promise<boolean> => {
  const session = await getSession();
  if (!session) return false;
  const user = await db.adminUser.findUnique({
    where: { id: session.sub },
    select: { id: true },
  });
  return user !== null;
});

/**
 * Validate that a resource ID is a non-empty alphanumeric/hyphen string.
 * Prevents oversized or specially crafted IDs from hitting the database.
 */
function isValidId(id: string): boolean {
  return (
    typeof id === "string" &&
    id.length > 0 &&
    id.length <= 128 &&
    /^[\w-]+$/.test(id)
  );
}

function getFormString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function isHoneypotFilled(formData: FormData) {
  return (
    typeof formData.get("company_website") === "string" &&
    getFormString(formData, "company_website").length > 0
  );
}

// ─── Public form actions ───────────────────────────────────────────────────

export async function submitBooking(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const rl = rateLimit(await getRateKey("booking"), { limit: 5, windowMs: 60_000 });
  if (!rl.ok) {
    return {
      status: "error",
      message: "Too many attempts. Please try again in a moment.",
      retryAfter: rl.retryAfter,
    };
  }

  if (isHoneypotFilled(formData)) {
    return { status: "success", message: "Thank you! We'll be in touch soon." };
  }

  const parsed = bookingSchema.safeParse({
    name: getFormString(formData, "name"),
    email: getFormString(formData, "email"),
    phone: getFormString(formData, "phone"),
    eventType: getFormString(formData, "eventType"),
    eventDate: getFormString(formData, "eventDate"),
    guests: getFormString(formData, "guests"),
    city: getFormString(formData, "city"),
    message: getFormString(formData, "message"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the highlighted fields and try again.",
      fieldErrors: flattenZodError(parsed.error),
    };
  }

  const data = parsed.data;
  const eventDate = new Date(data.eventDate + "T00:00:00Z");
  if (eventDate.getTime() < Date.now() - 24 * 60 * 60 * 1000) {
    return {
      status: "error",
      message: "Please choose a date in the future.",
      fieldErrors: { eventDate: "Please choose a date in the future." },
    };
  }

  const eventExists = await db.eventType.findFirst({
    where: { slug: data.eventType, active: true },
    select: { id: true },
  });

  if (!eventExists) {
    return {
      status: "error",
      message: "Please select a valid event type.",
      fieldErrors: { eventType: "Please select a valid event type." },
    };
  }

  try {
    const booking = await db.booking.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        eventType: data.eventType,
        eventDate: data.eventDate,
        guests: data.guests,
        city: data.city || null,
        message: data.message || null,
        status: "PENDING",
      },
      select: { id: true },
    });

    return {
      status: "success",
      message:
        "Thank you! Your booking request has been received. Our team will call you shortly to confirm the details.",
      reference: booking.id,
    };
  } catch {
    return {
      status: "error",
      message:
        "Something went wrong while saving your request. Please try again in a few minutes.",
    };
  }
}

export async function submitEnquiry(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const rl = rateLimit(await getRateKey("enquiry"), { limit: 5, windowMs: 60_000 });
  if (!rl.ok) {
    return {
      status: "error",
      message: "Too many attempts. Please try again in a moment.",
      retryAfter: rl.retryAfter,
    };
  }

  if (isHoneypotFilled(formData)) {
    return { status: "success", message: "Thank you! We'll be in touch soon." };
  }

  const parsed = enquirySchema.safeParse({
    name: getFormString(formData, "name"),
    email: getFormString(formData, "email"),
    phone: getFormString(formData, "phone"),
    subject: getFormString(formData, "subject"),
    message: getFormString(formData, "message"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the highlighted fields and try again.",
      fieldErrors: flattenZodError(parsed.error),
    };
  }

  const data = parsed.data;

  try {
    await db.enquiry.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        subject: data.subject || null,
        message: data.message,
        status: "NEW",
      },
    });

    return {
      status: "success",
      message: "Message sent! We'll get back to you within 24 hours.",
    };
  } catch {
    return {
      status: "error",
      message:
        "Something went wrong while sending your message. Please try again in a few minutes.",
    };
  }
}

// ─── Auth actions ──────────────────────────────────────────────────────────

export async function adminLogin(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const rl = rateLimit(await getRateKey("login"), { limit: 15, windowMs: 60_000 });
  if (!rl.ok) {
    return {
      status: "error",
      message: "Too many login attempts. Please try again in a minute.",
      retryAfter: rl.retryAfter,
    };
  }

  const rawEmail = getFormString(formData, "email").trim().toLowerCase();
  const rawPassword = getFormString(formData, "password");
  const trimmedPassword = rawPassword.trim();

  const parsed = loginSchema.safeParse({
    email: rawEmail,
    password: trimmedPassword,
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please enter a valid email and password (minimum 8 characters).",
      fieldErrors: flattenZodError(parsed.error),
    };
  }

  const user = await db.adminUser.findUnique({
    where: { email: parsed.data.email },
    select: { id: true, email: true, name: true, passwordHash: true },
  });

  if (!user) {
    console.warn(`[Auth] Login failed: No admin found with email "${parsed.data.email}"`);
    return {
      status: "error",
      message: "Invalid email or password.",
    };
  }

  // Try with trimmed password first, then raw password
  let passwordOk = await verifyPassword(trimmedPassword, user.passwordHash);
  if (!passwordOk && rawPassword !== trimmedPassword) {
    passwordOk = await verifyPassword(rawPassword, user.passwordHash);
  }

  if (!passwordOk) {
    console.warn(`[Auth] Login failed: Password mismatch for email "${parsed.data.email}"`);
    return {
      status: "error",
      message: "Invalid email or password.",
    };
  }

  try {
    await createSession({ id: user.id, email: user.email, name: user.name });
    console.log(`[Auth] Login successful for user "${user.email}" (${user.name})`);
    return { status: "success", message: "Logged in." };
  } catch (err) {
    console.error(`[Auth] Session creation error:`, err);
    return {
      status: "error",
      message: "Failed to establish session. Please verify AUTH_SECRET is set.",
    };
  }
}


export async function adminLogout() {
  await destroySession();
  revalidatePath("/admin", "layout");
}

// ─── Admin: Booking actions ────────────────────────────────────────────────

const bookingStatusValues = z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"]);

export async function updateBookingStatus(bookingId: string, status: string) {
  if (!(await isAdmin())) {
    return { status: "error" as const, message: "Unauthorized." };
  }
  if (!isValidId(bookingId)) {
    return { status: "error" as const, message: "Invalid booking ID." };
  }
  const parsed = bookingStatusValues.safeParse(status);
  if (!parsed.success) {
    return { status: "error" as const, message: "Invalid status." };
  }

  const booking = await db.booking.findUnique({
    where: { id: bookingId },
    select: { id: true },
  });
  if (!booking) {
    return { status: "error" as const, message: "Booking not found." };
  }

  await db.booking.update({
    where: { id: bookingId },
    data: { status: parsed.data },
  });
  revalidatePath("/admin");
  revalidatePath("/admin/bookings");
  return { status: "success" as const, message: "Status updated." };
}

export async function deleteBooking(bookingId: string) {
  if (!(await isAdmin())) {
    return { status: "error" as const, message: "Unauthorized." };
  }
  if (!isValidId(bookingId)) {
    return { status: "error" as const, message: "Invalid booking ID." };
  }
  const booking = await db.booking.findUnique({
    where: { id: bookingId },
    select: { id: true },
  });
  if (!booking) {
    return { status: "error" as const, message: "Booking not found." };
  }
  await db.booking.delete({ where: { id: bookingId } });
  revalidatePath("/admin");
  revalidatePath("/admin/bookings");
  return { status: "success" as const, message: "Booking deleted." };
}

// ─── Admin: Enquiry actions ────────────────────────────────────────────────

const enquiryStatusValues = z.enum(["NEW", "READ", "REPLIED", "ARCHIVED"]);

export async function updateEnquiryStatus(enquiryId: string, status: string) {
  if (!(await isAdmin())) {
    return { status: "error" as const, message: "Unauthorized." };
  }
  if (!isValidId(enquiryId)) {
    return { status: "error" as const, message: "Invalid enquiry ID." };
  }
  const parsed = enquiryStatusValues.safeParse(status);
  if (!parsed.success) {
    return { status: "error" as const, message: "Invalid status." };
  }

  const enquiry = await db.enquiry.findUnique({
    where: { id: enquiryId },
    select: { id: true },
  });
  if (!enquiry) {
    return { status: "error" as const, message: "Enquiry not found." };
  }

  await db.enquiry.update({
    where: { id: enquiryId },
    data: { status: parsed.data },
  });
  revalidatePath("/admin");
  revalidatePath("/admin/enquiries");
  return { status: "success" as const, message: "Status updated." };
}

export async function deleteEnquiry(enquiryId: string) {
  if (!(await isAdmin())) {
    return { status: "error" as const, message: "Unauthorized." };
  }
  if (!isValidId(enquiryId)) {
    return { status: "error" as const, message: "Invalid enquiry ID." };
  }
  const enquiry = await db.enquiry.findUnique({
    where: { id: enquiryId },
    select: { id: true },
  });
  if (!enquiry) {
    return { status: "error" as const, message: "Enquiry not found." };
  }
  await db.enquiry.delete({ where: { id: enquiryId } });
  revalidatePath("/admin");
  revalidatePath("/admin/enquiries");
  return { status: "success" as const, message: "Enquiry deleted." };
}

// ─── Admin: Event actions ──────────────────────────────────────────────────

export async function createEvent(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  if (!(await isAdmin())) {
    return { status: "error", message: "Unauthorized." };
  }
  const parsed = adminEventSchema.safeParse({
    slug: getFormString(formData, "slug"),
    name: getFormString(formData, "name"),
    tagline: getFormString(formData, "tagline"),
    description: getFormString(formData, "description"),
    image: getFormString(formData, "image"),
    priceFrom: getFormString(formData, "priceFrom"),
    capacity: getFormString(formData, "capacity"),
    featured: getFormString(formData, "featured") === "on",
    active: getFormString(formData, "active") === "on",
    sortOrder: getFormString(formData, "sortOrder"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the highlighted fields and try again.",
      fieldErrors: flattenZodError(parsed.error),
    };
  }

  const slugExists = await db.eventType.findUnique({
    where: { slug: parsed.data.slug },
    select: { id: true },
  });
  if (slugExists) {
    return {
      status: "error",
      message: "An event with this slug already exists.",
      fieldErrors: { slug: "This slug is already in use." },
    };
  }

  try {
    await db.eventType.create({ data: parsed.data });
    revalidatePath("/");
    revalidatePath("/events");
    revalidatePath("/admin/events");
    return { status: "success", message: "Event created." };
  } catch {
    return {
      status: "error",
      message: "Something went wrong while creating the event. Please try again.",
    };
  }
}

export async function updateEvent(
  eventId: string,
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  if (!(await isAdmin())) {
    return { status: "error", message: "Unauthorized." };
  }
  if (!isValidId(eventId)) {
    return { status: "error", message: "Invalid event ID." };
  }
  const parsed = adminEventSchema.safeParse({
    slug: getFormString(formData, "slug"),
    name: getFormString(formData, "name"),
    tagline: getFormString(formData, "tagline"),
    description: getFormString(formData, "description"),
    image: getFormString(formData, "image"),
    priceFrom: getFormString(formData, "priceFrom"),
    capacity: getFormString(formData, "capacity"),
    featured: getFormString(formData, "featured") === "on",
    active: getFormString(formData, "active") === "on",
    sortOrder: getFormString(formData, "sortOrder"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the highlighted fields and try again.",
      fieldErrors: flattenZodError(parsed.error),
    };
  }

  const existing = await db.eventType.findUnique({
    where: { id: eventId },
    select: { id: true },
  });
  if (!existing) {
    return { status: "error", message: "Event not found." };
  }

  const slugConflict = await db.eventType.findFirst({
    where: { slug: parsed.data.slug, NOT: { id: eventId } },
    select: { id: true },
  });
  if (slugConflict) {
    return {
      status: "error",
      message: "Another event is already using this slug.",
      fieldErrors: { slug: "This slug is already in use." },
    };
  }

  try {
    await db.eventType.update({
      where: { id: eventId },
      data: parsed.data,
    });
    revalidatePath("/");
    revalidatePath("/events");
    revalidatePath("/events/" + parsed.data.slug);
    revalidatePath("/admin/events");
    return { status: "success", message: "Event updated." };
  } catch {
    return {
      status: "error",
      message: "Something went wrong while saving the event. Please try again.",
    };
  }
}

export async function deleteEvent(eventId: string) {
  if (!(await isAdmin())) {
    return { status: "error" as const, message: "Unauthorized." };
  }
  if (!isValidId(eventId)) {
    return { status: "error" as const, message: "Invalid event ID." };
  }
  const event = await db.eventType.findUnique({
    where: { id: eventId },
    select: { id: true },
  });
  if (!event) {
    return { status: "error" as const, message: "Event not found." };
  }
  await db.eventType.delete({ where: { id: eventId } });
  revalidatePath("/");
  revalidatePath("/events");
  revalidatePath("/admin/events");
  return { status: "success" as const, message: "Event deleted." };
}
