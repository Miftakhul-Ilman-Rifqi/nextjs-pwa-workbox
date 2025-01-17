import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const isLoggedIn = request.cookies.get("isLoggedIn");
    const { pathname } = request.nextUrl;

    // Untuk root path, redirect ke login
    if (pathname === "/") {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // Jika path adalah /login
    if (pathname === "/login") {
        // Jika sudah login, redirect ke default page
        if (isLoggedIn) {
            return NextResponse.redirect(
                new URL("/input-data-customer", request.url)
            );
        }
        // Jika belum login, biarkan di halaman login
        return NextResponse.next();
    }

    // Untuk semua path lainnya, cek login
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
        "/customer/:path*", // Ini akan menangkap semua path yang dimulai dengan /customer/
    ],
};
