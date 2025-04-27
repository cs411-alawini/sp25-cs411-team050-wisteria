import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "../lib/auth";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const isValid = token && verifyToken(token);

  if (!isValid) {
    const url = req.nextUrl.clone();
    url.pathname = "/signin";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/home/:path*"],
};
