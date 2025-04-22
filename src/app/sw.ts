import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import {
    CacheFirst,
    NetworkFirst,
    Serwist,
    StaleWhileRevalidate,
} from "serwist";

declare global {
    interface WorkerGlobalScope extends SerwistGlobalConfig {
        // Change this attribute's name to your `injectionPoint`.
        // `injectionPoint` is an InjectManifest option.
        // See https://serwist.pages.dev/docs/build/configuring
        __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
    }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
    precacheEntries: self.__SW_MANIFEST,
    skipWaiting: true,
    clientsClaim: true,
    navigationPreload: true,
    runtimeCaching: [
        // Cache API dengan NetworkFirst untuk offline support
        {
            matcher: ({ url }) => url.pathname.startsWith("/api/"),
            handler: new NetworkFirst({
                cacheName: "api-responses",
                networkTimeoutSeconds: 3,
            }),
        },
        // Cache favicon asli (fallback)
        // Cache gambar favicon dan aset statis dengan CacheFirst
        // {
        //     matcher: ({ request }) =>
        //         request.destination === "image" ||
        //         request.url.includes("/favicon/"),
        //     handler: new CacheFirst({
        //         cacheName: "images",
        //     }),
        // },

        // // Cache dokumen HTML dengan NetworkFirst
        // {
        //     matcher: ({ request }) => request.destination === "document",
        //     handler: new StaleWhileRevalidate({
        //         cacheName: "documents",
        //     }),
        // },
        // Cache Next.js optimized images
        {
            matcher: ({ url }) =>
                url.pathname.startsWith("/_next/image") &&
                url.searchParams.has("url"),
            handler: new CacheFirst({
                cacheName: "next-images",
                plugins: [
                    {
                        cacheKeyWillBeUsed: ({ request }) => {
                            // Normalize URL untuk menghindari duplikasi cache
                            const url = new URL(request.url);
                            const imageUrl = url.searchParams.get("url");
                            return `${url.origin}${imageUrl}`;
                        },
                    },
                ],
            }),
        },
        // Cache static assets from _next
        {
            matcher: ({ url }) => url.pathname.startsWith("/_next/static/"),
            handler: new CacheFirst({
                cacheName: "next-static",
            }),
        },
        // Cache JavaScript dengan StaleWhileRevalidate
        {
            matcher: ({ request }) => request.destination === "script",
            handler: new StaleWhileRevalidate({
                cacheName: "scripts",
            }),
        },
        // Cache CSS dengan StaleWhileRevalidate
        {
            matcher: ({ request }) => request.destination === "style",
            handler: new StaleWhileRevalidate({
                cacheName: "styles",
            }),
        },
    ],

    fallbacks: {
        entries: [
            {
                url: "/~offline",
                matcher({ request }) {
                    return request.destination === "document";
                },
            },
        ],
    },
});

// Auto reload saat online
self.addEventListener("activate", () => {
    self.clients.claim().then(() => {
        self.clients.matchAll().then((clients) => {
            clients.forEach((client) => {
                client.postMessage({ type: "WINDOW_RELOAD" });
            });
        });
    });
});

// Auto reload when connection is restored
self.addEventListener("online", () => {
    self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
            client.postMessage({ type: "ONLINE_RECONNECTED" });
        });
    });
});

// Tambahkan event listener untuk auto reload
self.addEventListener("message", (event) => {
    if (event.data === "skipWaiting") {
        self.skipWaiting();
    }
});

serwist.addEventListeners();
