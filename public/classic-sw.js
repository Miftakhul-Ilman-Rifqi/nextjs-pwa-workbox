const CACHE_NAME = "CMS-ClassicSW-1";
const toCache = [
    "/",
    "/manifest.json",
    "/offline.html",
    "/favicon/android-chrome-192x192.png",
    "/favicon/android-chrome-512x512.png",
    "/favicon/apple-touch-icon.png",
    "/favicon/favicon-16x16.png",
    "/favicon/favicon-32x32.png",
    "/favicon/favicon.ico",
    "/file.svg",
    "/globe.svg",
    "/next.svg",
    "/vercel.svg",
    "/window.svg",
];

self.addEventListener("install", function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.addAll(toCache);
        })
    );
});

self.addEventListener("fetch", function (event) {
    var request = event.request;
    var url = new URL(request.url);

    // Hanya proses permintaan HTTP/HTTPS
    if (url.protocol === "http:" || url.protocol === "https:") {
        // Jika permintaan API
        if (url.pathname.startsWith("/api/")) {
            event.respondWith(
                fetch(request)
                    .then(function (response) {
                        // Buka cache dan simpan respons API
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME).then(function (cache) {
                            cache.put(request, responseToCache);
                        });
                        return response;
                    })
                    .catch(function () {
                        // Jika offline, coba ambil dari cache
                        return caches.match(request);
                    })
            );
        }
        // Untuk permintaan halaman/dokumen
        else if (request.destination === "document") {
            event.respondWith(
                fetch(request)
                    .then(function (response) {
                        return response;
                    })
                    .catch(function () {
                        // Jika offline, tampilkan halaman offline
                        return caches.match("/offline.html");
                    })
            );
        }
        // Untuk resource lainnya
        else {
            event.respondWith(
                caches.match(request).then(function (response) {
                    return (
                        response ||
                        fetch(request).then(function (fetchResponse) {
                            // Cache resource yang baru diambil
                            const responseToCache = fetchResponse.clone();
                            caches.open(CACHE_NAME).then(function (cache) {
                                cache.put(request, responseToCache);
                            });
                            return fetchResponse;
                        })
                    );
                })
            );
        }
    }
});

self.addEventListener("activate", function (event) {
    var cacheWhitelist = [CACHE_NAME];

    event.waitUntil(
        caches.keys().then(function (keyList) {
            return Promise.all(
                keyList.map(function (key) {
                    if (!cacheWhitelist.includes(key)) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
});
