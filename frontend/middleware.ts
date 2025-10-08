import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET_KEY!;

export function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;

  // If no token, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { role: string };

    const pathname = request.nextUrl.pathname;

    // Admin-only routes
    if (pathname.startsWith("/admin") && decoded.role !== "admin") {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Staff-only routes (admin also allowed)
    if (
      pathname.startsWith("/staff") &&
      decoded.role !== "staff" &&
      decoded.role !== "admin"
    ) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Authenticated access allowed
    return NextResponse.next();
  } catch (error) {
    console.error("JWT verification failed:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|login).*)",
  ],
};
