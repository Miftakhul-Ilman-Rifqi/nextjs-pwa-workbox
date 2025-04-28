import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { CacheableResponsePlugin, NetworkFirst, Serwist, StaleWhileRevalidate } from "serwist";

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
        ...defaultCache,
        {
            matcher: ({ url }) => url.pathname.startsWith("/api"),
            handler: new NetworkFirst({
                cacheName: "apis",
                plugins: [
                    new CacheableResponsePlugin({
                        statuses: [0, 200],
                    }),
                ],
            }),
        },
        {
            matcher: ({ request }) => request.destination === "image",
            handler: new StaleWhileRevalidate({
                cacheName: "images",
                plugins: [
                    new CacheableResponsePlugin({
                        statuses: [0, 200],
                    }),
                ],
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

// Tambahkan event listener untuk auto reload
self.addEventListener("message", (event) => {
    if (event.data === "skipWaiting") {
        self.skipWaiting();
    }
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

serwist.addEventListeners();
