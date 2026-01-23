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

async function proxy(req: NextRequest) {
  try {
    const cookieStore = await nextCookies();
    const token = cookieStore.get("GlitciAccessToken")?.value;

    // Extract proxied path from request URL
    const pathname = req.nextUrl.pathname; // e.g., /api/proxy/auth/login
    const proxiedPath = pathname.replace("/api/proxy/", ""); // e.g., auth/login

    // Backend URL from server env
    if (!process.env.API_URL) {
      throw new Error("API_URL is not defined in environment variables");
    }
    const backendUrl = `${process.env.API_URL}/${proxiedPath}`;

    // Forward headers and attach token if exists
    const headers = new Headers(req.headers);
    headers.set("content-type", "application/json");
    if (token) headers.set("authorization", `Bearer ${token}`);

    // Read request body if not GET/HEAD
    const body =
      req.method !== "GET" && req.method !== "HEAD"
        ? await req.text()
        : undefined;

    // Fetch from backend
    const res = await fetch(backendUrl, {
      method: req.method,
      headers,
      body,
    });

    const data = await res.text();

    // Build NextResponse
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
      const jsonData = JSON.parse(data);

      // Set HTTP-only token cookie
      response.cookies.set("GlitciAccessToken", jsonData.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      // Optional: store user info for client
      response.cookies.set("GlitciUser", JSON.stringify(jsonData.data), {
        httpOnly: false, // client can read
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    return response;
  } catch (err: unknown) {
    // Properly typed error handling
    let message = "Unknown error occurred";
    let name = "Error";

    if (err instanceof Error) {
      message = err.message;
      name = err.name;
    }

    console.error("❌ Proxy error:", name, message);

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
