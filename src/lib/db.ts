import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const DEFAULT_DATABASE_URL =
  "postgresql://neondb_owner:npg_QST5hvxfkM8t@ep-snowy-wildflower-axuem1hd-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

function createClient() {
  const connectionString = process.env.DATABASE_URL || DEFAULT_DATABASE_URL;
  const adapter = new PrismaNeon({
    connectionString,
  });
  return new PrismaClient({ adapter });
}


export const db = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
