import { NextRequest, NextResponse } from "next/server";

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/")) return NextResponse.next();

  const authRoutes = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ];
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  const expiryCookie = request.cookies.get("GlitciTokenExpiry")?.value;
  const accessToken = request.cookies.get("GlitciAccessToken")?.value;

  let isTokenValid = false;
  if (expiryCookie) {
    isTokenValid = new Date(expiryCookie).getTime() > Date.now();
  }

  // 1. Valid session → block auth pages
  if (isTokenValid && isAuthRoute) {
    return NextResponse.redirect(new URL("/projects", request.url));
  }

  // 2. Valid session → allow through
  if (isTokenValid) {
    return NextResponse.next();
  }

  // 3. No token at all → go to login
  if (!accessToken) {
    if (isAuthRoute) return NextResponse.next();
    return redirectToLogin(request, pathname);
  }

  // 4. Has accessToken but expiry says expired → attempt refresh
  if (accessToken && !isTokenValid && !isAuthRoute) {
    return await attemptRefresh(request, pathname);
  }

  // 5. Expired but on auth route → let them through
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
