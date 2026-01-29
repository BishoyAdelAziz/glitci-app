// app/api/proxy/[...path]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies as nextCookies } from "next/headers";

// ✅ Add this to enable dynamic behavior
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

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

    // Get accessToken from Authorization header
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    const pathname = req.nextUrl.pathname;
    const proxiedPath = pathname.replace("/api/proxy/", "");

    console.log("🔍 Proxying:", req.method, proxiedPath); // Debug log

    if (!process.env.API_URL) throw new Error("API_URL is not defined");

    const backendUrl = new URL(`${process.env.API_URL}/${proxiedPath}`);
    req.nextUrl.searchParams.forEach((value, key) => {
      backendUrl.searchParams.append(key, value);
    });

    const headers = new Headers();
    headers.set("content-type", "application/json");
    if (token) headers.set("authorization", `Bearer ${token}`);

    let body: string | undefined;
    if (req.method !== "GET" && req.method !== "HEAD") {
      body = await req.text();
    }

<<<<<<< HEAD
    // Fetch backend
=======
    console.log("🚀 Fetching:", backendUrl.toString()); // Debug log

>>>>>>> 1b4b1063fb867cc1fb7363bee159204eaf7bda5d
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
<<<<<<< HEAD
      response.cookies.delete("GlitciAccessToken");
      response.cookies.delete("GlitciRefreshToken");
      response.cookies.delete("GlitciUser");
      response.cookies.delete("GlitciTokenExpiry");
=======
      response.cookies.delete("refreshToken");

>>>>>>> 1b4b1063fb867cc1fb7363bee159204eaf7bda5d
      return response;
    }

    // Normal response
    const response = new NextResponse(data, {
      status: res.status,
      headers: {
        "Content-Type": res.headers.get("content-type") || "application/json",
      },
    });

    // Forward ALL Set-Cookie headers from backend
    res.headers.forEach((value, key) => {
      if (key.toLowerCase() === "set-cookie") {
        response.headers.append(key, value);
      }
    });

<<<<<<< HEAD
    // --- Special Handling: Login ---
    if (proxiedPath === "auth/login" && res.ok) {
      try {
        const jsonData = JSON.parse(data);

        // Set HTTP-only token cookie
        response.cookies.set("GlitciAccessToken", jsonData.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 30,
        });

        // Set Client-readable expiry for AuthWatcher ✅
        response.cookies.set("GlitciTokenExpiry", jsonData.accessTokenExpires, {
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
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
          maxAge: 60 * 60 * 24 * 7,
        });
      } catch (e) {
        console.warn("Login response not JSON, skipping cookie set");
      }
    }

    // --- Special Handling: Refresh ---
    if (proxiedPath === "auth/refresh" && res.ok) {
      try {
        const jsonData = JSON.parse(data);

        response.cookies.set("GlitciAccessToken", jsonData.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
        });

        response.cookies.set("GlitciTokenExpiry", jsonData.accessTokenExpires, {
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
        });
      } catch (e) {
        console.warn("Refresh response not JSON");
      }
    }

=======
>>>>>>> 1b4b1063fb867cc1fb7363bee159204eaf7bda5d
    return response;
  } catch (err: unknown) {
    let message = "Unknown error occurred";
    if (err instanceof Error) message = err.message;
    console.error("❌ Proxy error:", err);
    return NextResponse.json(
      { status: "fail", error: [], message },
      { status: 500 },
    );
  }
}
