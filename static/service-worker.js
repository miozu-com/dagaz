// Service Worker for Dagaz Blog PWA
const CACHE_NAME = 'dagaz-cache-v1.2';
const OFFLINE_URL = '/offline.html';

// Simplified assets to pre-cache - make sure all these files exist
const PRECACHE_ASSETS = ['/', '/offline.html', '/manifest.json', '/favicon.png'];

// Logging helper - disable in production
const DEBUG = false;

function log(...args) {
  if (DEBUG) {
    console.log('[ServiceWorker]', ...args);
  }
}

// Install event - Pre-cache essential assets with better error handling
self.addEventListener('install', event => {
  log('Installing Service Worker');

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(cache => {
        log('Caching app shell assets');
        // Cache assets one by one to prevent complete failure if one asset fails
        return Promise.all(
          PRECACHE_ASSETS.map(url => {
            return cache.add(url).catch(err => {
              log(`Failed to cache: ${url}`, err);
              // Continue even if one asset fails to cache
              return Promise.resolve();
            });
          })
        );
      })
      .then(() => {
        log('Installation completed');
        return self.skipWaiting();
      })
      .catch(err => {
        log('Installation failed:', err);
        // Don't throw here, just log the error
      })
  );
});

// Activate event - Clean up old caches
self.addEventListener('activate', event => {
  log('Activating Service Worker');

  event.waitUntil(
    caches
      .keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => cacheName !== CACHE_NAME)
            .map(cacheName => {
              log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        log('Service Worker activated');
        return self.clients.claim();
      })
      .catch(err => {
        log('Activation error:', err);
        // Don't throw here, just log the error
      })
  );
});

// Simplified fetch event handler to prevent infinite loops
self.addEventListener('fetch', event => {
  // Skip non-GET requests or requests to external domains
  if (
    event.request.method !== 'GET' ||
    !event.request.url.startsWith(self.location.origin) ||
    event.request.url.includes('browser-sync')
  ) {
    return;
  }

  const url = new URL(event.request.url);

  // Simple strategy: Try network first, then cache
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Clone the response to store in cache
        const responseToCache = response.clone();

        // Only cache successful responses from our origin
        if (response.ok && response.url.startsWith(self.location.origin)) {
          caches
            .open(CACHE_NAME)
            .then(cache => cache.put(event.request, responseToCache))
            .catch(err => log('Error caching response:', err));
        }

        return response;
      })
      .catch(() => {
        // Network failed, try the cache
        return caches
          .match(event.request)
          .then(cachedResponse => {
            if (cachedResponse) {
              return cachedResponse;
            }

            // For navigation requests, return the offline page
            if (event.request.mode === 'navigate') {
              return caches.match(OFFLINE_URL);
            }

            // Otherwise just return a 404-like response
            return new Response('', {
              status: 404,
              statusText: 'Not found'
            });
          })
          .catch(err => {
            log('Cache match error:', err);
            // Return offline page as ultimate fallback
            return caches.match(OFFLINE_URL);
          });
      })
  );
});

// Keep a simple message handler
self.addEventListener('message', event => {
  if (event.data === 'GET_VERSION') {
    try {
      event.ports[0].postMessage(CACHE_NAME);
    } catch (err) {
      log('Error in message handler:', err);
    }
  }
});

log('Service Worker script loaded');
