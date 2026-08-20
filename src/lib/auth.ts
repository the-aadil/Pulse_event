import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

const SESSION_COOKIE = "pulse_session";
const SESSION_DAYS = 7;

const DEFAULT_AUTH_SECRET = "26ba564c8cd92e3460a85604bf1164b03f52c3466f267a1d";

function getSecret() {
  const secret = process.env.AUTH_SECRET || DEFAULT_AUTH_SECRET;
  return new TextEncoder().encode(secret);
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export type SessionPayload = {
  sub: string;
  email: string;
  name: string;
};

export type AuthenticatedAdmin = {
  id: string;
  email: string;
  name: string;
  isSuperAdmin: boolean;
  updatedAt: Date;
};

export async function createSession(user: { id: string; email: string; name: string }) {
  const token = await new SignJWT({
    email: user.email,
    name: user.name,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(getSecret());

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function destroySession() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE);
  } catch (err) {
    console.warn("[Auth] Failed to delete session cookie:", err);
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    if (!token) return null;

    const { payload } = await jwtVerify(token, getSecret(), {
      algorithms: ["HS256"],
    });
    if (!payload.sub) return null;
    return {
      sub: payload.sub,
      email: typeof payload.email === "string" ? payload.email : "",
      name: typeof payload.name === "string" ? payload.name : "",
    };
  } catch {
    return null;
  }
}

/** Database query timeout wrapper for resilient error handling */
async function withDbTimeout<T>(promise: Promise<T>, timeoutMs = 4000): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error("Database query timed out")), timeoutMs);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => {
    if (timer) clearTimeout(timer);
  });
}

/**
 * Validates the session and verifies the admin user exists in the database.
 * Returns null if the session is invalid, expired, or the user does not exist.
 */
export async function getAuthenticatedAdmin(): Promise<AuthenticatedAdmin | null> {
  const session = await getSession();
  if (!session?.sub) return null;

  try {
    const user = await withDbTimeout(
      db.adminUser.findUnique({
        where: { id: session.sub },
        select: { id: true, email: true, name: true, isSuperAdmin: true, updatedAt: true },
      })
    );
    return user;
  } catch (error) {
    console.warn("[Auth] Failed to verify admin in database:", error);
    return null;
  }
}

/**
 * Enforces admin authorization on server routes and layouts.
 * Automatically clears stale session cookies to prevent infinite redirect loops.
 */
export async function requireAdmin(): Promise<AuthenticatedAdmin> {
  const user = await getAuthenticatedAdmin();
  if (!user) {
    await destroySession();
    redirect("/admin/login");
  }
  return user;
}
