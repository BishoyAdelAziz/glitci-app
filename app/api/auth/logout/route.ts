import { serialize } from "cookie";
import { NextResponse } from "next/server";
import { cookies as nextCookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await nextCookies();
    const token = cookieStore.get("GlitciAccessToken")?.value;

    // Forward logout to your actual backend (optional — clears server-side session if any)
    if (token) {
      await fetch(`${process.env.API_URL}/auth/logout`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    }
  } catch {
    // If backend logout fails, we still clear cookies locally
  }

  const response = NextResponse.json({ success: true });

  const clearAccessToken = serialize("GlitciAccessToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
  });

  const clearExpiry = serialize("GlitciTokenExpiry", "", {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
  });

  response.headers.append("Set-Cookie", clearAccessToken);
  response.headers.append("Set-Cookie", clearExpiry);

  return response;
}
