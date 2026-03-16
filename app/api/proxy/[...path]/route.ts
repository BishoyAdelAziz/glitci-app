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

    const backendUrl = new URL(`${process.env.API_URL}/${proxiedPath}`);
    req.nextUrl.searchParams.forEach((v, k) =>
      backendUrl.searchParams.append(k, v),
    );

    // 1. Forward headers but DO NOT force application/json
    const headers = new Headers(req.headers);
    headers.delete("host"); // Important for proxying to external APIs

    if (token) headers.set("authorization", `Bearer ${token}`);

    // 2. IMPORTANT: If it's form-data/multipart, we must NOT set the content-type manually.
    // We let the browser's original header (which includes the boundary) pass through.
    // If you need to force JSON for OTHER requests, do it conditionally:
    if (!headers.get("content-type")?.includes("multipart/form-data")) {
      // Only set JSON if it's not a file upload
      // headers.set("content-type", "application/json");
    }

    let body: any = undefined;
    if (req.method !== "GET" && req.method !== "HEAD") {
      // 3. Use arrayBuffer to keep the "File" as raw binary
      body = await req.arrayBuffer();
    }

    const res = await fetch(backendUrl.toString(), {
      method: req.method,
      headers,
      body,
      duplex: "half",
    } as any);

    // ... handle response (use arrayBuffer for the response too to be safe)
    const responseData = await res.arrayBuffer();

    return new NextResponse(responseData, {
      status: res.status,
      headers: {
        "Content-Type": res.headers.get("content-type") || "application/json",
      },
    });
  } catch (err) {
    return NextResponse.json({ status: "fail" }, { status: 500 });
  }
}
