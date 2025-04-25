
importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-sw.js');

const { registerRoute } = workbox.routing;
const { CacheFirst, NetworkFirst, StaleWhileRevalidate } = workbox.strategies;
const { CacheableResponsePlugin } = workbox.cacheableResponse;
const { ExpirationPlugin } = workbox.expiration;

// Nome do cache
workbox.core.setCacheNameDetails({
  prefix: 'fretepro',
  suffix: 'v1',
  precache: 'precache',
  runtime: 'runtime'
});

// Precache manifestos e assets estáticos
workbox.precaching.precacheAndRoute([
  { url: '/', revision: '1' },
  { url: '/index.html', revision: '1' },
  { url: '/manifest.webmanifest', revision: '1' },
  { url: '/src/assets/favicon.svg', revision: '1' },
  { url: '/icons/icon-192.png', revision: '1' },
  { url: '/icons/icon-512.png', revision: '1' },
  { url: '/src/index.css', revision: '1' }
]);

// Cache para imagens
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'fretepro-images',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200]
      }),
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60 // 30 dias
      })
    ]
  })
);

// Cache para fontes
registerRoute(
  ({ request }) => request.destination === 'font',
  new CacheFirst({
    cacheName: 'fretepro-fonts',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200]
      }),
      new ExpirationPlugin({
        maxEntries: 30,
        maxAgeSeconds: 60 * 60 * 24 * 365 // 1 ano
      })
    ]
  })
);

// Cache para API e dados dinâmicos
registerRoute(
  ({ request }) => request.destination === 'script' || 
                   request.destination === 'style',
  new StaleWhileRevalidate({
    cacheName: 'fretepro-resources',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200]
      }),
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 24 * 60 * 60 // 24 horas
      })
    ]
  })
);

// Cache para páginas HTML com Network First
registerRoute(
  ({ request }) => request.mode === 'navigate',
  new NetworkFirst({
    cacheName: 'fretepro-pages',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200]
      })
    ]
  })
);

// Fallback para página offline
workbox.routing.setCatchHandler(({ event }) => {
  switch (event.request.destination) {
    case 'document':
      return caches.match('/index.html');
    case 'image':
      return caches.match('/icons/icon-192.png');
    default:
      return Response.error();
  }
});

// Skip waiting e clients claim
self.skipWaiting();
workbox.core.clientsClaim();

