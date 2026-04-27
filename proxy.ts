import { NextRequest, NextResponse } from "next/server";

// ─── Role Definitions ──────────────────────────────────────────────────────────

const ROLE_ACCESS: Record<string, string[]> = {
  admin: ["/"], // Admin has full access
  financial_manager: ["/overview", "/transactions"],
  operation: ["/employees", "/projects", "/clients", "/tasks"],
  employee: ["/projects", "/tasks"],
};

// Routes that every logged-in user can access implicitly
const COMMON_ROUTES = ["/profile", "/api", "/initial-password"];

// Default landing per role (where to redirect if accessing a forbidden route)
const ROLE_HOME: Record<string, string> = {
  admin: "/overview",
  financial_manager: "/overview",
  operation: "/projects",
  employee: "/tasks",
};

// ─── Middleware ────────────────────────────────────────────────────────────────

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
  const isApiRoute = pathname.startsWith("/api/");
  const isComingSoon = pathname.startsWith("/coming-soon");

  // 1. Whitelist all API routes and coming soon (API routes handle their own auth via tokens)
  if (isApiAuthRoute || isApiRoute || isComingSoon) return NextResponse.next();

  const accessToken = request.cookies.get("accessToken")?.value;
  const expiryCookie = request.cookies.get("GlitciTokenExpiry")?.value;
  const mustChangePassword =
    request.cookies.get("GlitciMustChangePassword")?.value === "true";
  const userRole = request.cookies.get("GlitciUserRole")?.value ?? "admin"; // default admin for backwards compat

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
    const home = ROLE_HOME[userRole] ?? "/overview";
    return NextResponse.redirect(new URL(home, request.url));
  }

  // 5. Pre-check: No token at all? Redirect to login if not already on auth route
  if (!isTokenValid) {
    if (isAuthRoute) return NextResponse.next();
    return redirectToLogin(request, pathname);
  }

  // 6. Role-based route guards (only enforce when we know the role)
  if (isTokenValid) {
    if (userRole !== "admin") {
      const allowedRoutes = ROLE_ACCESS[userRole] || [];

      const isAllowed =
        allowedRoutes.some((route) => pathname.startsWith(route)) ||
        COMMON_ROUTES.some((route) => pathname.startsWith(route)) ||
        pathname === "/"; // Root path is usually allowed or redirects naturally

      if (!isAllowed) {
        // If the user tries to access a route they don't have permission for, redirect to their home
        const home = ROLE_HOME[userRole] ?? "/login";
        return NextResponse.redirect(new URL(home, request.url));
      }
    }
  }

  // 7. Intercept all responses to catch 401s from backend
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
  response.cookies.delete("GlitciUserRole");
  response.cookies.delete("GlitciMustChangePassword");
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
