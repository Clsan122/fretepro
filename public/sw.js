
importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-sw.js');

const { registerRoute } = workbox.routing;
const { CacheFirst, NetworkFirst, StaleWhileRevalidate } = workbox.strategies;
const { CacheableResponsePlugin } = workbox.cacheableResponse;
const { ExpirationPlugin } = workbox.expiration;

// Nome do cache
const CACHE_NAME = 'fretevalor-v2';

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

// Destacar o service worker para que ele seja facilmente detectável
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Instalando...');
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      console.log('[Service Worker] Cacheando app shell');
      await cache.addAll(APP_SHELL_FILES);
      // Adicionar screenshots ao cache
      try {
        const screenshotUrls = [
          '/screenshots/landing-page.png',
          '/screenshots/dashboard-relatorios.png',
          '/screenshots/novo-cliente.png',
          '/screenshots/ordem-coleta-detalhes.png',
          '/screenshots/novo-frete.png',
          '/screenshots/cadastro-motorista.png'
        ];
        await cache.addAll(screenshotUrls);
        console.log('[Service Worker] Screenshots cacheados');
      } catch (err) {
        console.error('[Service Worker] Erro ao cachear screenshots:', err);
      }
      self.skipWaiting();
    })()
  );
});

// Ativação do Service Worker com skipWaiting e clients.claim para controle imediato
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
      // Tomar controle de clientes não controlados imediatamente
      await self.clients.claim();
    })()
  );
});

// Configuração do Workbox
workbox.core.setCacheNameDetails({
  prefix: 'fretevalor',
  suffix: 'v2',
  precache: 'precache',
  runtime: 'runtime'
});

// Precache manifestos e assets estáticos
workbox.precaching.precacheAndRoute([
  { url: '/', revision: '2' },
  { url: '/index.html', revision: '2' },
  { url: '/manifest.webmanifest', revision: '2' },
  { url: '/icons/icon-192.png', revision: '2' },
  { url: '/icons/icon-512.png', revision: '2' },
  { url: '/screenshots/landing-page.png', revision: '1' },
  { url: '/screenshots/dashboard-relatorios.png', revision: '1' },
  { url: '/screenshots/novo-cliente.png', revision: '1' },
  { url: '/screenshots/ordem-coleta-detalhes.png', revision: '1' },
  { url: '/screenshots/novo-frete.png', revision: '1' },
  { url: '/screenshots/cadastro-motorista.png', revision: '1' }
]);

// Cache para imagens
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'fretevalor-images',
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
    cacheName: 'fretevalor-fonts',
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
    cacheName: 'fretevalor-resources',
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
    cacheName: 'fretevalor-pages',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200]
      })
    ]
  })
);

// Ouvir mensagens do cliente
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_SCREENSHOTS') {
    const { urls } = event.data;
    caches.open(CACHE_NAME).then(cache => {
      cache.addAll(urls).then(() => {
        console.log('[Service Worker] Screenshots cacheados via mensagem');
        if (event.source) {
          event.source.postMessage({
            type: 'CACHE_COMPLETE',
            success: true
          });
        }
      }).catch(error => {
        console.error('[Service Worker] Erro ao cachear screenshots:', error);
        if (event.source) {
          event.source.postMessage({
            type: 'CACHE_COMPLETE',
            success: false,
            error: error.message
          });
        }
      });
    });
  }
  
  // Sincronização manual solicitada pelo cliente
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

// Notification click listener para interação com notificações
self.addEventListener('notificationclick', (event) => {
  const notification = event.notification;
  const action = event.action;
  
  if (action === 'close') {
    notification.close();
  } else {
    // Ação padrão é abrir o app
    notification.close();
    event.waitUntil(
      clients.matchAll({type: 'window'}).then(windowClients => {
        // Verificar se já existe uma janela aberta e focar nela
        for (const client of windowClients) {
          if (client.url.indexOf(self.location.origin) !== -1 && 'focus' in client) {
            return client.focus();
          }
        }
        // Se não existe nenhuma janela aberta, abrir uma nova
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
    );
  }
});

// Push notification listener
self.addEventListener('push', (event) => {
  if (!event.data) {
    console.log('[Service Worker] Push recebido mas sem dados');
    return;
  }
  
  try {
    const data = event.data.json();
    const options = {
      body: data.body || 'Nova notificação do FreteValor',
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      vibrate: [100, 50, 100],
      data: {
        url: data.url || '/',
        timestamp: Date.now()
      },
      actions: [
        {
          action: 'view',
          title: 'Ver detalhes'
        },
        {
          action: 'close',
          title: 'Fechar'
        }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'FreteValor', options)
    );
  } catch (error) {
    console.error('[Service Worker] Erro ao processar notificação push:', error);
    
    // Tentar mostrar uma notificação padrão
    event.waitUntil(
      self.registration.showNotification('FreteValor', {
        body: 'Nova notificação',
        icon: '/icons/icon-192.png'
      })
    );
  }
});

// Funcionalidade de Background Sync para sistema distribuído
// ------------------------------------

// Função para abrir ou criar o IndexedDB
function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('fretevalor-offline-db', 2);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('pendingSync')) {
        const store = db.createObjectStore('pendingSync', { keyPath: 'id' });
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
    const transaction = db.transaction('pendingSync', 'readonly');
    const store = transaction.objectStore('pendingSync');
    
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
  const transaction = db.transaction('pendingSync', 'readwrite');
  const store = transaction.objectStore('pendingSync');
  
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

// Função principal de sincronização
async function syncData() {
  try {
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
          const API_ENDPOINT = 'https://xitctqydapolbooqnrul.supabase.co';
          
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
            
            // Marcar como sincronizado
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
