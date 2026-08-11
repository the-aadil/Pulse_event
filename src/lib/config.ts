const required = {
  DATABASE_URL: process.env.DATABASE_URL ?? "file:./dev.db",
} as const;

export const SITE_CONFIG = {
  name: "Pulse Event",
  phone1: "8623032586",
  phone2: "9370403282",
  email: "Pulseevent564@gmail.com",
  address: "S.No. 543, NIBM Road, Pune - 48",
  hours: "Mon - Sun, 9:00 AM - 9:00 PM",
  socials: {
    instagram: "https://instagram.com/pulseevent",
    facebook: "https://facebook.com/pulseevent",
    whatsapp: `https://wa.me/918623032586`,
  },
  bookingFromEmail: process.env.BOOKING_FROM_EMAIL ?? "Pulseevent564@gmail.com",
} as const;

export const env = required;
