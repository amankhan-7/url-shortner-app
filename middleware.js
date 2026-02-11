import { NextResponse } from "next/server";

export function middleware(req) {
  const { pathname } = req.nextUrl;

  if (pathname === "/" || "/profile") {
    const token = req.cookies.get("token")?.value;
    console.log(token);

    if (!token) {
      return NextResponse.redirect(
        new URL("/login", req.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/profile"],
};
