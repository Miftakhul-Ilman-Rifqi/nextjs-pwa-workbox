// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//     /* config options here */
// };

// export default nextConfig;

// import withPWAInit from "@ducanh2912/next-pwa";

// const withPWA = withPWAInit({
//     dest: "public",
//     register: true,
//     // Tambahkan ini
//     publicExcludes: ["!noprecache/**/*"],
//     // Aktifkan di development
//     disable: false,
//     // Izinkan IP local
//     scope: "/",
//     workboxOptions: {
//         runtimeCaching: [
//             {
//                 // Menggunakan regex yang match semua domain
//                 urlPattern:
//                     /^https?:\/\/(?:localhost:3000|192\.168\.0\.102:3000|nextjs-pwa-nu-ecru\.vercel\.app)\/api\/.*/i,
//                 handler: "NetworkFirst",
//                 options: {
//                     cacheName: "api-requests",
//                     networkTimeoutSeconds: 10,
//                     expiration: {
//                         maxEntries: 50,
//                         maxAgeSeconds: 60 * 60 * 24 * 7, // 1 minggu
//                     },
//                 },
//             },
//             {
//                 urlPattern:
//                     /^https?:\/\/(?:localhost:3000|192\.168\.0\.102:3000|nextjs-pwa-nu-ecru\.vercel\.app)\/_next\/image\?url/i,
//                 handler: "StaleWhileRevalidate",
//                 options: {
//                     cacheName: "image-cache",
//                 },
//             },
//             {
//                 urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
//                 handler: "CacheFirst",
//                 options: {
//                     cacheName: "static-images",
//                 },
//             },
//         ],
//     },
// });

// import withPWAInit from "@ducanh2912/next-pwa";
// const withPWA = withPWAInit({
//     dest: "public",
//     register: true,
//     workboxOptions: {
//         // Definisi cache untuk file statis

//         // Runtime caching untuk dynamic content
//         runtimeCaching: [
//             {
//                 // Cache API requests
//                 urlPattern:
//                     /^https?:\/\/(?:localhost:3000|192\.168\.0\.102:3000|nextjs-pwa-nu-ecru\.vercel\.app)\/api\/.*/i,
//                 handler: "NetworkFirst",
//                 options: {
//                     cacheName: "api-cache",
//                     expiration: {
//                         maxEntries: 32,
//                         maxAgeSeconds: 24 * 60 * 60, // 24 jam
//                     },
//                     networkTimeoutSeconds: 10,
//                     plugins: [
//                         {
//                             handlerDidError: async () =>
//                                 Response.json(
//                                     { message: "Anda sedang offline" },
//                                     { status: 503 }
//                                 ),
//                         },
//                     ],
//                 },
//             },
//             {
//                 // Cache static assets
//                 urlPattern: /\.(?:js|css|png|jpg|jpeg|svg|gif)$/,
//                 handler: "CacheFirst",
//                 options: {
//                     cacheName: "static-assets",
//                     expiration: {
//                         maxEntries: 32,
//                         maxAgeSeconds: 24 * 60 * 60 * 7, // 7 hari
//                     },
//                 },
//             },
//             {
//                 // Cache pages
//                 urlPattern:
//                     /^https?:\/\/(?:localhost:3000|192\.168\.0\.102:3000|nextjs-pwa-nu-ecru\.vercel\.app)\/(?!api).*/i,
//                 handler: "NetworkFirst",
//                 options: {
//                     cacheName: "pages-cache",
//                     expiration: {
//                         maxEntries: 32,
//                         maxAgeSeconds: 24 * 60 * 60,
//                     },
//                     plugins: [
//                         {
//                             handlerDidError: async () =>
//                                 Response.redirect("/~offline", 302),
//                         },
//                     ],
//                 },
//             },
//         ],
//     },
// });

// export default withPWA({
//     reactStrictMode: true,
// });

// import {
//     PHASE_DEVELOPMENT_SERVER,
//     PHASE_PRODUCTION_BUILD,
// } from "next/constants.js";
// import type { NextConfig } from "next";

// /** @type {import("next").NextConfig} */
// const nextConfig: NextConfig = {
//     reactStrictMode: true,
// };

// type Phase = typeof PHASE_DEVELOPMENT_SERVER | typeof PHASE_PRODUCTION_BUILD;

// const nextConfigFunction = async (phase: Phase) => {
//     if (
//         phase === PHASE_DEVELOPMENT_SERVER ||
//         phase === PHASE_PRODUCTION_BUILD
//     ) {
//         const withPWA = (await import("@ducanh2912/next-pwa")).default({
//             dest: "public",
//         });
//         return withPWA(nextConfig);
//     }
//     return nextConfig;
// };

// export default nextConfigFunction;

import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
    dest: "public",
    register: true,
    fallbacks: {
        document: "/~offline",
    },
    reloadOnOnline: true,
});

export default withPWA({
    reactStrictMode: true,
});
