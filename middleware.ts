import { NextRequest, NextResponse } from "next/server";

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const authRoutes = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/verify-code",
  ];
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  const isInitialPasswordRoute = pathname.startsWith("/initial-password");
  const isApiAuthRoute = pathname.startsWith("/api/auth/");

  // 1. Whitelist public frontend and API auth routes
  if (isAuthRoute || isApiAuthRoute) return NextResponse.next();

  const accessToken = request.cookies.get("accessToken")?.value;
  const expiryCookie = request.cookies.get("GlitciTokenExpiry")?.value;
  const mustChangePassword =
    request.cookies.get("GlitciMustChangePassword")?.value === "true";

  let isTokenValid = false;
  if (expiryCookie) {
    isTokenValid = new Date(expiryCookie).getTime() > Date.now();
  } else if (accessToken) {
    isTokenValid = true;
  }

  // 2. Unauthenticated users cannot access initial-password
  if (isInitialPasswordRoute && !isTokenValid) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 3. Force mustChangePassword users to /initial-password
  if (isTokenValid && mustChangePassword && !isInitialPasswordRoute) {
    return NextResponse.redirect(new URL("/initial-password", request.url));
  }

  // 4. Redirect logged-in users (without mustChangePassword) away from auth pages
  if (isTokenValid && !mustChangePassword && isAuthRoute) {
    return NextResponse.redirect(new URL("/overview", request.url));
  }

  // 5. Pre-check: No token at all? Redirect to login if not already on auth route
  if (!accessToken && !isAuthRoute) {
    return redirectToLogin(request, pathname);
  }

  // 6. Intercept all responses to catch 401s from backend
  const response = await NextResponse.next();

  if (response.status === 401 && !pathname.includes("/api/auth/refresh")) {
    console.log(`🚫 401 Access Denied on ${pathname}. Redirecting to /login.`);
    return redirectToLogin(request, pathname);
  }

  return response;
}

function redirectToLogin(request: NextRequest, fromPath: string): NextResponse {
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("from", fromPath);

  const response = NextResponse.redirect(loginUrl);
  response.cookies.delete("accessToken");
  response.cookies.delete("GlitciTokenExpiry");
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
