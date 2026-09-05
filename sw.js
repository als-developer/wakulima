const CACHE_NAME = 'kilimo-smart-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/css/style.css',
    '/css/dark-mode.css',
    '/css/animations.css',
    '/js/app.js',
    '/js/auth.js',
    '/js/posts.js',
    '/js/marketplace.js',
    '/js/education.js',
    '/js/weather.js',
    '/js/notifications.js',
    '/js/pwa.js',
    '/images/icon-192.png',
    '/images/icon-512.png',
    '/images/logo.png'
];

// Install Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS_TO_CACHE))
            .then(() => self.skipWaiting())
    );
});

// Activate Service Worker
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(name => name !== CACHE_NAME)
                    .map(name => caches.delete(name))
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch with Network First Strategy
self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request)
            .then(response => {
                const responseClone = response.clone();
                caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, responseClone);
                });
                return response;
            })
            .catch(() => caches.match(event.request))
    );
});

// Background Sync for Offline Posts
self.addEventListener('sync', event => {
    if (event.tag === 'sync-posts') {
        event.waitUntil(syncPendingPosts());
    }
});

async function syncPendingPosts() {
    const cache = await caches.open('pending-posts');
    const requests = await cache.keys();
    for (const request of requests) {
        const response = await cache.match(request);
        if (response) {
            try {
                const data = await response.json();
                await fetch('/api/posts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                await cache.delete(request);
            } catch (error) {
                console.log('Sync failed, retry later');
            }
        }
    }
}

// Push Notifications
self.addEventListener('push', event => {
    const data = event.data.json();
    const options = {
        body: data.body || 'Habari mpya kutoka Kilimo Smart!',
        icon: '/images/icon-192.png',
        badge: '/images/icon-192.png',
        vibrate: [200, 100, 200],
        data: { url: data.url || '/' }
    };
    event.waitUntil(
        self.registration.showNotification('Kilimo Smart', options)
    );
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.url || '/')
    );
});
