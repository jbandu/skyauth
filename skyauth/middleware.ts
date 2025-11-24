import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { auth } from "@/auth";

const protectedRoutes = ["/dashboard", "/employees", "/org-chart", "/departments", "/hr", "/admin"];

export async function middleware(request: NextRequest) {
  let session = null;
  try {
    session = await auth();
  } catch (error) {
    // If auth fails (e.g., DATABASE_URL not set), allow request to continue
    // Protected routes will handle authentication at the page level
    console.error("Middleware auth error:", error);
  }
  const response = NextResponse.next();

  if (session?.user?.airlineId) {
    response.headers.set("x-airline-id", session.user.airlineId);
  }

  if (!session && protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirectTo", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/employees/:path*", "/org-chart/:path*", "/departments/:path*", "/hr/:path*", "/admin/:path*"],
};
