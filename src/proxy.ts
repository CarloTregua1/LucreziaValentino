import { NextRequest, NextResponse } from "next/server";

function decodeSessionRole(cookie: string): string | null {
  try {
    const payload = JSON.parse(atob(cookie.split(".")[1]!));
    return (payload.role as string) ?? "customer";
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get("session")?.value;

  const isAuthRoute =
    pathname.startsWith("/login") || pathname.startsWith("/registrati");
  const isAccountRoute = pathname.startsWith("/account");
  const isAdminRoute = pathname.startsWith("/admin");

  if (!sessionCookie) {
    if (isAccountRoute || isAdminRoute) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  if (isAuthRoute) {
    return NextResponse.redirect(new URL("/account", request.url));
  }

  if (isAdminRoute) {
    const role = decodeSessionRole(sessionCookie);
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/account", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*", "/admin/:path*", "/login", "/registrati"],
};
