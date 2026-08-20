import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { promises as fs } from "fs";
import path from "path";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import {
  validateImageMagicBytes,
  sanitizeUserId,
  MAX_FILE_SIZE_BYTES,
} from "@/lib/file-security";
import { profileImageUploadSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export type ProfileUploadSuccessResponse = {
  status: "success";
  url: string;
  version: number;
  message: string;
};

export type ProfileUploadErrorResponse = {
  status: "error";
  error: string;
  code: string;
};

export async function POST(request: NextRequest): Promise<NextResponse<ProfileUploadSuccessResponse | ProfileUploadErrorResponse>> {
  // 1. Session Authentication
  const session = await getSession();
  if (!session || !session.sub) {
    return NextResponse.json(
      { status: "error", code: "UNAUTHORIZED", error: "Unauthorized. Please log in as admin." },
      { status: 401 }
    );
  }

  // 2. Rate Limiting (10 uploads per minute per admin/IP)
  const reqHeaders = await headers();
  const rateLimitKey = `profile-upload:${session.sub}:${getClientIp(reqHeaders)}`;
  const rate = rateLimit(rateLimitKey, { limit: 10, windowMs: 60_000 });
  if (!rate.ok) {
    return NextResponse.json(
      {
        status: "error",
        code: "RATE_LIMITED",
        error: `Too many upload attempts. Please try again in ${rate.retryAfter} seconds.`,
      },
      { status: 429, headers: { "Retry-After": String(rate.retryAfter) } }
    );
  }

  try {
    // 3. Extract FormData
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { status: "error", code: "NO_FILE", error: "No image file was provided in the upload request." },
        { status: 400 }
      );
    }

    // 4. Schema Validation (Size & declared MIME)
    const schemaValidation = profileImageUploadSchema.safeParse({
      fileSize: file.size,
      mimeType: file.type,
    });

    if (!schemaValidation.success) {
      const errorMsg = schemaValidation.error.issues[0]?.message || "Invalid file format or size.";
      return NextResponse.json(
        { status: "error", code: "INVALID_PAYLOAD", error: errorMsg },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { status: "error", code: "FILE_TOO_LARGE", error: "File exceeds the 2MB size limit." },
        { status: 400 }
      );
    }

    // 5. Binary Magic Bytes Validation (Deep inspect bytes)
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const magicCheck = validateImageMagicBytes(buffer);

    if (!magicCheck.valid) {
      return NextResponse.json(
        {
          status: "error",
          code: "MALICIOUS_FILE_SIGNATURE",
          error: magicCheck.error || "File signature does not match a valid image.",
        },
        { status: 400 }
      );
    }

    // 6. Path Traversal Protection & Destination Path Generation
    const cleanId = sanitizeUserId(session.sub);
    const fileName = `admin-${cleanId}.webp`;
    const uploadsDir = path.join(process.cwd(), "public", "uploads", "profiles");

    await fs.mkdir(uploadsDir, { recursive: true });
    const targetFilePath = path.join(uploadsDir, fileName);

    // 7. Single-Path Overwrite (prevents storage bloat)
    await fs.writeFile(targetFilePath, buffer);

    // 8. Database-Backed Cache Busting
    const updatedUser = await db.adminUser.update({
      where: { id: session.sub },
      data: { updatedAt: new Date() },
      select: { id: true, updatedAt: true },
    });

    const version = updatedUser.updatedAt.getTime();
    const cacheBustedUrl = `/uploads/profiles/${fileName}?v=${version}`;

    return NextResponse.json(
      {
        status: "success",
        url: cacheBustedUrl,
        version,
        message: "Profile image updated successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Profile Upload API] Error processing image:", error);
    return NextResponse.json(
      {
        status: "error",
        code: "SERVER_ERROR",
        error: "An unexpected error occurred while processing the profile image. Please try again.",
      },
      { status: 500 }
    );
  }
}
