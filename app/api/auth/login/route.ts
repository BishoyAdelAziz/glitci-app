import { NextResponse } from "next/server";
import { sanitizeCookie } from "@/lib/cookies";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const res = await fetch(`${process.env.API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const result = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { message: result?.message || "Login failed" },
        { status: res.status },
      );
    }

    const response = NextResponse.json(result);

    // ✅ Set accessToken from response body
    const isProduction = process.env.NODE_ENV === "production";

    // Fallback to 3 minutes if expiry is missing
    const expiryStr =
      result.accessTokenExpires ||
      new Date(Date.now() + 180 * 1000).toISOString();
    const expiresDate = new Date(expiryStr);
    const maxAgeSeconds = Math.floor(
      (expiresDate.getTime() - Date.now()) / 1000,
    );

    response.cookies.set("accessToken", result.accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      path: "/",
      maxAge: maxAgeSeconds,
    });

    // ✅ Helper cookie for reading expiry on client
    response.cookies.set("GlitciTokenExpiry", expiryStr, {
      httpOnly: false,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      path: "/",
      maxAge: maxAgeSeconds,
    });

    // ✅ Server-side mustChangePassword cookie for immediate middleware enforcement
    response.cookies.set(
      "GlitciMustChangePassword",
      String(!!result.mustChangePassword),
      {
        httpOnly: false,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        path: "/",
        maxAge: 30 * 24 * 60 * 60, // 30 days
      },
    );

    // ✅ Server-side role cookie so middleware can enforce RBAC on first navigation
    const userRole = result.data?.role ?? "admin";
    response.cookies.set("GlitciUserRole", userRole, {
      httpOnly: false,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    // ✅ Forward backend's Set-Cookie headers (refreshToken) AFTER cookies.set()
    // cookies.set() overwrites previously appended Set-Cookie headers,
    // so we must append the backend cookies last.
    const setCookieHeaders = res.headers.getSetCookie?.() || [];
    setCookieHeaders.forEach((cookie) => {
      response.headers.append("Set-Cookie", sanitizeCookie(cookie));
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || "Something went wrong" },
      { status: 500 },
    );
  }
}
