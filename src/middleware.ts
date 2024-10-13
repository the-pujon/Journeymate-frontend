import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublicPath =
    path === "/auth/signin" ||
    path === "/auth/signup" ||
    path === "/auth/request-recovery";

  // We can't access localStorage in middleware, so we'll need to check for the token on the client-side
  // This middleware will only handle redirects for public routes when a user is logged in

  if (isPublicPath) {
    return NextResponse.next();
  }

  // For protected routes, we'll let the client-side handle the redirect if there's no token
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/auth/signin",
    "/auth/signup",
    "/auth/request-recovery",
  ],
};
