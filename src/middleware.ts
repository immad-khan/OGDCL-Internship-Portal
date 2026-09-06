import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "ogdcl-intern-portal-secret-key-change-in-production"
);

const COOKIE_NAME = "auth_token";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Determine which area is being accessed
  const isSupervisorRoute = pathname.startsWith("/supervisor");
  const isInternRoute = pathname.startsWith("/intern");

  if (!isSupervisorRoute && !isInternRoute) {
    return NextResponse.next();
  }

  // Try to get and verify the token
  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    const role = isSupervisorRoute ? "supervisor" : "intern";
    return NextResponse.redirect(new URL(`/login?role=${role}`, request.url));
  }

  try {
    const { payload } = await jwtVerify(token, SECRET);
    const role = payload.role as string;

    // Prevent cross-role access
    if (isSupervisorRoute && role !== "supervisor") {
      return NextResponse.redirect(new URL("/login?role=supervisor", request.url));
    }
    if (isInternRoute && role !== "intern") {
      return NextResponse.redirect(new URL("/login?role=intern", request.url));
    }

    return NextResponse.next();
  } catch {
    // Token is invalid or expired
    const role = isSupervisorRoute ? "supervisor" : "intern";
    const response = NextResponse.redirect(new URL(`/login?role=${role}`, request.url));
    response.cookies.delete(COOKIE_NAME);
    return response;
  }
}

export const config = {
  matcher: ["/supervisor/:path*", "/intern/:path*"],
};
