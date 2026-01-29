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

    // ✅ Get accessToken from Authorization header (client sends it)
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    const pathname = req.nextUrl.pathname;
    const proxiedPath = pathname.replace("/api/proxy/", "");

    if (!process.env.API_URL) throw new Error("API_URL is not defined");

    const backendUrl = new URL(`${process.env.API_URL}/${proxiedPath}`);
    req.nextUrl.searchParams.forEach((value, key) => {
      backendUrl.searchParams.append(key, value);
    });

    const headers = new Headers(req.headers);
    headers.set("content-type", "application/json");
    if (token) headers.set("authorization", `Bearer ${token}`);

    let body: string | undefined;
    if (req.method !== "GET" && req.method !== "HEAD") {
      body = await req.text();
    }

    const res = await fetch(backendUrl.toString(), {
      method: req.method,
      headers,
      body,
    });

    const data = await res.text();

    // If backend returns 401, clear everything
    if (res.status === 401) {
      console.warn("❌ Token expired or invalid, redirecting to login");

      const response = NextResponse.redirect(new URL("/login", req.url));

      // Clear refresh token cookie (backend might have set it)
      response.cookies.delete("refreshToken");

      return response;
    }

    // Normal response
    const response = new NextResponse(data, {
      status: res.status,
      headers: {
        "Content-Type": res.headers.get("content-type") || "application/json",
      },
    });

    // ✅ Forward ALL Set-Cookie headers from backend (for refreshToken)
    res.headers.forEach((value, key) => {
      if (key.toLowerCase() === "set-cookie") {
        response.headers.append(key, value);
      }
    });

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
