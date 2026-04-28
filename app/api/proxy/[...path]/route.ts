import { NextRequest, NextResponse } from "next/server";
import { cookies as nextCookies } from "next/headers";
import { sanitizeCookie } from "@/lib/cookies";

function getSetCookieHeaders(res: Response): string[] {
  // @ts-ignore
  const raw = res.headers.getSetCookie?.();
  if (Array.isArray(raw)) return raw;
  const single = res.headers.get("set-cookie");
  return single ? [single] : [];
}

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
    const pathname = req.nextUrl.pathname;
    const proxiedPath = pathname.replace("/api/proxy/", "");

    const backendUrl = new URL(`${process.env.API_URL}/${proxiedPath}`);

    // Forward query params
    req.nextUrl.searchParams.forEach((v, k) => {
      backendUrl.searchParams.append(k, v);
    });

    // Clone headers
    const headers = new Headers(req.headers);
    headers.delete("host");

    // ✅ Forward tokens as Authorization header (NOT as custom headers)
    const accessToken = cookieStore.get("accessToken")?.value;
    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }

    let body: any = undefined;
    if (req.method !== "GET" && req.method !== "HEAD") {
      body = await req.arrayBuffer();
    }

    const res = await fetch(backendUrl.toString(), {
      method: req.method,
      headers,
      body,
      duplex: "half",
    } as any);

    const responseBody = await res.arrayBuffer();

    const responseHeaders = new Headers();

    const contentType = res.headers.get("content-type");
    if (contentType) {
      responseHeaders.set("content-type", contentType);
    }

    const cacheControl = res.headers.get("cache-control");
    if (cacheControl) {
      responseHeaders.set("cache-control", cacheControl);
    }

    // ✅ Forward any new cookies from backend (sanitized for frontend domain)
    const setCookieHeaders = getSetCookieHeaders(res);
    setCookieHeaders.forEach((cookie) => {
      responseHeaders.append("set-cookie", sanitizeCookie(cookie));
    });

    return new NextResponse(responseBody, {
      status: res.status,
      headers: responseHeaders,
    });
  } catch (err: any) {
    return NextResponse.json(
      { status: "fail", message: err?.message || "Proxy error" },
      { status: 500 },
    );
  }
}
