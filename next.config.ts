// @ts-check
import withSerwistInit from "@serwist/next";

// You may want to use a more robust revision to cache
// files more efficiently.
// A viable option is `git rev-parse HEAD`.
const revision = crypto.randomUUID();

const withSerwist = withSerwistInit({
    cacheOnNavigation: true,
    swSrc: "src/app/sw.ts",
    swDest: "public/sw.js",
    reloadOnOnline: true,
    additionalPrecacheEntries: [
        { url: "/~offline", revision },
        { url: "/favicon/android-chrome-512x512.png", revision },
        { url: "/favicon/android-chrome-192x192.png", revision },
        { url: "/favicon/apple-touch-icon.png", revision },
        { url: "/favicon/favicon-16x16.png", revision },
        { url: "/favicon/favicon-32x32.png", revision },
        { url: "/favicon/favicon.ico", revision },
    ],
});

/** @type {import("next").NextConfig} */
const nextConfig = {
    // reactStrictMode: true,
};

export default withSerwist(nextConfig);
