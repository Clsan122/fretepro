
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
  if (!event.request || !event.request.destination) {
    return Response.error();
  }
  
  switch (event.request.destination) {
    case 'document':
      return caches.match('/index.html')
        .then(response => response || new Response('Você está offline.', {
          status: 200,
          headers: { 'Content-Type': 'text/html' }
        }));
    case 'image':
      return caches.match('/icons/icon-192.png')
        .then(response => response || new Response('', {
          status: 200,
          headers: { 'Content-Type': 'image/png' }
        }));
    default:
      return Response.error();
  }
});

// Funcionalidade de Background Sync
// ------------------------------------

// Armazenar dados que precisam ser sincronizados
const DB_NAME = 'fretepro-offline-db';
const STORE_NAME = 'pendingSync';

// Abrir ou criar o IndexedDB
function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

// Salvar dados no IndexedDB para sincronização posterior
async function saveForSync(data) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.add({
      data,
      timestamp: Date.now()
    });
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Obter todos os dados pendentes de sincronização
async function getPendingSyncData() {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Remover dados sincronizados com sucesso
async function removeSyncedData(ids) {
  const db = await openDatabase();
  const transaction = db.transaction(STORE_NAME, 'readwrite');
  const store = transaction.objectStore(STORE_NAME);
  
  for (const id of ids) {
    store.delete(id);
  }
  
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

// Função para sincronizar dados com o servidor
async function pushLocalDataToDatabase() {
  const pendingData = await getPendingSyncData();
  if (!pendingData || pendingData.length === 0) {
    return;
  }
  
  // IDs dos dados que foram sincronizados com sucesso
  const syncedIds = [];
  
  for (const item of pendingData) {
    try {
      // Tentar enviar dados para o servidor
      const response = await fetch('/api/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item.data),
      });
      
      if (response.ok) {
        syncedIds.push(item.id);
      }
    } catch (error) {
      console.error('Error syncing data:', error);
      // Continuar com o próximo item se houver erro
    }
  }
  
  // Remover dados sincronizados com sucesso
  if (syncedIds.length > 0) {
    await removeSyncedData(syncedIds);
  }
  
  return Promise.resolve(); // Resolve the promise to indicate sync completion
}

// Função para buscar novo conteúdo
async function fetchNewContent() {
  try {
    // Buscar dados atualizados aqui
    const cache = await caches.open('fretepro-dynamic-data');
    
    // Exemplos de endpoints que você pode querer atualizar no cache
    const urls = [
      '/api/updates',
      '/api/notifications'
    ];
    
    // Atualizar o cache para cada URL
    for (const url of urls) {
      try {
        const response = await fetch(url);
        if (response.ok) {
          await cache.put(url, response);
        }
      } catch (error) {
        console.error(`Error fetching ${url}:`, error);
      }
    }
    
    return Promise.resolve();
  } catch (error) {
    console.error('Error in fetchNewContent:', error);
    return Promise.resolve(); // Resolve anyway to prevent the sync from retrying indefinitely
  }
}

// Adicionar ouvinte para eventos de sincronização
self.addEventListener('sync', event => {
  if (event.tag === 'database-sync') {
    event.waitUntil(pushLocalDataToDatabase());
  }
});

// Adicionar ouvinte para eventos de sincronização periódica
self.addEventListener('periodicsync', event => {
  if (event.tag === 'fetch-new-content') {
    event.waitUntil(fetchNewContent());
  }
});

// Skip waiting e clients claim
self.skipWaiting();
workbox.core.clientsClaim();
