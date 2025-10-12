import { NextResponse } from "next/server";
import { USER_DASHBOARD, WEBSITE_LOGIN } from "./routes/WebsiteRoute";
import { jwtVerify } from "jose";
import { ADMIN_DASHBOARD } from "./routes/AdminPannelRoute";

export async function middleware(req) {
  const pathname = req.nextUrl.pathname;

  // Headers for CORS
  const headers = new Headers();
  headers.set("Access-Control-Allow-Origin", "https://mern-ecommese-r.vercel.app/"); // production me "*" ki jagah frontend domain
  headers.set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle preflight requests (OPTIONS)
  if (req.method === "OPTIONS") {
    return new NextResponse(null, { headers });
  }

  try {
    const cookie = req.cookies.get("access_token");
    const access_token = cookie?.value;
    const hasToken = !!access_token;

    if (!hasToken) {
      if (!pathname.startsWith("/auth")) {
        return NextResponse.redirect(new URL(WEBSITE_LOGIN, req.nextUrl), { headers });
      }
      return NextResponse.next({ headers });
    }

    const { payload } = await jwtVerify(
      access_token,
      new TextEncoder().encode(process.env.SECRET_KEY)
    );
    const role = payload.role;

    if (pathname.startsWith("/auth")) {
      return NextResponse.redirect(
        new URL(role === "admin" ? ADMIN_DASHBOARD : USER_DASHBOARD, req.nextUrl),
        { headers }
      );
    }

    if (pathname.startsWith("/admin") && role !== "admin") {
      return NextResponse.redirect(new URL(WEBSITE_LOGIN, req.nextUrl), { headers });
    }

    if (pathname.startsWith("/my-account") && role !== "user") {
      return NextResponse.redirect(new URL(WEBSITE_LOGIN, req.nextUrl), { headers });
    }

    return NextResponse.next({ headers });
  } catch (error) {
    console.log("Middleware error:", error);
    return NextResponse.redirect(new URL(WEBSITE_LOGIN, req.nextUrl), { headers });
  }
}

export const config = {
  matcher: ["/admin/:path*", "/my-account/:path*", "/auth/:path*"],
};
