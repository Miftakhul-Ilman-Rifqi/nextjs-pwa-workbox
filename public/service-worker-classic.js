const CACHE_NAME = "CMS-CLASSIC-1";
const OFFLINE_URL = "/offline.html";
const PRECACHE_URLS = [
    "/",
    "/offline.html",
    "/manifest.json",
    "/favicon/android-chrome-512x512.png",
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)) // <-- Tambahkan titik koma
    ); // <-- Tambahkan kurung penutup untuk waitUntil
});

self.addEventListener("fetch", (event) => {
    if (event.request.mode === "navigate") {
        event.respondWith(
            fetch(event.request).catch(() => caches.match(OFFLINE_URL))
        ); // <-- Tambahkan kurung penutup untuk respondWith
    } else {
        event.respondWith(
            caches
                .match(event.request)
                .then((cached) => cached || fetch(event.request))
        );
    }
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then(
            (keys) =>
                Promise.all(
                    keys.map((key) =>
                        key !== CACHE_NAME ? caches.delete(key) : null
                    ) // <-- Tambahkan kurung penutup untuk map
                ) // <-- Tambahkan kurung penutup untuk Promise.all
        ) // <-- Tambahkan kurung penutup untuk then
    ); // <-- Tambahkan kurung penutup untuk waitUntil
});
