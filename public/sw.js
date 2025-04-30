
importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-sw.js');

const { registerRoute } = workbox.routing;
const { CacheFirst, NetworkFirst, StaleWhileRevalidate } = workbox.strategies;
const { CacheableResponsePlugin } = workbox.cacheableResponse;
const { ExpirationPlugin } = workbox.expiration;

// Nome do cache
const CACHE_NAME = 'fretepro-v1';

// Lista de arquivos essenciais para o app shell
const APP_SHELL_FILES = [
  '/',
  '/index.html',
  '/src/index.css',
  '/src/assets/favicon.svg',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/maskable-192.png',
  '/icons/maskable-512.png',
  '/manifest.webmanifest'
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Instalando...');
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      console.log('[Service Worker] Cacheando app shell');
      await cache.addAll(APP_SHELL_FILES);
      self.skipWaiting();
    })()
  );
});

// Ativação do Service Worker
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Ativando...');
  event.waitUntil(
    (async () => {
      // Limpar caches antigos
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => {
            console.log(`[Service Worker] Removendo cache antigo: ${name}`);
            return caches.delete(name);
          })
      );
      // Tomar controle de clientes não controlados
      await self.clients.claim();
    })()
  );
});

// Configuração do Workbox
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

// Cache para scripts e styles
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

// Interceptar requisições fetch
self.addEventListener('fetch', (event) => {
  console.log(`[Service Worker] Requisição: ${event.request.url}`);
  
  // Para APIs e conteúdo dinâmico, tente usar o cache primeiro, depois a rede
  if (event.request.url.includes('/api/') || 
      event.request.url.includes('/rest/') || 
      event.request.url.includes('supabase.co')) {
    
    event.respondWith(
      (async () => {
        try {
          // Tentar buscar da rede primeiro
          const networkResponse = await fetch(event.request);
          
          // Salvar no cache se a resposta foi bem-sucedida
          if (networkResponse.ok) {
            const cache = await caches.open('fretepro-api');
            await cache.put(event.request, networkResponse.clone());
          }
          
          return networkResponse;
        } catch (error) {
          // Se falhar, tentar buscar do cache
          console.log('[Service Worker] Falha na rede, buscando do cache...');
          const cachedResponse = await caches.match(event.request);
          
          if (cachedResponse) {
            return cachedResponse;
          }
          
          // Se não estiver em cache, tentar fornecer uma resposta offline
          return new Response(JSON.stringify({ 
            error: 'Você está offline e este recurso não está disponível em cache.' 
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        }
      })()
    );
  }
});

// Fallback para página offline
workbox.routing.setCatchHandler(({ event }) => {
  if (!event.request || !event.request.destination) {
    return Response.error();
  }
  
  switch (event.request.destination) {
    case 'document':
      return caches.match('/index.html')
        .then(response => response || new Response('Você está offline. Por favor, verifique sua conexão.', {
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

// Funcionalidade de Background Sync para sistema distribuído
// ------------------------------------

// Constantes
const DB_NAME = 'fretepro-offline-db';
const STORE_NAME = 'pendingSync';
const API_ENDPOINT = 'https://xitctqydapolbooqnrul.supabase.co';

// Abrir ou criar o IndexedDB
function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 2);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('syncId', 'syncId', { unique: false });
        store.createIndex('type', 'type', { unique: false });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
  });
}

// Obter todos os dados pendentes de sincronização
async function getPendingSyncData() {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    
    // Obter apenas itens não sincronizados
    const items = [];
    
    store.openCursor().onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        if (!cursor.value._synced) {
          items.push(cursor.value);
        }
        cursor.continue();
      } else {
        resolve(items);
      }
    };
    
    transaction.onerror = () => reject(transaction.error);
  });
}

// Marcar dados como sincronizados
async function markAsSynced(ids) {
  const db = await openDatabase();
  const transaction = db.transaction(STORE_NAME, 'readwrite');
  const store = transaction.objectStore(STORE_NAME);
  
  for (const id of ids) {
    const request = store.get(id);
    request.onsuccess = () => {
      const item = request.result;
      if (item) {
        item._synced = true;
        store.put(item);
      }
    };
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
    return Promise.resolve(); // Nada para sincronizar
  }
  
  // IDs dos dados que foram sincronizados com sucesso
  const syncedIds = [];
  
  for (const item of pendingData) {
    try {
      const { type, data, syncId, _deleted } = item;
      
      // Obter token de autenticação da cache
      let token = null;
      try {
        const cacheResponse = await caches.match('/auth/token');
        if (cacheResponse) {
          const tokenData = await cacheResponse.json();
          token = tokenData.access_token;
        }
      } catch (error) {
        console.error('Erro ao obter token de autenticação:', error);
      }
      
      if (token) {
        // Realizar operação de sincronização baseada no status do item
        if (_deleted) {
          // Tentar excluir item do servidor
          await fetch(`${API_ENDPOINT}/rest/v1/${type}?sync_id=eq.${syncId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          // Marcar como sincronizado mesmo se falhar - tentará novamente depois
          syncedIds.push(item.id);
        } else {
          // Tentar salvar/atualizar item no servidor
          await fetch(`${API_ENDPOINT}/rest/v1/${type}`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
              'Prefer': 'resolution=merge-duplicates'
            },
            body: JSON.stringify({
              ...data,
              sync_id: syncId,
              sync_version: data.syncVersion || 1
            })
          });
          
          // Marcar como sincronizado
          syncedIds.push(item.id);
        }
      }
    } catch (error) {
      console.error('Erro sincronizando item:', error);
      // Continuar com o próximo item mesmo se houver erro
    }
  }
  
  // Marcar dados como sincronizados
  if (syncedIds.length > 0) {
    await markAsSynced(syncedIds);
  }
  
  return Promise.resolve();
}

// Função principal de sincronização
async function syncData() {
  try {
    await pushLocalDataToDatabase();
    
    // Notificar clientes que a sincronização foi concluída
    if (self.clients) {
      const clients = await self.clients.matchAll({ type: 'window' });
      clients.forEach(client => {
        client.postMessage({
          type: 'SYNC_COMPLETED',
          timestamp: new Date().toISOString()
        });
      });
    }
    
    return true;
  } catch (error) {
    console.error('Erro na sincronização:', error);
    return false;
  }
}

// Ouvinte para eventos de sincronização
self.addEventListener('sync', event => {
  if (event.tag === 'database-sync') {
    console.log('[Service Worker] Sincronizando dados em background...');
    event.waitUntil(syncData());
  }
});

// Ouvinte para eventos de sincronização periódica
self.addEventListener('periodicsync', event => {
  if (event.tag === 'periodic-sync') {
    console.log('[Service Worker] Sincronização periódica iniciada...');
    event.waitUntil(syncData());
  }
});

// Mensagens entre client e service worker
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SYNC_REQUEST') {
    console.log('[Service Worker] Recebeu solicitação de sincronização manual');
    event.waitUntil(
      syncData().then(() => {
        // Responder ao cliente que iniciou a sincronização
        if (event.source) {
          event.source.postMessage({
            type: 'SYNC_RESPONSE',
            success: true,
            timestamp: new Date().toISOString()
          });
        }
      }).catch((error) => {
        console.error('[Service Worker] Erro na sincronização manual:', error);
        if (event.source) {
          event.source.postMessage({
            type: 'SYNC_RESPONSE',
            success: false,
            error: error.message
          });
        }
      })
    );
  }
});
