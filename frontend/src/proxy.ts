import { NextResponse, type NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  if (!req.cookies.has("tf_token")) {
    const url = new URL("/login", req.url);
    url.searchParams.set("next", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/dashboard/:path*"] };
