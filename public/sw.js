
const CACHE_NAME = 'fretepro-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/src/assets/favicon.svg',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/src/main.tsx',
  // Caches do Vite/React build
  '/src/index.css',
  // Adapte esta lista se tiver outros assets importantes!
];

// Instalação: cache de arquivos essenciais
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Ativação: limpar caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Interceptação de requests: serve cache primeiro, rede depois
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      return cachedResponse ||
        fetch(request)
          .then((response) => {
            // Atualiza o cache de arquivos navegação/html
            if (
              response &&
              response.status === 200 &&
              response.type === 'basic' &&
              request.url.startsWith(self.location.origin)
            ) {
              const respClone = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, respClone));
            }
            return response;
          })
          .catch(() => {
            // Se offline e sem cache, um fallback básico se for página HTML
            if (request.destination === 'document') {
              return caches.match('/index.html');
            }
          });
    })
  );
});
