import withSerwistInit from "@serwist/next";

/**
 * Konfigurasi Serwist untuk Next.js App Router.
 * - swSrc: sumber service worker (TypeScript)
 * - swDest: hasil build service worker (JS di public)
 * - register: true (otomatis register SW)
 * - reloadOnOnline: true (reload halaman saat online)
 */
const withSerwist = withSerwistInit({
    swSrc: "src/app/sw.ts",
    swDest: "public/sw.js",
    register: true,
    reloadOnOnline: true,
    // Tambahkan scope dan basePath untuk Vercel
    scope: "/",
    swUrl: "/sw.js",
});

const nextConfig = {
    // Tambahkan konfigurasi Next.js lain di sini jika perlu
    // Misal: images, experimental, dsb.
};

export default withSerwist(nextConfig);
