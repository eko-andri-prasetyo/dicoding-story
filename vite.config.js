import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: process.env.NODE_ENV === "production" ? "/dicoding-story/" : "/",
  server: { port: 5173, open: true },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['leaflet']
        }
      }
    }
  },
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg}'],
        globIgnores: [
          '**/node_modules/**/*',
          'sw.js',
          'workbox-*.js',
          '**/*.map'
        ],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/story-api\.dicoding\.dev\/v1\//,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'dicoding-story-api-cache',
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/tile\.openstreetmap\.org\//,
            handler: 'CacheFirst',
            options: {
              cacheName: 'osm-tiles-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 hari
              },
            },
          },
          {
            urlPattern: /^https:\/\/story-api\.dicoding\.dev\/v1\/assets\/images\//,
            handler: 'CacheFirst',
            options: {
              cacheName: 'story-images-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 hari
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
      manifest: {
        name: 'Dicoding Story',
        short_name: 'StoryApp',
        description: 'Aplikasi PWA untuk submission Dicoding Story.',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        start_url: '/',
        display: 'standalone',
        icons: [
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
        shortcuts: [
          {
            name: 'Tambah Story Baru',
            short_name: 'Tambah',
            description: 'Membuka halaman untuk membuat story baru.',
            url: '/#/add',
            icons: [{ src: 'icons/add-shortcut-96x96.png', sizes: '96x96' }],
          },
        ],
        screenshots: [
          {
            src: 'screenshots/desktop-1.jpg',
            sizes: '1280x720',
            type: 'image/jpeg',
            form_factor: 'wide',
            label: 'Tampilan Daftar Story di Desktop',
          },
          {
            src: 'screenshots/mobile-1.jpg',
            sizes: '720x1280',
            type: 'image/jpeg',
            form_factor: 'narrow',
            label: 'Tampilan Tambah Story di Mobile',
          },
        ],
      },
    }),
  ],
});