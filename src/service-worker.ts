import { clientsClaim } from "workbox-core";
import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { StaleWhileRevalidate, NetworkFirst } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";

declare const self: ServiceWorkerGlobalScope;

// Klaim kontrol segera
clientsClaim();

// Precache semua aset Next.js
precacheAndRoute(self.__WB_MANIFEST);

// Cache halaman
registerRoute(
    ({ request }) => request.mode === "navigate",
    new NetworkFirst({
        cacheName: "pages",
        plugins: [
            new ExpirationPlugin({
                maxEntries: 20,
                maxAgeSeconds: 7 * 24 * 60 * 60, // 7 hari
            }),
        ],
    })
);

// Cache API routes
registerRoute(
    ({ url }) => url.pathname.startsWith("/api"),
    new NetworkFirst({
        cacheName: "apis",
        plugins: [
            new ExpirationPlugin({
                maxEntries: 50,
                maxAgeSeconds: 5 * 60, // 5 menit
            }),
        ],
    })
);

// Cache static assets
registerRoute(
    ({ request }) =>
        ["image", "font", "script", "style"].includes(request.destination),
    new StaleWhileRevalidate({
        cacheName: "assets",
        plugins: [
            new ExpirationPlugin({
                maxEntries: 100,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 hari
            }),
        ],
    })
);

// Offline fallback
registerRoute(
    ({ request }) => request.destination === "document",
    new NetworkFirst({
        cacheName: "offline-fallback",
        networkTimeoutSeconds: 3,
        plugins: [
            new ExpirationPlugin({
                maxEntries: 1,
            }),
        ],
    })
);

self.addEventListener("install", (event) => {
    event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
    event.waitUntil(self.clients.claim());
});
