import { z } from "zod";

export const phoneRegex = /^[+]?[\d\s-]{10,15}$/;

export const bookingSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name.").max(100),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address.")
    .max(254),
  phone: z
    .string()
    .trim()
    .regex(phoneRegex, "Please enter a valid phone number.")
    .max(20),
  eventType: z
    .string()
    .trim()
    .min(2, "Please select an event type.")
    .max(100),
  eventDate: z
    .string()
    .trim()
    .refine((v) => /^\d{4}-\d{2}-\d{2}$/.test(v), {
      message: "Please pick a valid date.",
    })
    .refine((v) => !Number.isNaN(new Date(v).getTime()), {
      message: "Please pick a valid date.",
    }),
  guests: z.coerce
    .number()
    .int("Guests must be a whole number.")
    .min(1, "At least 1 guest is required.")
    .max(100000, "That guest count looks too large."),
  city: z.string().trim().max(100).optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
});

export type BookingInput = z.infer<typeof bookingSchema>;

export const enquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name.").max(100),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address.")
    .max(254),
  phone: z
    .string()
    .trim()
    .regex(phoneRegex, "Please enter a valid phone number.")
    .max(20)
    .optional()
    .or(z.literal("")),
  subject: z.string().trim().max(200).optional().or(z.literal("")),
  message: z.string().trim().min(10, "Please write a message of at least 10 characters.").max(2000),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address.")
    .max(254),
  password: z.string().min(8, "Password must be at least 8 characters.").max(128),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const adminEventSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(2, "Slug must be at least 2 characters.")
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug may only contain lowercase letters, numbers and hyphens."),
  name: z.string().trim().min(2, "Name must be at least 2 characters.").max(100),
  tagline: z.string().trim().max(160).optional().or(z.literal("")),
  description: z.string().trim().min(10, "Description must be at least 10 characters.").max(4000),
  image: z.string().trim().max(500).optional().or(z.literal("")),
  priceFrom: z.coerce.number().int().min(0).max(100_000_000).optional().nullable(),
  capacity: z.coerce.number().int().min(1).max(1_000_000).optional().nullable(),
  featured: z.coerce.boolean().default(false),
  active: z.coerce.boolean().default(true),
  sortOrder: z.coerce.number().int().min(0).max(99999).default(0),
});

export type AdminEventInput = z.infer<typeof adminEventSchema>;

export const profileImageUploadSchema = z.object({
  fileSize: z
    .number()
    .max(2 * 1024 * 1024, "Profile image must be less than 2MB."),
  mimeType: z.enum(["image/webp", "image/jpeg", "image/png"], {
    message: "Only WebP, JPEG, and PNG images are allowed.",
  }),
});

export type ProfileImageUploadInput = z.infer<typeof profileImageUploadSchema>;

export function flattenZodError(error: z.ZodError): Record<string, string> {
  const issues: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".");
    if (!issues[key]) {
      issues[key] = issue.message;
    }
  }
  return issues;
}
