import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const isLoggedIn = request.cookies.get("isLoggedIn");
    const { pathname } = request.nextUrl;

    // Handle root path
    if (pathname === "/") {
        return isLoggedIn
            ? NextResponse.redirect(
                  new URL("/input-data-customer", request.url)
              )
            : NextResponse.redirect(new URL("/login", request.url));
    }

    // Handle login path
    if (pathname === "/login") {
        if (isLoggedIn) {
            return NextResponse.redirect(
                new URL("/input-data-customer", request.url)
            );
        }
        return NextResponse.next();
    }

    // Protect all other routes
    if (!isLoggedIn) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        // Root path
        "/",
        // Specific paths
        "/login",
        "/input-data-customer",
        "/list-customer",
        // Dynamic paths
        "/customer/:path*",
        // You can add more protected paths here
    ],
};
