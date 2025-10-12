import { NextResponse } from "next/server";
import { USER_DASHBOARD, WEBSITE_LOGIN } from "./routes/WebsiteRoute";
import { jwtVerify } from "jose";
import { ADMIN_DASHBOARD } from "./routes/AdminPannelRoute";

export async function middleware(req) {
  try {
    const pathname = req.nextUrl.pathname;

    const cookie = req.cookies.get("access_token");
    const access_token = cookie?.value;
    const hasToken = !!access_token;

    if (!hasToken) {
      if (!pathname.startsWith("/auth")) {
        return NextResponse.redirect(new URL(WEBSITE_LOGIN, req.nextUrl));
      }
      return NextResponse.next();
    }

    const { payload } = await jwtVerify(
      access_token,
      new TextEncoder().encode(process.env.SECRET_KEY)
    );
    const role = payload.role;

    if (pathname.startsWith("/auth")) {
      return NextResponse.redirect(
        new URL(role === "admin" ? ADMIN_DASHBOARD : USER_DASHBOARD, req.nextUrl)
      );
    }

    if (pathname.startsWith("/admin") && role !== "admin") {
      return NextResponse.redirect(new URL(WEBSITE_LOGIN, req.nextUrl));
    }

    if (pathname.startsWith("/my-account") && role !== "user") {
      return NextResponse.redirect(new URL(WEBSITE_LOGIN, req.nextUrl));
    }

    return NextResponse.next();
  } catch (error) {
    console.log("Middleware error:", error);
    return NextResponse.redirect(new URL(WEBSITE_LOGIN, req.nextUrl));
  }
}

export const config = {
  matcher: ["/admin/:path*", "/my-account/:path*", "/auth/:path*"],
};
