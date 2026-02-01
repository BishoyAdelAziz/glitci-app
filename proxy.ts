import { NextRequest, NextResponse } from "next/server";

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Skip internal Next.js and API routes
  if (pathname.startsWith("/api/")) return NextResponse.next();

  const authRoutes = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ];
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // 2. Get the expiry cookie
  const expiryCookie = request.cookies.get("GlitciTokenExpiry")?.value;

  let isTokenValid = false;
  if (expiryCookie) {
    const expiryDate = new Date(expiryCookie).getTime();
    const now = Date.now();
    // Token is valid only if the expiry date is in the future
    isTokenValid = expiryDate > now;
  }

  // 3. Logic: Not valid/expired -> Redirect to Login
  if (!isTokenValid && !isAuthRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);

    const response = NextResponse.redirect(loginUrl);
    // Cleanup the expired cookie if it exists
    if (expiryCookie) response.cookies.delete("GlitciTokenExpiry");
    return response;
  }

  // 4. Logic: Valid session -> Don't allow access to Auth pages (Login/Register)
  if (isTokenValid && isAuthRoute) {
    return NextResponse.redirect(new URL("/projects", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
