// ============================================================
// KILIMO SMART - SERVICE WORKER
// ============================================================

const CACHE_NAME = 'kilimo-smart-v3';
const OFFLINE_URL = '/index.html';

// Assets to cache
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/manifest.json',
    '/images/icon-72.png',
    '/images/icon-96.png',
    '/images/icon-128.png',
    '/images/icon-144.png',
    '/images/icon-152.png',
    '/images/icon-192.png',
    '/images/icon-384.png',
    '/images/icon-512.png',
    '/images/default-avatar.png',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css'
];

// ============================================================
// INSTALL - Cache assets
// ============================================================
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[SW] Caching assets...');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(() => {
                console.log('[SW] Assets cached successfully');
                return self.skipWaiting();
            })
            .catch(err => {
                console.log('[SW] Cache failed:', err);
            })
    );
});

// ============================================================
// ACTIVATE - Clean old caches
// ============================================================
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(name => name !== CACHE_NAME)
                    .map(name => {
                        console.log('[SW] Deleting old cache:', name);
                        return caches.delete(name);
                    })
            );
        })
        .then(() => {
            console.log('[SW] Activated successfully');
            return self.clients.claim();
        })
    );
});

// ============================================================
// FETCH - Network first, then cache
// ============================================================
self.addEventListener('fetch', event => {
    // Skip cross-origin requests except CDN
    if (!event.request.url.startsWith(self.location.origin) &&
        !event.request.url.includes('cdnjs.cloudflare.com')) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then(response => {
                if (response && response.status === 200) {
                    const clonedResponse = response.clone();
                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, clonedResponse);
                        })
                        .catch(err => console.log('[SW] Cache put error:', err));
                }
                return response;
            })
            .catch(() => {
                return caches.match(event.request)
                    .then(cachedResponse => {
                        if (cachedResponse) {
                            return cachedResponse;
                        }
                        return caches.match(OFFLINE_URL);
                    });
            })
    );
});

// ============================================================
// BACKGROUND SYNC
// ============================================================
self.addEventListener('sync', event => {
    if (event.tag === 'sync-posts') {
        event.waitUntil(syncPendingPosts());
    }
});

async function syncPendingPosts() {
    try {
        const cache = await caches.open('pending-posts');
        const requests = await cache.keys();
        
        for (const request of requests) {
            const response = await cache.match(request);
            if (response) {
                const data = await response.json();
                console.log('[SW] Syncing post:', data);
                await cache.delete(request);
            }
        }
    } catch (error) {
        console.log('[SW] Sync failed:', error);
    }
}

// ============================================================
// PUSH NOTIFICATIONS
// ============================================================
self.addEventListener('push', event => {
    let data = {};
    
    try {
        data = event.data.json();
    } catch (e) {
        data = {
            title: 'Kilimo Smart',
            body: 'Habari mpya kutoka Kilimo Smart!'
        };
    }

    const options = {
        body: data.body || 'Habari mpya kutoka Kilimo Smart!',
        icon: '/images/icon-192.png',
        badge: '/images/icon-96.png',
        vibrate: [200, 100, 200],
        data: {
            url: data.url || '/'
        },
        actions: [
            {
                action: 'open',
                title: 'Fungua'
            },
            {
                action: 'close',
                title: 'Funga'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification(
            data.title || 'Kilimo Smart',
            options
        )
    );
});

// ============================================================
// NOTIFICATION CLICK
// ============================================================
self.addEventListener('notificationclick', event => {
    event.notification.close();

    if (event.action === 'close') {
        return;
    }

    event.waitUntil(
        clients.matchAll({ type: 'window' })
            .then(windowClients => {
                for (let client of windowClients) {
                    if (client.url === '/' && 'focus' in client) {
                        return client.focus();
                    }
                }
                if (clients.openWindow) {
                    return clients.openWindow('/');
                }
            })
    );
});

// ============================================================
// MESSAGE HANDLING
// ============================================================
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
