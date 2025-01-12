import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const isLoggedIn = request.cookies.get("isLoggedIn");
    const { pathname } = request.nextUrl;

    // Redirect ke login jika belum login dan mencoba akses route protected
    if (!isLoggedIn && pathname !== "/login") {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // Redirect ke input data customer jika sudah login dan mencoba akses login/root
    if (isLoggedIn && (pathname === "/login" || pathname === "/")) {
        return NextResponse.redirect(
            new URL("/input-data-customer", request.url)
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/", "/login", "/input-data-customer"],
};
