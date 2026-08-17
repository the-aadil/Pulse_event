type Bucket = {
  timestamps: number[];
  /** When this bucket was last pruned — used for lazy per-key cleanup. */
  lastPruned: number;
};

const store = new Map<string, Bucket>();

/** Timestamp of the last global sweep. */
let lastGlobalPrune = Date.now();
const GLOBAL_PRUNE_INTERVAL = 60_000;

function prune() {
  const now = Date.now();

  // Only run a global sweep periodically to reclaim memory from stale buckets.
  if (now - lastGlobalPrune < GLOBAL_PRUNE_INTERVAL) return;
  lastGlobalPrune = now;

  for (const [key, bucket] of store) {
    // Remove the bucket entirely if it has no recent timestamps.
    if (bucket.timestamps.length === 0) {
      store.delete(key);
    }
  }
}

export function rateLimit(
  key: string,
  { limit, windowMs = 60_000 }: { limit: number; windowMs?: number }
) {
  const now = Date.now();

  const bucket = store.get(key);

  // Lazy per-key prune: only clean this bucket's timestamps.
  if (bucket) {
    const cutoff = now - windowMs;
    // Binary-search-style filter: timestamps are always inserted in order,
    // so we can use a simple scan from the front instead of filtering all.
    while (bucket.timestamps.length > 0 && bucket.timestamps[0] <= cutoff) {
      bucket.timestamps.shift();
    }
  }

  const active = bucket ?? { timestamps: [], lastPruned: now };

  if (active.timestamps.length >= limit) {
    const retryAfter = Math.ceil((active.timestamps[0] + windowMs - now) / 1000);
    return { ok: false as const, retryAfter };
  }

  active.timestamps.push(now);
  store.set(key, active);

  // Run a global sweep once per interval to free memory from abandoned keys.
  prune();

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
