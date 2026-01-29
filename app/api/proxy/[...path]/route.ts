// app/api/proxy/[...path]/route.ts
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

    // Extract proxied path
    const pathname = req.nextUrl.pathname;
    const proxiedPath = pathname.replace("/api/proxy/", "");

    // Backend URL with FULL query params forwarded ✅
    if (!process.env.API_URL) throw new Error("API_URL is not defined");

    // ✅ FIX: Properly forward query params using req.nextUrl.searchParams
    const backendUrl = new URL(`${process.env.API_URL}/${proxiedPath}`);
    req.nextUrl.searchParams.forEach((value, key) => {
      backendUrl.searchParams.append(key, value);
    });

    // Forward headers
    const headers = new Headers(req.headers);
    headers.set("content-type", "application/json");
    if (token) headers.set("authorization", `Bearer ${token}`);

    // Body - ONLY for methods that need it ✅
    let body: string | undefined;
    if (req.method !== "GET" && req.method !== "HEAD") {
      body = await req.text();
    }

    // Fetch backend with query params ✅
    const res = await fetch(backendUrl.toString(), {
      method: req.method,
      headers,
      body,
    });

    const data = await res.text();

    // If backend returns 401, clear cookies and redirect
    if (res.status === 401) {
      console.warn("❌ Token expired or invalid, redirecting to login");

      const response = NextResponse.redirect(new URL("/login", req.url));

      // Delete cookies
      response.cookies.delete("GlitciAccessToken");
      response.cookies.delete("GlitciRefreshToken");
      response.cookies.delete("GlitciUser");

      return response;
    }

    // Normal response
    const response = new NextResponse(data, {
      status: res.status,
      headers: {
        "Content-Type": res.headers.get("content-type") || "application/json",
      },
    });

    // Forward backend Set-Cookie headers
    res.headers.forEach((value, key) => {
      if (key.toLowerCase() === "set-cookie") {
        response.headers.append(key, value);
      }
    });

    // Special handling: login
    if (proxiedPath === "auth/login" && res.ok) {
      try {
        const jsonData = JSON.parse(data);

        // Set HTTP-only token cookie
        response.cookies.set("GlitciAccessToken", jsonData.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 30, // 30 days
        });
        response.cookies.set("GlitciRefreshToken", jsonData.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
        });
        response.cookies.set("GlitciUser", JSON.stringify(jsonData.data), {
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 7, // 7 days
        });
      } catch (e) {
        console.warn("Login response not JSON, skipping cookie set");
      }
    }

    return response;
  } catch (err: unknown) {
    let message = "Unknown error occurred";
    if (err instanceof Error) message = err.message;

    console.error("❌ Proxy error:", err);

    return NextResponse.json(
      {
        status: "fail",
        error: [],
        message,
      },
      { status: 500 },
    );
  }
}
