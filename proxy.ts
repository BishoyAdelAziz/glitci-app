// proxy.ts (root)
import { NextRequest, NextResponse } from "next/server";

export default async function proxy(request: NextRequest) {
  const token = request.cookies.get("GlitciAccessToken")?.value;
  const { pathname } = request.nextUrl;

  // Skip API routes - let proxy API route handle 401s
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const authRoutes = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ];

  const publicRoutes: string[] = [];

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  const isPublicRoute = publicRoutes.includes(pathname);
  const isAppRoute = !isAuthRoute && !isPublicRoute;

  // Redirect unauthenticated users to login
  if (!token && isAppRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth pages
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL("/projects", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
