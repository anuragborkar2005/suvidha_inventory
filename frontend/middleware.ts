import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET_KEY || "your-secret-key";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const { pathname } = request.nextUrl;

  const secret = new TextEncoder().encode(JWT_SECRET);

  // If the user is trying to access the login page
  if (pathname.startsWith("/login")) {
    // If the user has a valid token, redirect to the dashboard
    if (token) {
      try {
        await jwtVerify(token, secret, { algorithms: ["HS256"] });
        return NextResponse.redirect(new URL("/dashboard", request.url));
      } catch {
        // If the token is invalid, allow access to the login page
        return NextResponse.next();
      }
    }
    // If there is no token, allow access to the login page
    return NextResponse.next();
  }

  // For all other pages, protect them
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    await jwtVerify(token, secret, { algorithms: ["HS256"] });
    return NextResponse.next();
  } catch (error) {
    console.error("JWT verification failed:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};