import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === "/admin/login";
  const isAdminRoute = pathname.startsWith("/admin");

  // Check for NextAuth session cookie
  const sessionToken =
    request.cookies.get("authjs.session-token")?.value ||
    request.cookies.get("__Secure-authjs.session-token")?.value;

  const isLoggedIn = !!sessionToken;

  if (isLoginPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  if (isAdminRoute && !isLoginPage && !isLoggedIn) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
