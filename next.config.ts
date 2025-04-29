// @ts-check
import withSerwistInit from "@serwist/next";

// You may want to use a more robust revision to cache
// files more efficiently.
// A viable option is `git rev-parse HEAD`.

const withSerwist = withSerwistInit({
    cacheOnNavigation: true,
    swSrc: "src/app/sw.ts",
    swDest: "public/sw.js",
    reloadOnOnline: true,
    register: true,
    additionalPrecacheEntries: [
        { url: "/~offline", revision: "1" },
        { url: "/manifest.json", revision: "1" },
        // Precache URL optimized image
        { url: "/favicon/android-chrome-512x512.png", revision: "1" },
        // Tambahkan API status check untuk Firefox
        { url: "/status-check", revision: "1" },
    ],
});

/** @type {import("next").NextConfig} */
const nextConfig = {
    // reactStrictMode: true,
    // Tambahkan headers untuk Firefox
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    {
                        key: "Service-Worker-Allowed",
                        value: "/",
                    },
                    {
                        key: "Cache-Control",
                        value: "public, max-age=0, must-revalidate",
                    },
                ],
            },
            {
                source: "/api/(.*)",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "no-store, no-cache, must-revalidate, proxy-revalidate",
                    },
                    {
                        key: "Pragma",
                        value: "no-cache",
                    },
                ],
            },
            {
                source: "/status-check",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "no-store, no-cache, must-revalidate, proxy-revalidate",
                    },
                    {
                        key: "Pragma",
                        value: "no-cache",
                    },
                    {
                        key: "Access-Control-Allow-Origin",
                        value: "*",
                    },
                ],
            },
        ];
    },
};

export default withSerwist(nextConfig);
