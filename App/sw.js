const CACHE_NAME = 'rawatan-pagi-v5';

// Install Event
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

// Activate Event - Bersihkan semua cache lama
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => caches.delete(cache))
            );
        })
    );
    self.clients.claim();
});

// Fetch Event - Langsung ambil dari network tanpa memblokir
self.addEventListener('fetch', (event) => {
    event.respondWith(fetch(event.request));
});