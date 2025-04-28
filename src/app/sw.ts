import { defaultCache } from "@serwist/next/worker";
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
        ...defaultCache,
        // Halaman HTML - Network First dengan timeout 3 detik
        {
            matcher({ request, sameOrigin }) {
                return sameOrigin && request.destination === "document";
            },
            handler: new NetworkFirst({
                cacheName: "pages",
                networkTimeoutSeconds: 3,
            }),
        },

        // API - Stale While Revalidate
        {
            matcher({ url }) {
                return url.pathname.startsWith("/api/");
            },
            handler: new StaleWhileRevalidate({
                cacheName: "apis",
                plugins: [
                    {
                        cacheKeyWillBeUsed: async ({ request }) => {
                            const url = new URL(request.url);
                            // Hapus query parameter untuk caching yang lebih konsisten
                            return url.pathname;
                        },
                    },
                ],
            }),
        },

        // Asset static - Cache First
        {
            matcher({ request }) {
                return ["style", "script", "image"].includes(
                    request.destination
                );
            },
            handler: new CacheFirst({
                cacheName: "assets",
                plugins: [
                    {
                        cacheWillUpdate: async ({ response }) => {
                            // Cache hanya response valid (status 200)
                            return response.status === 200 ? response : null;
                        },
                    },
                ],
            }),
        },

        // Fallback untuk semua request lainnya
        {
            matcher: () => true,
            handler: new NetworkFirst({
                cacheName: "fallback",
                networkTimeoutSeconds: 3,
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

let isOnline = true;

const notifyClients = () => {
    self.clients.matchAll({ type: "window" }).then((clients) => {
        clients.forEach((client) => {
            client.postMessage({ type: "NETWORK_STATUS", isOnline });
        });
    });
};

// Network detection yang lebih reliable
const updateNetworkStatus = async () => {
    try {
        await fetch(window.location.origin, {
            method: "HEAD",
            cache: "no-store",
        });
        if (!isOnline) {
            isOnline = true;
            notifyClients();
        }
    } catch {
        if (isOnline) {
            isOnline = false;
            notifyClients();
        }
    }
};

// Periodic check setiap 5 detik
setInterval(updateNetworkStatus, 5000);

// Juga check saat ada event fetch
self.addEventListener("fetch", () => {
    updateNetworkStatus();
});

// Handle skip waiting
self.addEventListener("message", (event) => {
    if (event.data === "skipWaiting") {
        self.skipWaiting();
    }
});

serwist.addEventListeners();
