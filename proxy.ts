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

  const accessToken = request.cookies.get("GlitciAccessToken")?.value;
  const expiryCookie = request.cookies.get("GlitciTokenExpiry")?.value;
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
    return NextResponse.redirect(new URL("/projects", request.url));
  }

  // 4. Allow valid sessions
  if (isTokenValid) return NextResponse.next();

  // 5. No token? Direct to login
  if (!accessToken) {
    if (isAuthRoute) return NextResponse.next();
    return redirectToLogin(request, pathname);
  }

  // 6. Token exists but expired? Try Refresh
  if (accessToken && !isTokenValid && !isAuthRoute) {
    return await attemptRefresh(request, pathname);
  }

  return NextResponse.next();
}

async function attemptRefresh(
  request: NextRequest,
  fromPath: string,
): Promise<NextResponse> {
  try {
    const refreshRes = await fetch(
      new URL("/api/proxy/auth/refresh", request.url),
      {
        method: "POST",
        headers: {
          Cookie: request.headers.get("cookie") || "",
        },
      },
    );

    if (!refreshRes.ok) throw new Error("Refresh failed");

    // Forward the new cookies (GlitciAccessToken + GlitciTokenExpiry) from proxy response
    const nextResponse = NextResponse.next();
    refreshRes.headers.forEach((v, k) => {
      if (k.toLowerCase() === "set-cookie") {
        nextResponse.headers.append("set-cookie", v);
      }
    });

    return nextResponse;
  } catch {
    return redirectToLogin(request, fromPath);
  }
}

function redirectToLogin(request: NextRequest, fromPath: string): NextResponse {
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("from", fromPath);

  const response = NextResponse.redirect(loginUrl);
  response.cookies.delete("GlitciAccessToken");
  response.cookies.delete("GlitciTokenExpiry");
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
