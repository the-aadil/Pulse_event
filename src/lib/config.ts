const required = {
  DATABASE_URL: process.env.DATABASE_URL ?? "file:./dev.db",
} as const;

export const SITE_CONFIG = {
  name: "Pulse Event",
  phone1: "8623032586",
  email: "Pulseevent564@gmail.com",
  address: "NIBM Road, Pune",
  hours: "Mon - Sun, 9:00 AM - 9:00 PM",
  socials: {
    instagram: "https://instagram.com/pulseevent",
    facebook: "https://facebook.com/pulseevent",
    whatsapp: `https://wa.me/918623032586`,
  },
  bookingFromEmail: process.env.BOOKING_FROM_EMAIL ?? "Pulseevent564@gmail.com",
} as const;

export const env = required;
