import { NextRequest, NextResponse } from "next/server";

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/")) return NextResponse.next();

  const authRoutes = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/verify-code",
  ];
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  const isInitialPasswordRoute = pathname.startsWith("/initial-password");

  const accessToken = request.cookies.get("accessToken")?.value;
  const expiryCookie = request.cookies.get("GlitciTokenExpiry")?.value;
  console.log("🔍 Middleware Debug:");
  console.log("  pathname:", pathname);
  console.log("  accessToken:", accessToken ? "✅ exists" : "❌ missing");
  console.log("  expiryCookie:", expiryCookie ? "✅ exists" : "❌ missing");
  console.log(
    "  All cookies:",
    request.cookies.getAll().map((c) => c.name),
  );
  const mustChangePassword =
    request.cookies.get("GlitciMustChangePassword")?.value === "true";

  let isTokenValid = false;
  if (expiryCookie) {
    isTokenValid = new Date(expiryCookie).getTime() > Date.now();
  } else if (accessToken) {
    isTokenValid = true;
  }

  // 1. Unauthenticated users cannot access initial-password
  if (isInitialPasswordRoute && !isTokenValid) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 2. Force mustChangePassword users to /initial-password
  if (isTokenValid && mustChangePassword && !isInitialPasswordRoute) {
    return NextResponse.redirect(new URL("/initial-password", request.url));
  }

  // 3. Redirect logged-in users (without mustChangePassword) away from auth pages
  if (isTokenValid && !mustChangePassword && isAuthRoute) {
    return NextResponse.redirect(new URL("/overview", request.url));
  }

  // 4. Allow valid sessions
  if (isTokenValid) return NextResponse.next();

  // 5. No token? Direct to login
  if (!accessToken) {
    if (isAuthRoute) return NextResponse.next();
    return redirectToLogin(request, pathname);
  }

  // 6. Token exists but expired? Try Refresh

  return NextResponse.next();
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
