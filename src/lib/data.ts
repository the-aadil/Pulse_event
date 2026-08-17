import { db } from "@/lib/db";
import type { BookingStatus, EnquiryStatus } from "@/generated/prisma/enums";

export async function getActiveEvents() {
  return db.eventType.findMany({
    where: { active: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
}

export async function getFeaturedEvents() {
  return db.eventType.findMany({
    where: { active: true, featured: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
}

export async function getEventBySlug(slug: string) {
  return db.eventType.findFirst({
    where: { slug, active: true },
  });
}

export async function getAdminEvents() {
  return db.eventType.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
}

export async function getEventById(id: string) {
  return db.eventType.findUnique({ where: { id } });
}

export async function getRecentBookings(limit = 8) {
  return db.booking.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getBookingsByStatus(status: BookingStatus | "ALL") {
  return db.booking.findMany({
    where: status === "ALL" ? {} : { status },
    orderBy: { createdAt: "desc" },
  });
}

export async function getEnquiries(status: EnquiryStatus | "ALL" = "ALL") {
  return db.enquiry.findMany({
    where: status === "ALL" ? {} : { status },
    orderBy: { createdAt: "desc" },
  });
}

export async function getDashboardStats() {
  const [totalBookings, pendingBookings, confirmedBookings, totalEnquiries, unreadEnquiries, totalGuests] =
    await Promise.all([
      db.booking.count(),
      db.booking.count({ where: { status: "PENDING" } }),
      db.booking.count({ where: { status: "CONFIRMED" } }),
      db.enquiry.count(),
      db.enquiry.count({ where: { status: "NEW" } }),
      db.booking.aggregate({ _sum: { guests: true } }),
    ]);

  return {
    totalBookings,
    pendingBookings,
    confirmedBookings,
    totalEnquiries,
    unreadEnquiries,
    totalGuests: totalGuests._sum.guests ?? 0,
  };
}
