/**
 * Fortress-level file security and binary magic bytes validation.
 * Protects against disguised executables, scripts, and path traversal attacks.
 */

export type AllowedMimeType = "image/webp" | "image/jpeg" | "image/png";

export const ALLOWED_MIME_TYPES: readonly AllowedMimeType[] = [
  "image/webp",
  "image/jpeg",
  "image/png",
] as const;

export const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024; // 2MB

/**
 * Validates the binary header (magic bytes) of an uploaded image file buffer.
 * Does not trust the client-provided Content-Type or file extension.
 */
export function validateImageMagicBytes(buffer: Uint8Array | Buffer): {
  valid: boolean;
  detectedType?: AllowedMimeType;
  error?: string;
} {
  if (!buffer || buffer.length < 12) {
    return { valid: false, error: "File buffer is too small to be a valid image." };
  }

  // 1. Check WebP: RIFF [4 bytes] + [4 bytes size] + WEBP [4 bytes]
  // 'RIFF' = 0x52, 0x49, 0x46, 0x46
  // 'WEBP' = 0x57, 0x45, 0x42, 0x50
  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return { valid: true, detectedType: "image/webp" };
  }

  // 2. Check JPEG: Starts with 0xFF, 0xD8, 0xFF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { valid: true, detectedType: "image/jpeg" };
  }

  // 3. Check PNG: 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return { valid: true, detectedType: "image/png" };
  }

  return {
    valid: false,
    error: "Invalid file signature. File is not a valid WebP, JPEG, or PNG image.",
  };
}

/**
 * Sanitizes user/admin IDs to strictly prevent path traversal attacks.
 * Only allows alphanumeric characters, underscores, and hyphens.
 */
export function sanitizeUserId(userId: string): string {
  if (!userId || typeof userId !== "string") {
    throw new Error("Invalid user ID provided for profile path generation.");
  }

  const clean = userId.replace(/[^a-zA-Z0-9_-]/g, "");
  if (!clean || clean.length > 64) {
    throw new Error("User ID failed security sanitization check.");
  }

  return clean;
}

/**
 * Generates the deterministic single-path profile image location.
 */
export function getProfileImagePath(cleanUserId: string): string {
  return `profiles/admin-${cleanUserId}.webp`;
}
