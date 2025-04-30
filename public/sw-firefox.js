// public/sw-firefox.js

const CACHE_NAME = "cms-static-v1";
const API_CACHE = "cms-apis-v1";
const ASSET_CACHE = "cms-assets-v1";

const STATIC_ASSETS = [
    "/",
    "/offline",
    "/manifest.json",
    "/favicon/android-chrome-192x192.png",
    "/favicon/android-chrome-512x512.png",
    // tambah asset lain sesuai kebutuhan…
];

// Install: precache shell
self.addEventListener("install", (evt) => {
    evt.waitUntil(
        caches
            .open(CACHE_NAME)
            .then((cache) => cache.addAll(STATIC_ASSETS))
            .then(() => self.skipWaiting())
    );
});

// Activate: ambil alih klien segera
self.addEventListener("activate", (evt) => {
    evt.waitUntil(self.clients.claim());
});

// Fetch: strategi berbeda untuk navigasi, API, dan asset
self.addEventListener("fetch", (evt) => {
    const { request } = evt;

    // 1) Halaman HTML: NetworkFirst → fallback ke cache/offline
    if (request.mode === "navigate") {
        evt.respondWith(
            fetch(request)
                .then((res) => res)
                .catch(() => caches.match("/~offline"))
        );
        return;
    }

    // 2) API calls: Stale‐While‐Revalidate
    if (
        request.url.includes("/api/") ||
        request.url.includes("/authenticated/")
    ) {
        evt.respondWith(
            caches.open(API_CACHE).then((cache) =>
                cache.match(request).then((cached) =>
                    fetch(request)
                        .then((res) => {
                            cache.put(request, res.clone());
                            return res;
                        })
                        .catch(() => cached)
                )
            )
        );
        return;
    }

    // 3) Assets (script/style/image/font): CacheFirst
    if (["script", "style", "image", "font"].includes(request.destination)) {
        evt.respondWith(
            caches.match(request).then(
                (cached) =>
                    cached ||
                    fetch(request).then((res) => {
                        caches
                            .open(ASSET_CACHE)
                            .then((c) => c.put(request, res.clone()));
                        return res;
                    })
            )
        );
        return;
    }

    // 4) Fallback generic: NetworkFirst
    evt.respondWith(
        fetch(request)
            .then((res) => res)
            .catch(() => caches.match(request))
    );
});
