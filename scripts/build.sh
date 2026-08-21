#!/bin/bash

set -e

echo "[build] Generating Prisma client..."
npx prisma generate

# ─── Database sync ────────────────────────────────────────────────────────────
#
# We use `prisma migrate deploy` only if DATABASE_URL is set AND we're in a
# "migrate" context. During a normal Vercel build the Neon pooler can time-out
# trying to acquire the Postgres advisory lock (P1002). We therefore skip the
# migration step here and rely on running migrations separately (see below).
#
# To run migrations manually after deploying:
#   DATABASE_URL="<your-url>" npx prisma migrate deploy
#
# If you want to auto-migrate during build, set the env var
# MIGRATE_ON_BUILD=true in your Vercel project settings.
# ─────────────────────────────────────────────────────────────────────────────

if [ "${MIGRATE_ON_BUILD}" = "true" ] && [ -n "${DATABASE_URL}" ]; then
  echo "[build] Running database migrations (MIGRATE_ON_BUILD=true)..."
  MAX_RETRIES=4
  RETRY=0

  until npx prisma migrate deploy; do
    RETRY=$((RETRY + 1))
    if [ "$RETRY" -ge "$MAX_RETRIES" ]; then
      echo "[build] Migration failed after $MAX_RETRIES attempts. Aborting build."
      exit 1
    fi
    WAIT=$(( RETRY * 10 ))
    echo "[build] Attempt $RETRY failed (Neon may be waking up). Retrying in ${WAIT}s..."
    sleep "$WAIT"
  done

  echo "[build] Migrations applied successfully."
else
  echo "[build] Skipping migrate deploy (set MIGRATE_ON_BUILD=true to enable)."
fi

echo "[build] Building Next.js..."
npx next build
