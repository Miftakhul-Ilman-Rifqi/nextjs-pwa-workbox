import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";

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
    runtimeCaching: defaultCache,
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
