type Bucket = {
  timestamps: number[];
};

const store = new Map<string, Bucket>();

function prune(now: number) {
  if (store.size < 10_000) return;
  for (const [key, bucket] of store) {
    const alive = bucket.timestamps.filter((t) => now - t < 60_000);
    if (alive.length === 0) {
      store.delete(key);
    } else {
      bucket.timestamps = alive;
    }
  }
}

export function rateLimit(
  key: string,
  { limit, windowMs = 60_000 }: { limit: number; windowMs?: number }
) {
  const now = Date.now();
  prune(now);

  const bucket = store.get(key) ?? { timestamps: [] };
  bucket.timestamps = bucket.timestamps.filter((t) => now - t < windowMs);

  if (bucket.timestamps.length >= limit) {
    const retryAfter = Math.ceil((bucket.timestamps[0] + windowMs - now) / 1000);
    return { ok: false as const, retryAfter };
  }

  bucket.timestamps.push(now);
  store.set(key, bucket);
  return { ok: true as const, retryAfter: 0 };
}

export function getClientIp(headers: Headers) {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0].trim();
    if (first) return first;
  }
  return headers.get("x-real-ip") ?? "unknown";
}
