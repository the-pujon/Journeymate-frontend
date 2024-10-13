import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublicPath =
    path === "/auth/signin" ||
    path === "/auth/signup" ||
    path === "/auth/request-recovery";

  if (isPublicPath) {
    return NextResponse.next();
  }

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
