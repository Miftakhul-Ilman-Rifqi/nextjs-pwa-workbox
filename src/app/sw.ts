/* eslint-disable @typescript-eslint/no-unused-vars */
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
        // matcher: ({ url }: { url: URL }) => /^\/api\//.test(url.pathname),
        matcher: ({ url }: { url: URL }) =>
            url.pathname.startsWith("/api") ||
            url.pathname.startsWith("/_next/data"),
        handler: new NetworkFirst({
            cacheName: "api-cache",
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
            // request.mode === "navigate",
            request.destination === "document",
        handler: new NetworkFirst({
            cacheName: "html-cache",
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
// self.addEventListener("fetch", (event: FetchEvent) => {
//     if (event.request.mode === "navigate" && event.request.method === "GET") {
//         event.respondWith(
//             (async () => {
//                 try {
//                     // Coba fetch dari network
//                     const preloadResp = await event.preloadResponse;
//                     if (preloadResp) return preloadResp;

//                     const networkResp = await fetch(event.request);
//                     return networkResp;
//                 } catch {
//                     // Jika gagal (offline), coba dari cache
//                     // const cache = await caches.open("pages");
//                     const cachedResp = await caches.match(event.request);
//                     if (cachedResp) return cachedResp;

//                     // Jika tidak ada di cache, fallback ke offline.html
//                     // const offlineCache = await caches.open("static-cache");
//                     const offlineResp = await caches.match("/offline.html");
//                     if (offlineResp) return offlineResp;

//                     // Jika offline.html tidak ada, return Response default
//                     return new Response("Offline", {
//                         status: 503,
//                         statusText: "Offline",
//                     });
//                 }
//             })()
//         );
//     }
// });
// Ganti event listener fetch dengan ini:
self.addEventListener("fetch", (event: FetchEvent) => {
    const url = new URL(event.request.url);

    // Skip non-GET requests dan request ke Vercel analytics
    if (event.request.method !== "GET" || url.pathname.startsWith("/_vercel")) {
        return;
    }

    // Handle API requests
    if (url.pathname.startsWith("/api")) {
        event.respondWith(
            (async () => {
                try {
                    const cache = await caches.open("api-cache");
                    const cachedResponse = await cache.match(event.request);

                    // Coba fetch dari network
                    const networkResponse = await fetch(event.request);

                    // Update cache jika berhasil
                    if (networkResponse.ok) {
                        await cache.put(event.request, networkResponse.clone());
                    }

                    return networkResponse;
                } catch (err) {
                    // Fallback ke cache jika offline
                    const cachedResponse = await caches.match(event.request);
                    if (cachedResponse) return cachedResponse;

                    return new Response(
                        JSON.stringify({ error: "You are offline" }),
                        {
                            status: 503,
                            headers: { "Content-Type": "application/json" },
                        }
                    );
                }
            })()
        );
        return;
    }

    // Handle navigation requests
    if (event.request.mode === "navigate") {
        event.respondWith(
            (async () => {
                try {
                    const cache = await caches.open("html-cache");
                    const networkResponse = await fetch(event.request);

                    // Update cache jika berhasil
                    if (networkResponse.ok) {
                        await cache.put(event.request, networkResponse.clone());
                    }

                    return networkResponse;
                } catch (err) {
                    // Coba dari cache
                    const cachedResponse = await caches.match(event.request);
                    if (cachedResponse) return cachedResponse;

                    // Fallback ke offline.html
                    const offlineResponse = await caches.match("/offline.html");
                    if (offlineResponse) return offlineResponse;

                    return new Response("Offline", {
                        status: 503,
                        statusText: "Offline",
                    });
                }
            })()
        );
        return;
    }

    // Default behavior untuk asset lainnya
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
