import "dotenv/config";
import { defineConfig } from "prisma/config";

const rawUrl = (process.env["DATABASE_URL"] ?? "").trim();
const fallbackUrl =
  "postgresql://neondb_owner:npg_QST5hvxfkM8t@ep-snowy-wildflower-axuem1hd-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

const url =
  rawUrl.startsWith("postgresql://") || rawUrl.startsWith("postgres://")
    ? rawUrl
    : fallbackUrl;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url,
  },
});
