/* eslint-disable @typescript-eslint/no-unused-vars */
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import {
    CacheFirst,
    ExpirationPlugin,
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
        // Cache halaman HTML dengan NetworkFirst (prioritas network, fallback ke cache)
        {
            matcher({ request, sameOrigin }) {
                return sameOrigin && request.destination === "document";
            },
            handler: new NetworkFirst({
                cacheName: "pages",
                networkTimeoutSeconds: 3, // Timeout 3 detik lalu fallback ke cache
                plugins: [
                    new ExpirationPlugin({
                        maxEntries: 100,
                        maxAgeSeconds: 60 * 60 * 24 * 30, // 30 hari
                    }),
                ],
            }),
        },

        // Cache API responses dengan StaleWhileRevalidate (cache dulu, update di background)
        {
            matcher({ url }) {
                return (
                    url.pathname.startsWith("/api/") ||
                    url.pathname.startsWith("/authenticated/")
                );
            },
            handler: new StaleWhileRevalidate({
                cacheName: "apis",
                plugins: [
                    new ExpirationPlugin({
                        maxEntries: 1000,
                        maxAgeSeconds: 60 * 60 * 24 * 5, // 5 hari
                    }),
                ],
            }),
        },

        // Cache assets dengan CacheFirst (prioritas cache)
        {
            matcher({ request }) {
                return ["style", "script", "image", "font"].includes(
                    request.destination
                );
            },
            handler: new CacheFirst({
                cacheName: "assets",
                plugins: [
                    new ExpirationPlugin({
                        maxEntries: 300,
                        maxAgeSeconds: 60 * 60 * 24 * 60, // 60 hari
                    }),
                ],
            }),
        },

        // Fallback untuk semua request lainnya (cache setelah pertama kali diakses)
        {
            matcher: () => true, // Tangkap semua request
            handler: new NetworkFirst({
                cacheName: "misc",
                plugins: [
                    new ExpirationPlugin({
                        maxEntries: 200,
                        maxAgeSeconds: 60 * 60 * 24, // 1 hari
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

let isOnline = true;

const notifyClients = () => {
    self.clients.matchAll({ type: "window" }).then((clients) => {
        clients.forEach((client) => {
            client.postMessage({ type: "NETWORK_STATUS", isOnline });
        });
    });
};

// Network detection yang lebih reliable dan kompatibel dengan Firefox
const updateNetworkStatus = async () => {
    try {
        // Gunakan randomized parameter untuk menghindari cache Firefox
        const timestamp = Date.now();
        const response = await fetch(
            `${self.location.origin}/status-check?t=${timestamp}`,
            {
                method: "HEAD",
                cache: "no-store",
                credentials: "omit", // Hindari cookie untuk kurangi overhead
                mode: "no-cors", // Penting untuk kompatibilitas Firefox
            }
        );

        if (!isOnline) {
            isOnline = true;
            notifyClients();
        }
    } catch (error) {
        if (isOnline) {
            isOnline = false;
            notifyClients();
        }
    }
};

// Periodic check setiap 5 detik
setInterval(updateNetworkStatus, 5000);

// Handle navigator.onLine untuk Firefox
self.addEventListener("online", () => {
    updateNetworkStatus();
});

self.addEventListener("offline", () => {
    if (isOnline) {
        isOnline = false;
        notifyClients();
    }
});

// Juga check saat ada event fetch
self.addEventListener("fetch", () => {
    // Tambahkan timeout untuk mengurangi beban dan hindari blocking di Firefox
    setTimeout(updateNetworkStatus, 1000);
});

// Handle skip waiting
self.addEventListener("message", (event) => {
    if (event.data === "skipWaiting") {
        self.skipWaiting();
    }
});

serwist.addEventListeners();
