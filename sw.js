const CACHE_NAME = "story-cache-v4";
const urlsToCache = [
  "/",
  "/index.html",
  "/src/app/main.js",
  "/src/assets/styles.css",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/icon-72.png"
];

// Install: cache app shell
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// Activate: hapus cache lama
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => k !== CACHE_NAME && caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: network first, fallback cache
self.addEventListener("fetch", e => {
  // Jangan cache request POST
  if (e.request.method === 'POST') {
    return;
  }
  
  // Cache API responses (hanya GET requests)
  if (e.request.url.includes('story-api.dicoding.dev/v1/stories') && e.request.method === 'GET') {
    e.respondWith(
      caches.open('api-cache').then(cache => {
        return fetch(e.request).then(response => {
          // Hanya cache response yang valid
          if (response.status === 200) {
            cache.put(e.request, response.clone());
          }
          return response;
        }).catch(() => {
          return caches.match(e.request);
        });
      })
    );
  }
  
  // Cache images with CacheFirst strategy
  else if (e.request.url.includes('/assets/images/') && e.request.method === 'GET') {
    e.respondWith(
      caches.match(e.request).then(cachedResponse => {
        return cachedResponse || fetch(e.request).then(response => {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(e.request, response.clone());
            return response;
          });
        });
      })
    );
  } else if (e.request.method === 'GET') {
    // For other GET resources: network first, then cache
    e.respondWith(
      fetch(e.request).catch(() => caches.match(e.request))
    );
  }
});

// Push Notification
self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : {};
  const title = data.title || 'Dicoding Story';
  const options = {
    body: data.message || 'Ada cerita baru yang ditambahkan!',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-72.png',
    vibrate: [200, 100, 200],
    tag: 'story-notification'
  };
  e.waitUntil(self.registration.showNotification(title, options));
});

// Notification click
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      if (clientList.length > 0) {
        return clientList[0].focus();
      }
      return clients.openWindow('/#/stories');
    })
  );
});