import { NextRequest, NextResponse } from "next/server";
import { cookies as nextCookies } from "next/headers";

export async function GET(req: NextRequest) {
  return proxy(req);
}
export async function POST(req: NextRequest) {
  return proxy(req);
}
export async function PUT(req: NextRequest) {
  return proxy(req);
}
export async function DELETE(req: NextRequest) {
  return proxy(req);
}
export async function PATCH(req: NextRequest) {
  return proxy(req);
}

async function proxy(req: NextRequest) {
  try {
    const cookieStore = await nextCookies();
    const token = cookieStore.get("GlitciAccessToken")?.value;
    const pathname = req.nextUrl.pathname;
    const proxiedPath = pathname.replace("/api/proxy/", "");

    if (!process.env.API_URL) throw new Error("API_URL is not defined");

    const backendUrl = new URL(`${process.env.API_URL}/${proxiedPath}`);
    req.nextUrl.searchParams.forEach((v, k) =>
      backendUrl.searchParams.append(k, v),
    );

    const headers = new Headers(req.headers);
    headers.set("content-type", "application/json");
    // Forward the short-lived access token in the header
    if (token) headers.set("authorization", `Bearer ${token}`);

    let body: string | undefined;
    if (req.method !== "GET" && req.method !== "HEAD") body = await req.text();

    const res = await fetch(backendUrl.toString(), {
      method: req.method,
      headers,
      body,
    });

    const data = await res.text();

    if (res.status === 401) {
      const response = NextResponse.redirect(new URL("/login", req.url));
      response.cookies.delete("GlitciAccessToken");
      response.cookies.delete("GlitciTokenExpiry");
      return response;
    }

    const response = new NextResponse(data, {
      status: res.status,
      headers: {
        "Content-Type": res.headers.get("content-type") || "application/json",
      },
    });

    // CRITICAL: Forward all cookies from backend (like the 30-day refresh token)
    res.headers.forEach((v, k) => {
      if (k.toLowerCase() === "set-cookie") response.headers.append(k, v);
    });

    // Logic for Login and Refresh response
    if (
      (proxiedPath === "auth/login" || proxiedPath === "auth/refresh") &&
      res.ok
    ) {
      const json = JSON.parse(data);
      const isProd = process.env.NODE_ENV === "production";

      // Save the 1-hour access token as HttpOnly
      response.cookies.set("GlitciAccessToken", json.accessToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: "lax",
        path: "/",
      });

      // THE ONLY CLIENT-READABLE COOKIE: The Expiry Timestamp
      response.cookies.set("GlitciTokenExpiry", json.accessTokenExpires, {
        httpOnly: false, // Accessible by AuthWatcher
        secure: isProd,
        sameSite: "lax",
        path: "/",
      });
    }

    return response;
  } catch (err) {
    return NextResponse.json(
      { status: "fail", message: "Proxy error" },
      { status: 500 },
    );
  }
}
