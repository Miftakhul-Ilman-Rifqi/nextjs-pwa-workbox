import { NextResponse } from "next/server";

// Route sederhana untuk status check
// Ini membantu Firefox mendeteksi status koneksi

export async function GET() {
    return NextResponse.json(
        { status: "online", timestamp: Date.now() },
        {
            status: 200,
            headers: {
                "Cache-Control":
                    "no-store, no-cache, must-revalidate, proxy-revalidate",
                Pragma: "no-cache",
                Expires: "0",
                "Surrogate-Control": "no-store",
                // Header khusus untuk Firefox
                "X-Firefox-Spdy": "h2",
            },
        }
    );
}

export async function HEAD() {
    return NextResponse.json(
        {},
        {
            status: 200,
            headers: {
                "Cache-Control":
                    "no-store, no-cache, must-revalidate, proxy-revalidate",
                Pragma: "no-cache",
                Expires: "0",
                "Surrogate-Control": "no-store",
                // Header khusus untuk Firefox
                "X-Firefox-Spdy": "h2",
            },
        }
    );
}
