
const CACHE_NAME = 'fretepro-v2';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/src/assets/favicon.svg',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/maskable-192.png',
  '/icons/maskable-512.png',
  // Caches do Vite/React build
  '/src/index.css',
  '/src/main.tsx'
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
  
  // Ignorar solicitações não-GET e analytics
  if (request.method !== 'GET' || request.url.includes('analytics')) return;

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Se temos no cache, retornamos, mas também atualizamos em segundo plano
        const fetchPromise = fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const respClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, respClone));
          }
          return networkResponse;
        }).catch(() => cachedResponse);
        
        return cachedResponse;
      }

      // Se não está no cache, tentamos da rede
      return fetch(request)
        .then((response) => {
          // Não armazenamos em cache respostas com status diferente de 200
          if (!response || response.status !== 200) {
            return response;
          }

          // Clonamos a resposta pois o corpo só pode ser lido uma vez
          const respClone = response.clone();
          
          // Adicionamos ao cache somente se for do nosso site
          if (request.url.startsWith(self.location.origin)) {
            caches.open(CACHE_NAME).then((cache) => cache.put(request, respClone));
          }
          
          return response;
        })
        .catch(() => {
          // Fallback para HTML se estiver offline
          if (request.destination === 'document') {
            return caches.match('/index.html');
          }
        });
    })
  );
});

// Receber mensagens do cliente (app) para limpar o cache quando necessário
self.addEventListener('message', (event) => {
  if (event.data && event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
