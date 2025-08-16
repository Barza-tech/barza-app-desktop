import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/client/dashboard", "/professional/dashboard"];

export function middleware(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;
  const isProtected = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/client/:path*", "/professional/:path*"],
};
