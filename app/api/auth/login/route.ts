import { serialize } from "cookie";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Call your actual backend URL
    const res = await fetch(`${process.env.API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const result = await res.json();

    if (!res.ok) {
      return NextResponse.json(result, { status: res.status });
    }

    const response = NextResponse.json(result);

    // 1. Set the Access Token (HttpOnly for security)
    const accessTokenCookie = serialize(
      "GlitciAccessToken",
      result.accessToken,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        expires: new Date(result.accessTokenExpires),
      },
    );

    // 2. Set the Expiry Cookie (Middleware needs this to check validity)
    const expiryCookie = serialize(
      "GlitciTokenExpiry",
      result.accessTokenExpires,
      {
        httpOnly: false, // Middleware/Client can read this
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        expires: new Date(result.accessTokenExpires),
      },
    );

    response.headers.append("Set-Cookie", accessTokenCookie);
    response.headers.append("Set-Cookie", expiryCookie);

    return response;
  } catch (error) {
    return NextResponse.json({ message: "Login failed" }, { status: 500 });
  }
}
