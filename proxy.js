import { NextResponse } from "next/server";

export function proxy(req) {
  
  const accesstoken = req.cookies.get("accessToken")?.value;
  const { pathname } = req.nextUrl;

  if (!accesstoken && pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", req.url));
  }
   //restricts loggedin user to go to login page
  if (accesstoken && pathname === "/login") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/profile", "/login"],
};
