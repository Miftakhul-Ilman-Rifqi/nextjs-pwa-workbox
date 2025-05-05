const CACHE_NAME = "nextjs-fallback-1";
const toCache = [
  '/',
  '/~offline',
  '/manifest.json',
  '/favicon/android-chrome-192x192.png',
  '/favicon/android-chrome-512x512.png',
  '/offline.html'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(toCache);
    })
  );
});

self.addEventListener('fetch', function(event) {
  var request = event.request;
  var url = new URL(request.url);

  // Hanya tangani permintaan HTTP/HTTPS
  if (url.protocol === 'http:' || url.protocol === 'https:') {
    event.respondWith(
      caches.match(request).then(function(response) {
        return response || fetch(request).then(function(r) {
          // Simpan respons ke cache
          return caches.open(CACHE_NAME).then(function(cache) {
            cache.put(request, r.clone());
            return r;
          });
        }).catch(function() {
          // Fallback ke halaman offline
          if (request.destination === 'document') {
            return caches.match('/offline.html');
          }
          return new Response('Offline', { status: 503 });
        });
      })
    );
  }
});

self.addEventListener('activate', function(event) {
  var cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(
        keyList.map(function(key) {
          if (!cacheWhitelist.includes(key)) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});