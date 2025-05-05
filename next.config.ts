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
    scope: "/",
    additionalPrecacheEntries: [
        { url: "/~offline", revision: "1" },
        { url: "/manifest.json", revision: "1" },
        // Precache URL optimized image
        { url: "/favicon/android-chrome-512x512.png", revision: "1" },
    ],
});

/** @type {import("next").NextConfig} */
const nextConfig = {};

export default withSerwist(nextConfig);
