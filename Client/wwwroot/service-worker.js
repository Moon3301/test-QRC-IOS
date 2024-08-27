// Define a cache name
var cacheName = 'pwa-qrc';
// Specify the files to cache
var filesToCache = [
    '/styles/site.min.css',
    '/scripts/general.min.js',
    '/favicon.ico'
];

// Install event - cache files (pre-cache)
self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open(cacheName).then(function (cache) {
            return cache.addAll(filesToCache);
        })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', function (e) {
    e.waitUntil(
        caches.keys().then(function (keyList) {
            return Promise.all(keyList.map(function (key) {
                if (key !== cacheName) {
                    return caches.delete(key);
                }
            }));
        })
    );
});

// Fetch event - serve files from cache or fetch from network
self.addEventListener('fetch', function (e) {
    e.respondWith(
        caches.match(e.request).then(function (response) {
            return response || fetch(e.request);
        })
    );
});
