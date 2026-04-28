import { NextResponse } from "next/server";
import { sanitizeCookie } from "@/lib/cookies";

export async function POST(req: Request) {
  try {
    // ✅ Forward the browser's cookies (contains refreshToken) to the backend
    const cookieHeader = req.headers.get("cookie");

    const res = await fetch(`${process.env.API_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      },
    });

    const result = await res.json();

    if (!res.ok) {
      return NextResponse.json(result, { status: res.status });
    }

    const response = NextResponse.json(result);

    // ✅ Set new accessToken from response body
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

    // ✅ Update expiry helper cookie
    response.cookies.set("GlitciTokenExpiry", expiryStr, {
      httpOnly: false,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      path: "/",
      maxAge: maxAgeSeconds,
    });

    // ✅ Forward refreshToken from backend Set-Cookie AFTER cookies.set()
    // cookies.set() overwrites previously appended Set-Cookie headers,
    // so we must append the backend cookies last.
    const setCookieHeaders = res.headers.getSetCookie?.() || [];
    setCookieHeaders.forEach((cookie) => {
      response.headers.append("Set-Cookie", sanitizeCookie(cookie));
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { message: err?.message || "Refresh failed" },
      { status: 500 },
    );
  }
}
