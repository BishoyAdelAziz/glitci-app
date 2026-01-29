// proxy.ts (root)
import { NextRequest, NextResponse } from "next/server";

export default async function proxy(request: NextRequest) {
  const token = request.cookies.get("GlitciAccessToken")?.value;
  const { pathname } = request.nextUrl;

  // **NEW: Skip API routes - let proxy API route handle 401s**
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Your existing logic...
  const authRoutes = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ];
  const publicRoutes = ["/"];

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  const isPublicRoute = publicRoutes.includes(pathname);
  const isAppRoute = !isAuthRoute && !isPublicRoute;

  if (!token && isAppRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

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
