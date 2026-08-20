#!/bin/bash

echo "[build] Generating Prisma client..."
npx prisma generate

echo "[build] Running database migrations..."
MAX_RETRIES=3
RETRY=0

until npx prisma migrate deploy; do
  RETRY=$((RETRY + 1))
  if [ "$RETRY" -ge "$MAX_RETRIES" ]; then
    echo "[build] Migration failed after $MAX_RETRIES attempts."
    exit 1
  fi
  echo "[build] Attempt $RETRY failed. Database may be waking up. Retrying in 8s..."
  sleep 8
done

echo "[build] Building Next.js..."
next build
