import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE = "pulse_session";

/**
 * Lightweight JWT verification for the proxy layer.
 * We only verify the signature + expiry — no DB round-trip here.
 * Full authorisation (DB user lookup) still happens in requireAdmin()
 * inside the admin layout, so this is a fast "optimistic" check.
 */
const DEFAULT_AUTH_SECRET = "26ba564c8cd92e3460a85604bf1164b03f52c3466f267a1d";

async function verifySession(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const secret = process.env.AUTH_SECRET || DEFAULT_AUTH_SECRET;
  try {
    await jwtVerify(token, new TextEncoder().encode(secret), {
      algorithms: ["HS256"],
    });
    return true;
  } catch {
    return false;
  }
}


export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Pass through the login page itself — it handles redirect-if-authed internally.
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // Protect all other /admin/** routes at the edge.
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const valid = await verifySession(token);

    if (!valid) {
      const loginUrl = new URL("/admin/login", request.url);
      // Preserve the intended destination so we can redirect back after login.
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  // Run on all /admin paths; skip static assets, api routes, and _next internals.
  matcher: ["/admin/:path*"],
};
