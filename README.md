# Pulse_Event — Event Management Platform

A production-ready, full-stack event management website for **Pulse Event** (Pune).
Built with **Next.js 16 (App Router)**, **Tailwind CSS 4**, **TypeScript**, and
**Prisma + SQLite** (with an easy switch to PostgreSQL for production).

## Features

### Public website
- Responsive landing page (hero, stats, featured events, services, gallery preview, testimonials, CTA)
- Event catalogue with individual event detail pages
- Booking request form with full server-side validation, spam honeypot and rate limiting
- Contact page with enquiry form
- Gallery and About pages
- SEO metadata (Open Graph, Twitter, robots), custom 404 / error pages
- Fast: statically prerendered marketing pages, on-demand server rendering for data pages

### Admin panel (`/admin`)
- Secure login (bcrypt password hashing, signed HTTP-only session cookies, JWT)
- Dashboard with live stats (bookings, enquiries, guests, pipeline)
- Manage bookings (filter by status, update status, delete)
- Manage enquiries (mark read/replied/archived, delete)
- Full CRUD for event types (create / edit / hide / feature / delete)
- Every admin mutation is authorization-checked server-side
- Rate limiting on public forms and the login endpoint

## Tech stack

| Layer       | Choice |
|-------------|--------|
| Framework   | Next.js 16 (App Router, Server Actions) |
| UI          | Tailwind CSS 4, React 19 |
| Validation  | Zod |
| Database    | Prisma ORM + SQLite (better-sqlite3 driver adapter) |
| Auth        | bcryptjs + jose (HS256 session JWT) |

## Getting started

Requirements: **Node.js 20+**

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
#    Copy .env.example to .env and set AUTH_SECRET (and ADMIN_PASSWORD for seeding).
copy .env.example .env

# 3. Create the database + seed (admin user + event types)
npm run setup

# 4. Run the app
npm run dev          # http://localhost:3000
```

Default seeded admin credentials (only when `ADMIN_PASSWORD` is not set):

```
Email:    admin@pulseevent.com
Password: Pulse@Admin#2026
```

> ⚠️ **Change the admin password before going live.** Set `ADMIN_PASSWORD`
> in `.env` **before** running the seed, or update the password after seeding.

## Scripts

| Command              | Description |
|----------------------|-------------|
| `npm run dev`        | Start dev server |
| `npm run build`      | Production build |
| `npm run start`      | Serve production build |
| `npm run lint`       | ESLint |
| `npm run typecheck`  | TypeScript check |
| `npm run db:migrate` | Create/apply Prisma migrations |
| `npm run db:seed`    | Seed admin + event types |
| `npm run db:studio`  | Open Prisma Studio |
| `npm run generate:images` | Regenerate SVG artwork in `public/images` |

## Environment variables

| Variable                | Description |
|-------------------------|-------------|
| `DATABASE_URL`          | SQLite path (default `file:./dev.db`) or a PostgreSQL URL |
| `AUTH_SECRET`           | **Required.** Signs admin session cookies. Generate with `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` |
| `ADMIN_EMAIL`           | Email for the seeded admin user |
| `ADMIN_PASSWORD`        | Password for the seeded admin user |
| `NEXT_PUBLIC_SITE_URL`  | Canonical site URL used in SEO metadata |

## Deployment notes (production)

1. **Database:** switch to PostgreSQL for multi-instance scaling.
   - Change `DATABASE_URL` to a PostgreSQL connection string.
   - Install `@prisma/adapter-pg`, then update the adapter in `src/lib/db.ts`.
   - Run `npm run db:migrate` (or `prisma migrate deploy`) and `npm run db:seed` once.
2. **Secrets:** set a strong, stable `AUTH_SECRET`. Keep it identical across all instances.
3. **Rate limiting:** the in-memory limiter (`src/lib/rate-limit.ts`) is per-instance.
   For a multi-instance deployment, replace it with a shared store (e.g. Redis).
4. **Images:** artwork is generated as SVGs (`npm run generate:images`). Replace
   them with real photography in `public/images` or via an image CDN.

## Project structure

```
src/
  app/                  # App Router routes
    actions.ts          # All server actions (forms + admin mutations)
    admin/(dashboard)/  # Auth-gated admin UI
    admin/login/        # Admin sign-in
    events/             # Public event catalogue
    book/ contact/ about/ gallery/
  components/
    site/               # Header, footer, cards, shell
    home/               # Landing page sections
    forms/              # Booking & contact forms, form primitives
    admin/              # Admin nav, tables, forms
  lib/
    db.ts               # Prisma client (singleton)
    auth.ts             # Password hashing + session management
    validation.ts       # Zod schemas
    rate-limit.ts       # In-memory sliding-window limiter
    data.ts             # Data access queries
    config.ts           # Site-wide contact info
prisma/
  schema.prisma         # Data models
  seed.ts               # Seeds admin + event types
scripts/generate-images.mjs
```
