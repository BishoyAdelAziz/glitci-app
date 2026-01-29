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

    if (res.status === 401) {
      const response = NextResponse.redirect(new URL("/login", req.url));
      response.cookies.delete("GlitciAccessToken");
      response.cookies.delete("GlitciRefreshToken");
      response.cookies.delete("GlitciUser");
      response.cookies.delete("GlitciTokenExpiry");
      return response;
    }

    const response = new NextResponse(data, {
      status: res.status,
      headers: {
        "Content-Type": res.headers.get("content-type") || "application/json",
      },
    });

    res.headers.forEach((value, key) => {
      if (key.toLowerCase() === "set-cookie")
        response.headers.append(key, value);
    });

    // Handle Login & Refresh to set Client-Readable Expiry
    if (
      (proxiedPath === "auth/login" || proxiedPath === "auth/refresh") &&
      res.ok
    ) {
      try {
        const jsonData = JSON.parse(data);
        const isProduction = process.env.NODE_ENV === "production";

        response.cookies.set("GlitciAccessToken", jsonData.accessToken, {
          httpOnly: true,
          secure: isProduction,
          sameSite: "lax",
          path: "/",
        });

        response.cookies.set("GlitciTokenExpiry", jsonData.accessTokenExpires, {
          httpOnly: false, // ALLOW JS TO READ
          secure: isProduction,
          sameSite: "lax",
          path: "/",
        });

        if (jsonData.refreshToken) {
          response.cookies.set("GlitciRefreshToken", jsonData.refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: "lax",
            path: "/",
          });
        }
      } catch (e) {
        console.warn("Response parsing failed");
      }
    }

    return response;
  } catch (err: unknown) {
    return NextResponse.json(
      { status: "fail", message: "Proxy error" },
      { status: 500 },
    );
  }
}
