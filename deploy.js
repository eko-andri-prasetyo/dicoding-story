import { writeFileSync, copyFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Buat file sw.js di root dist folder untuk GitHub Pages
const distPath = join(__dirname, 'dist');
const swContent = `// Service Worker untuk production
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.6.0/workbox-sw.js');

workbox.setConfig({
  debug: false
});

const CACHE_NAME = "story-cache-v4";
const urlsToCache = [
  "/dicoding-story/",
  "/dicoding-story/index.html",
  "/dicoding-story/src/app/main.js",
  "/dicoding-story/src/assets/styles.css",
  "/dicoding-story/icons/icon-192.png",
  "/dicoding-story/icons/icon-512.png",
  "/dicoding-story/icons/icon-72.png"
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

// Cache strategies menggunakan Workbox
workbox.routing.registerRoute(
  new RegExp('^https://story-api\\\\.dicoding\\\\.dev/v1/stories'),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'dicoding-story-api-cache',
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

workbox.routing.registerRoute(
  new RegExp('^https://tile\\\\.openstreetmap\\\\.org/'),
  new workbox.strategies.CacheFirst({
    cacheName: 'osm-tiles-cache',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 30 * 24 * 60 * 60,
      }),
    ],
  })
);

workbox.routing.registerRoute(
  new RegExp('^https://story-api\\\\.dicoding\\\\.dev/v1/assets/images/'),
  new workbox.strategies.CacheFirst({
    cacheName: 'story-images-cache',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 30 * 24 * 60 * 60,
      }),
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

// Push Notification
self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : {};
  const title = data.title || 'Dicoding Story';
  const options = {
    body: data.message || 'Ada cerita baru yang ditambahkan!',
    icon: '/dicoding-story/icons/icon-192.png',
    badge: '/dicoding-story/icons/icon-72.png',
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
      return clients.openWindow('/dicoding-story/#/stories');
    })
  );
});
`;

// Pastikan folder dist exists
if (!existsSync(distPath)) {
  mkdirSync(distPath, { recursive: true });
}

// Tulis service worker untuk production
writeFileSync(join(distPath, 'sw.js'), swContent);
console.log('✅ Production service worker created successfully!');

// Copy sw.js ke root untuk development
const devSwPath = join(__dirname, 'sw.js');
if (existsSync(devSwPath)) {
  copyFileSync(devSwPath, join(distPath, '../sw.js'));
  console.log('✅ Development service worker copied successfully!');
} else {
  console.log('ℹ️  Development service worker not found, skipping copy');
}