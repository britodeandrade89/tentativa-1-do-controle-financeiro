const CACHE_NAME = 'financas-ai-cache-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/index.css',
    '/index.tsx',
    '/manifest.json',
    '/icon.svg'
];

// Install event: precache the app shell
self.addEventListener('install', (evt) => {
    console.log('[Service Worker] Install');
    evt.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[Service Worker] Pre-caching offline page');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting();
});

// Activate event: clean up old caches
self.addEventListener('activate', (evt) => {
    console.log('[Service Worker] Activate');
    evt.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) {
                    console.log('[Service Worker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    self.clients.claim();
});

// Fetch event: serve content using a stale-while-revalidate strategy
self.addEventListener('fetch', (evt) => {
    // Ignore non-GET requests and Firestore API calls, as Firebase handles its own offline persistence.
    if (evt.request.method !== 'GET' || evt.request.url.includes('firestore.googleapis.com')) {
        return;
    }

    evt.respondWith(
        caches.open(CACHE_NAME).then(async (cache) => {
            // Try to get the response from the cache.
            const cachedResponse = await cache.match(evt.request);
            
            // Fetch the response from the network in the background.
            const fetchPromise = fetch(evt.request).then((networkResponse) => {
                // If the fetch is successful, clone it and update the cache.
                cache.put(evt.request, networkResponse.clone());
                return networkResponse;
            }).catch(err => {
                console.warn('[Service Worker] Fetch failed, relying on cache.', err);
                // The fetch failed, but we might have a cached response to serve.
                // If not, the original 'cachedResponse' (which would be undefined) is returned.
            });

            // Return the cached response if it's available, otherwise wait for the network.
            return cachedResponse || fetchPromise;
        })
    );
});
