import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";
import { NetworkFirst } from "@serwist/strategies";
import { ExpirationPlugin } from "@serwist/expiration";

// Deklarasi global untuk manifest
declare global {
    interface WorkerGlobalScope extends SerwistGlobalConfig {
        __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
    }
}

declare const self: ServiceWorkerGlobalScope;

// Custom runtime caching untuk API dan HTML
const customRuntimeCaching = [
    // Cache API: NetworkFirst, fallback ke cache jika offline
    {
        matcher: ({ url }: { url: URL }) => /^\/api\//.test(url.pathname),
        handler: new NetworkFirst({
            // tanpa cachename
            networkTimeoutSeconds: 5,
            plugins: [
                new ExpirationPlugin({
                    maxEntries: 100,
                    maxAgeSeconds: 24 * 60 * 60, // 1 hari
                }),
            ],
        }),
    },
    // Cache halaman HTML: NetworkFirst, fallback ke offline.html jika offline
    {
        matcher: ({ request }: { request: Request }) =>
            request.mode === "navigate",
        handler: new NetworkFirst({
            // cacheName: "html-cache",
            networkTimeoutSeconds: 5,
            plugins: [
                new ExpirationPlugin({
                    maxEntries: 50,
                    maxAgeSeconds: 24 * 60 * 60, // 1 hari
                }),
            ],
        }),
    },
];

// Inisialisasi Serwist
const serwist = new Serwist({
    precacheEntries: self.__SW_MANIFEST,
    skipWaiting: true,
    clientsClaim: true,
    navigationPreload: true,
    runtimeCaching: [...defaultCache, ...customRuntimeCaching],
});

// Tambahkan event listener
serwist.addEventListeners();

// Fallback offline.html untuk navigasi jika offline dan tidak ada cache
self.addEventListener("fetch", (event: FetchEvent) => {
    if (event.request.mode === "navigate" && event.request.method === "GET") {
        event.respondWith(
            (async () => {
                try {
                    // Coba fetch dari network
                    const preloadResp = await event.preloadResponse;
                    if (preloadResp) return preloadResp;

                    const networkResp = await fetch(event.request);
                    return networkResp;
                } catch {
                    // Jika gagal (offline), coba dari cache
                    // const cache = await caches.open("pages");
                    const cachedResp = await caches.match(event.request);
                    if (cachedResp) return cachedResp;

                    // Jika tidak ada di cache, fallback ke offline.html
                    // const offlineCache = await caches.open("static-cache");
                    const offlineResp = await caches.match("/offline.html");
                    if (offlineResp) return offlineResp;

                    // Jika offline.html tidak ada, return Response default
                    return new Response("Offline", {
                        status: 503,
                        statusText: "Offline",
                    });
                }
            })()
        );
    }
});
