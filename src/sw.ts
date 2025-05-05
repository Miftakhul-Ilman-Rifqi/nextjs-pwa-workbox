import { clientsClaim } from "workbox-core";
import { precacheAndRoute, createHandlerBoundToURL } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { NetworkFirst, StaleWhileRevalidate } from "workbox-strategies";
import { CacheableResponsePlugin } from "workbox-cacheable-response";

declare const self: ServiceWorkerGlobalScope;

// Filter manifest untuk menghilangkan file yang tidak perlu
const manifest = (self.__WB_MANIFEST || []).filter((entry) => {
    if (typeof entry === "string") {
        return (
            !entry.includes("_next/app-build-manifest.json") &&
            !entry.includes("_next/build-manifest.json")
        );
    }
    return (
        !entry.url.includes("_next/app-build-manifest.json") &&
        !entry.url.includes("_next/build-manifest.json")
    );
});

// Precache hanya assets yang diperlukan
precacheAndRoute(manifest);

// Fallback untuk halaman
registerRoute(
    ({ request }) => request.mode === "navigate",
    createHandlerBoundToURL("/offline")
);

// Cache API responses
registerRoute(
    ({ url }) => url.pathname.startsWith("/api"),
    new NetworkFirst({
        cacheName: "apis",
        plugins: [
            new CacheableResponsePlugin({
                statuses: [0, 200],
            }),
        ],
    })
);

// Cache static assets
registerRoute(
    ({ request }) =>
        request.destination === "script" || request.destination === "style",
    new StaleWhileRevalidate({
        cacheName: "static-assets",
    })
);

self.addEventListener("message", (event) => {
    if (event.data && event.data.type === "SKIP_WAITING") {
        self.skipWaiting();
    }
});

clientsClaim();

console.log("Files to precache:", manifest);
